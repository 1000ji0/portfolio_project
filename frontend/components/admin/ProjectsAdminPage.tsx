'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Project {
  id?: string
  title: string
  description: string
  tech_stack?: string[]
  github_url?: string
  demo_url?: string
  image_urls?: string[]
  detailed_description?: string
}

export function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    tech_stack: [],
    github_url: '',
    demo_url: '',
    image_urls: [],
    detailed_description: '',
  })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', formData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(formData)
        if (error) throw error
      }
      await loadProjects()
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        tech_stack: [],
        github_url: '',
        demo_url: '',
        image_urls: [],
        detailed_description: '',
      })
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 실패')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return

    try {
      await supabase.from('projects').delete().eq('id', id)
      await loadProjects()
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 실패')
    }
  }

  if (loading) {
    return <div className="text-gray-600">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">프로젝트 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          <span>새 프로젝트 추가</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">프로젝트 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트명 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기술 스택 (쉼표로 구분)
              </label>
              <input
                type="text"
                placeholder="예: React, Next.js, TypeScript"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tech_stack: e.target.value.split(',').map((t) => t.trim()),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상세 설명
              </label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) =>
                  setFormData({ ...formData, detailed_description: e.target.value })
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setFormData(project as any)
                  setShowForm(true)
                }}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => project.id && handleDelete(project.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


