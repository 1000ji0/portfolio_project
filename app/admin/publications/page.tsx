'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Paper {
  id: string
  title: string
  authors: string
  venue: string | null
  year: number | null
  abstract: string | null
  tags: string[] | null
  pdf_file_path: string | null
}

export default function PublicationsPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    venue: '',
    year: new Date().getFullYear(),
    abstract: '',
    tags: [] as string[],
    pdf: null as File | null,
  })

  useEffect(() => {
    loadPapers()
  }, [])

  async function loadPapers() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error loading papers:', error)
    } else {
      setPapers(data || [])
    }
    setLoading(false)
  }

  function handleEdit(paper: Paper) {
    setEditingPaper(paper)
    setFormData({
      title: paper.title,
      authors: paper.authors,
      venue: paper.venue || '',
      year: paper.year || new Date().getFullYear(),
      abstract: paper.abstract || '',
      tags: paper.tags || [],
      pdf: null,
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingPaper(null)
    setFormData({
      title: '',
      authors: '',
      venue: '',
      year: new Date().getFullYear(),
      abstract: '',
      tags: [] as string[],
      pdf: null,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const paperData: any = {
      title: formData.title,
      authors: formData.authors,
      venue: formData.venue || null,
      year: formData.year || null,
      abstract: formData.abstract || null,
      tags: formData.tags.filter((t) => t.trim()),
    }

    if (editingPaper) {
      const { error } = await supabase
        .from('papers')
        .update(paperData)
        .eq('id', editingPaper.id)

      if (error) {
        alert('저장 중 오류가 발생했습니다: ' + error.message)
      } else {
        alert('저장되었습니다.')
        handleCancel()
        loadPapers()
      }
    } else {
      // PDF 업로드 필요
      if (!formData.pdf) {
        alert('PDF 파일을 업로드해주세요.')
        return
      }

      const uploadFormData = new FormData()
      uploadFormData.append('file', formData.pdf)
      uploadFormData.append('paperData', JSON.stringify(paperData))

      const response = await fetch('/api/admin/publications/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const error = await response.json()
        alert('업로드 중 오류가 발생했습니다: ' + error.error)
      } else {
        alert('논문이 업로드되고 처리되었습니다.')
        handleCancel()
        loadPapers()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('이 논문을 삭제하시겠습니까?')) return

    const supabase = createClient()
    const { error } = await supabase.from('papers').delete().eq('id', id)

    if (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message)
    } else {
      loadPapers()
    }
  }

  function addTag() {
    const tag = prompt('태그를 입력하세요:')
    if (tag) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  function removeTag(index: number) {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">논문 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          새 논문 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingPaper ? '논문 수정' : '새 논문 추가'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">저자 *</label>
              <input
                type="text"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학회/저널명</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">초록</label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                태그 추가
              </button>
            </div>
            {!editingPaper && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF 파일 *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, pdf: e.target.files?.[0] || null })}
                  required={!editingPaper}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">저자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연도</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {papers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  등록된 논문이 없습니다.
                </td>
              </tr>
            ) : (
              papers.map((paper) => (
                <tr key={paper.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{paper.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{paper.authors}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{paper.year || '-'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(paper)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(paper.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

