import { createSupabaseServerClient } from '@/lib/supabase/server'
import PaperChat from '@/components/PaperChat'
import FadeInOnScroll from '@/components/FadeInOnScroll'

export default async function PublicationsPage() {
  let selectedPaper = null
  try {
    const supabase = createSupabaseServerClient()
    const { data: papers, error } = await supabase
      .from('papers')
      .select('*')
      .order('year', { ascending: false })
    
    if (error) {
      console.error('Papers fetch error:', error)
    } else {
      // 첫 번째 논문을 기본으로 선택 (있을 경우)
      selectedPaper = papers && papers.length > 0 ? papers[0] : null
    }
  } catch (error: any) {
    console.error('Failed to initialize Supabase:', error.message || error)
    // 환경 변수 문제일 수 있으므로 계속 진행
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Paper
          </span>
        </h1>
        
        {/* 논문 정보 + 채팅창 */}
        <FadeInOnScroll delay={0} direction="up">
          <div>
            {selectedPaper ? (
              <PaperChat paper={selectedPaper} />
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <p className="text-gray-400 text-center">논문을 선택해주세요</p>
              </div>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}

