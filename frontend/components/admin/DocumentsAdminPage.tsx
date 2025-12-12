'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Upload, Trash2, Download } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface Document {
  id: string
  file_name: string
  file_path: string
  description?: string
  file_size?: number
  created_at: string
}

export function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.')
        continue
      }

      setUploading(true)
      try {
        // Supabase Storage에 업로드
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${file.name}`
        const filePath = `documents/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // 백엔드 API로 PDF 처리 요청
        const formData = new FormData()
        formData.append('file', file)
        formData.append('description', '')
        formData.append('source_type', 'document')

        const response = await fetch('http://localhost:7001/api/process-document', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('문서 처리 실패')
        }

        // 문서 레코드 생성
        const { error: insertError } = await supabase.from('documents').insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
        })

        if (insertError) throw insertError

        await loadDocuments()
      } catch (error) {
        console.error('Upload error:', error)
        alert('업로드 실패: ' + (error as Error).message)
      } finally {
        setUploading(false)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  })

  async function handleDelete(id: string, filePath: string) {
    if (!confirm('이 문서를 삭제하시겠습니까?')) return

    try {
      // Storage에서 파일 삭제
      await supabase.storage.from('documents').remove([filePath])

      // 관련 임베딩 삭제
      await supabase.from('embeddings').delete().eq('source_id', id)

      // 문서 레코드 삭제
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) throw error

      await loadDocuments()
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 실패')
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return <div className="text-gray-600">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">문서 관리</h1>
      </div>

      {/* 업로드 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-8 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          {isDragActive
            ? '파일을 여기에 놓으세요'
            : 'PDF 파일을 드래그하거나 클릭하여 업로드'}
        </p>
        {uploading && <p className="text-blue-600">처리 중...</p>}
      </div>

      {/* 문서 목록 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                파일명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                크기
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                업로드일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  등록된 문서가 없습니다.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.file_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(doc.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <a
                        href={supabase.storage
                          .from('documents')
                          .getPublicUrl(doc.file_path).data.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id, doc.file_path)}
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

