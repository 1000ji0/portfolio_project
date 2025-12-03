import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PublicationsPage() {
  const supabase = await createClient()
  const { data: papers } = await supabase
    .from('papers')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Publications</h1>
        
        {!papers || papers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">등록된 논문이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{paper.title}</h2>
                <p className="text-gray-600 mb-2">{paper.authors}</p>
                {paper.venue && (
                  <p className="text-sm text-gray-500 mb-2">{paper.venue} ({paper.year})</p>
                )}
                {paper.abstract && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{paper.abstract}</p>
                )}
                {paper.tags && paper.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {paper.pdf_file_path && (
                    <a
                      href={paper.pdf_file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      PDF 다운로드
                    </a>
                  )}
                  <Link
                    href={`/publications/${paper.id}`}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    AI로 요약/정리하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

