'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { FileText, Download, Sparkles } from 'lucide-react'
import Link from 'next/link'

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

export function PublicationsPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    loadPapers()
  }, [filterYear, sortOrder])

  async function loadPapers() {
    try {
      let query = supabase.from('papers').select('*')

      if (filterYear) {
        query = query.eq('year', filterYear)
      }

      const { data, error } = await query.order(
        'year',
        { ascending: sortOrder === 'oldest' }
      )

      if (error) throw error
      setPapers(data || [])
    } catch (error) {
      console.error('Error loading papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from(
    new Set(papers.map((p) => p.year).filter((y): y is number => y !== null))
  ).sort((a, b) => b - a)

  const getPdfUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('paper-pdfs').getPublicUrl(path)
    return data.publicUrl
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Publications</h1>

      {/* 필터 및 정렬 */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">연도:</label>
          <select
            value={filterYear || ''}
            onChange={(e) =>
              setFilterYear(e.target.value ? parseInt(e.target.value) : null)
            }
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">정렬:</label>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'newest' | 'oldest')
            }
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      {/* 논문 목록 */}
      {papers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">등록된 논문이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {paper.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">저자:</span>{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: paper.authors.replace(
                      /천지영|Ji-Yeong Cheon/g,
                      '<span class="font-semibold text-blue-600">$&</span>'
                    ),
                  }}
                />
              </p>
              {paper.venue && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">학회/저널:</span> {paper.venue}
                </p>
              )}
              {paper.year && (
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">연도:</span> {paper.year}
                </p>
              )}
              {paper.abstract && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
              )}
              {paper.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {paper.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex space-x-2">
                {paper.pdf_file_path && (
                  <a
                    href={getPdfUrl(paper.pdf_file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download size={14} />
                    <span>PDF</span>
                  </a>
                )}
                <Link
                  href={`/publications/${paper.id}`}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  <Sparkles size={14} />
                  <span>AI 분석</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


