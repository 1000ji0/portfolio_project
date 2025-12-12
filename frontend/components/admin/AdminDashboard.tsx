'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { FileText, BookOpen, FolderOpen, Plus } from 'lucide-react'
import Link from 'next/link'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    documents: 0,
    papers: 0,
    projects: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [documents, papers, projects] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact' }),
        supabase.from('papers').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
      ])

      setStats({
        documents: documents.count || 0,
        papers: papers.count || 0,
        projects: projects.count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-600">로딩 중...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">문서</p>
              <p className="text-3xl font-bold text-gray-900">{stats.documents}</p>
            </div>
            <FileText size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">논문</p>
              <p className="text-3xl font-bold text-gray-900">{stats.papers}</p>
            </div>
            <BookOpen size={32} className="text-purple-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">프로젝트</p>
              <p className="text-3xl font-bold text-gray-900">{stats.projects}</p>
            </div>
            <FolderOpen size={32} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/documents"
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>새 문서 업로드</span>
          </Link>
          <Link
            href="/admin/publications"
            className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            <span>새 논문 추가</span>
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>새 프로젝트 추가</span>
          </Link>
        </div>
      </div>
    </div>
  )
}


