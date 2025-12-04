import HomeChatbot from '@/components/HomeChatbot'
import FadeInOnScroll from '@/components/FadeInOnScroll'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .maybeSingle()
  
  if (error) {
    console.error('Profile fetch error:', error.message || error)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* 네이버 스타일 메인 섹션 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* 프로필 사진 + 큰 이름 표시 */}
        <FadeInOnScroll delay={0} direction="up">
          <div className="text-center mb-16">
            {/* 프로필 사진 */}
            <div className="flex justify-center mb-8">
              <img
                src={profile?.profile_image_url || '/profile-photo.jpeg'}
                alt={profile?.name || '천지영'}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* 큰 이름 */}
            <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                {profile?.name || '천지영'}
              </span>
            </h1>
            <p className="text-3xl md:text-4xl text-gray-200 font-light mb-2">
              {profile?.name_en || 'JiYeong Cheon'}
            </p>
            <p className="text-lg text-gray-400 font-light">
              {profile?.affiliation || 'AI Information Science · Myongji University'}
            </p>
          </div>
        </FadeInOnScroll>

        {/* AI 챗봇 섹션 (검색창 스타일) */}
        <FadeInOnScroll delay={200} direction="up">
          <div className="w-full max-w-3xl">
            <HomeChatbot />
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}
