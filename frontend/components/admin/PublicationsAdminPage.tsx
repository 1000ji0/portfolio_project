'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'

interface Paper {
  id: string
  title: string
  authors: string
  venue?: string
  year?: number
  abstract?: string
  tags?: string[]
  pdf_file_path?: string
  created_at: string
}

export function PublicationsAdminPage() {
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
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPapers()
  }, [])

  async function loadPapers() {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPapers(data || [])
    } catch (error) {
      console.error('Error loading papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }

    setUploading(true)
    try {
      // 먼저 논문 레코드 생성
      const { data: paper, error: insertError } = await supabase
        .from('papers')
        .insert({
          ...formData,
          year: formData.year || null,
          tags: formData.tags.length > 0 ? formData.tags : null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // PDF 업로드
      const fileExt = file.name.split('.').pop()
      const fileName = `${paper.id}_${Date.now()}.${fileExt}`
      const filePath = `papers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('paper-pdfs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 논문 레코드 업데이트
      await supabase
        .from('papers')
        .update({ pdf_file_path: filePath })
        .eq('id', paper.id)

      // 백엔드로 PDF 처리 요청
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      formDataObj.append('source_type', 'paper')
      formDataObj.append('source_id', paper.id)

      await fetch('http://localhost:7001/api/process-document', {
        method: 'POST',
        body: formDataObj,
      })

      await loadPapers()
      setShowForm(false)
      setFormData({
        title: '',
        authors: '',
        venue: '',
        year: new Date().getFullYear(),
        abstract: '',
        tags: [],
      })
    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드 실패')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  async function handleDelete(id: string) {
    if (!confirm('이 논문을 삭제하시겠습니까?')) return

    try {
      const paper = papers.find((p) => p.id === id)
      if (paper?.pdf_file_path) {
        await supabase.storage.from('paper-pdfs').remove([paper.pdf_file_path])
      }
      await supabase.from('embeddings').delete().eq('source_id', id)
      await supabase.from('papers').delete().eq('id', id)
      await loadPapers()
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
        <h1 className="text-3xl font-bold text-gray-900">논문 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          <span>새 논문 추가</span>
        </button>
      </div>

      {/* 논문 추가 폼 */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">논문 정보 입력</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                저자 *
              </label>
              <input
                type="text"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학회/저널
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연도
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                초록
              </label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                placeholder="예: AI, LLM, Multi-Agent"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map((t) => t.trim()),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF 파일 업로드 *
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
              >
                <input {...getInputProps()} />
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  PDF 파일을 드래그하거나 클릭하여 업로드
                </p>
                {uploading && <p className="text-blue-600 mt-2">처리 중...</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 논문 목록 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                저자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                연도
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {papers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  등록된 논문이 없습니다.
                </td>
              </tr>
            ) : (
              papers.map((paper) => (
                <tr key={paper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {paper.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{paper.authors}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{paper.year || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/publications/${paper.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(paper.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

