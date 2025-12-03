'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[] | null
  github_url: string | null
  demo_url: string | null
  image_urls: string[] | null
  detailed_description: string | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: [] as string[],
    github_url: '',
    demo_url: '',
    detailed_description: '',
    images: [] as File[],
  })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading projects:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack || [],
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      detailed_description: project.detailed_description || '',
      images: [],
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      tech_stack: [],
      github_url: '',
      demo_url: '',
      detailed_description: '',
      images: [],
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const projectData: any = {
      title: formData.title,
      description: formData.description,
      tech_stack: formData.tech_stack.filter((t) => t.trim()),
      github_url: formData.github_url || null,
      demo_url: formData.demo_url || null,
      detailed_description: formData.detailed_description || null,
    }

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id)

      if (error) {
        alert('저장 중 오류가 발생했습니다: ' + error.message)
      } else {
        alert('저장되었습니다.')
        handleCancel()
        loadProjects()
      }
    } else {
      // 이미지 업로드 및 프로젝트 생성
      const uploadFormData = new FormData()
      uploadFormData.append('projectData', JSON.stringify(projectData))
      formData.images.forEach((img) => {
        uploadFormData.append('images', img)
      })

      const response = await fetch('/api/admin/projects/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const error = await response.json()
        alert('업로드 중 오류가 발생했습니다: ' + error.error)
      } else {
        alert('프로젝트가 저장되었습니다.')
        handleCancel()
        loadProjects()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return

    const supabase = createClient()
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message)
    } else {
      loadProjects()
    }
  }

  function addTechStack() {
    const tech = prompt('기술 스택을 입력하세요:')
    if (tech) {
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, tech] })
    }
  }

  function removeTechStack(index: number) {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">프로젝트 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          새 프로젝트 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트명 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">한 줄 설명 *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기술 스택</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechStack(idx)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addTechStack}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                기술 추가
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {!editingProject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: Array.from(e.target.files || []),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {project.image_urls && project.image_urls.length > 0 && (
              <img
                src={project.image_urls[0]}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

