import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PaperAI from '@/components/PaperAI'

export default async function PaperDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createSupabaseServerClient()
  const { data: paper } = await supabase
    .from('papers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!paper) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{paper.title}</h1>
          <p className="text-xl text-gray-600 mb-2">{paper.authors}</p>
          {paper.venue && (
            <p className="text-lg text-gray-500 mb-4">
              {paper.venue} ({paper.year})
            </p>
          )}
          {paper.abstract && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">초록</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{paper.abstract}</p>
            </div>
          )}
        </div>

        <PaperAI paperId={paper.id} paperTitle={paper.title} pdfUrl={paper.pdf_file_path} />
      </div>
    </div>
  )
}

