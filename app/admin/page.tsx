import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [documentsResult, papersResult, projectsResult] = await Promise.all([
    supabase.from('documents').select('id', { count: 'exact' }),
    supabase.from('papers').select('id', { count: 'exact' }),
    supabase.from('projects').select('id', { count: 'exact' }),
  ])

  const stats = {
    documents: documentsResult.count || 0,
    papers: papersResult.count || 0,
    projects: projectsResult.count || 0,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">업로드된 문서</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.documents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">논문 수</h2>
          <p className="text-3xl font-bold text-green-600">{stats.papers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">프로젝트 수</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.projects}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/documents"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            PDF 문서 업로드
          </a>
          <a
            href="/admin/publications"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            새 논문 추가
          </a>
          <a
            href="/admin/projects"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            새 프로젝트 추가
          </a>
        </div>
      </div>
    </div>
  )
}

