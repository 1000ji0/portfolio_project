import HomeChatbot from '@/components/HomeChatbot'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {profile?.profile_image_url && (
              <img
                src={profile.profile_image_url}
                alt={profile.name || 'Profile'}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile?.name || '천지영'} ({profile?.name_en || 'Jiyeong Kim'})
              </h1>
              <p className="text-lg text-gray-600 mb-1">
                {profile?.affiliation || '명지대학교 기록정보과학전문대학원 AI정보과학전공'}
              </p>
              <p className="text-lg text-gray-600 mb-1">
                {profile?.affiliation_en || 'Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University'}
              </p>
              <p className="text-md text-gray-500 mb-4">
                {profile?.degree_program || '석사과정 (Master\'s Candidate)'}
              </p>
              <p className="text-gray-700">
                {profile?.bio || '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Chatbot Section */}
        <HomeChatbot />
      </div>
    </div>
  )
}
