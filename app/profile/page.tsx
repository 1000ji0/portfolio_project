import { createClient } from '@/lib/supabase/server'
import FadeInOnScroll from '@/components/FadeInOnScroll'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .maybeSingle()
  
  if (error) {
    console.error('Profile fetch error:', error.message || error)
    // Supabase 연결 오류인 경우 더 자세한 정보 출력
    if (error.message?.includes('Invalid') || error.message?.includes('Missing')) {
      console.error('Supabase 환경 변수를 확인하세요. SETUP_SUPABASE.md를 참조하세요.')
    }
  }

  const education = (profile?.education as any[]) || []
  const experience = (profile?.experience as any[]) || []
  const skills = (profile?.skills as any[]) || []
  const awards = (profile?.awards as any[]) || []
  const researchInterests = (profile?.research_interests as any[]) || []

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll delay={0}>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
            {/* Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-700">
              {profile?.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={profile.name || 'Profile'}
                  className="w-40 h-40 rounded-full object-cover border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform duration-300"
                />
              )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {profile?.name || '천지영'} ({profile?.name_en || 'JiYeong Cheon'})
              </h1>
              <p className="text-xl text-gray-300 mb-1">
                {profile?.affiliation || '명지대학교 기록정보과학전문대학원 AI정보과학전공'}
              </p>
              <p className="text-lg text-gray-400 mb-4">
                {profile?.degree_program || '석사과정 (Master\'s Candidate)'}
              </p>
              <p className="text-gray-300">
                {profile?.bio || '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다'}
              </p>
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <FadeInOnScroll delay={100}>
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    학력 (Education)
                  </span>
                </h2>
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="border-l-4 border-cyan-500 pl-4 hover:border-cyan-400 transition-colors duration-300">
                      <h3 className="font-semibold text-lg text-white">{edu.school}</h3>
                      <p className="text-gray-300">{edu.major} - {edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.period}</p>
                      {edu.other && (
                        <p className="text-gray-300 mt-2">{edu.other}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </FadeInOnScroll>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  경력 (Experience)
                </span>
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-white">{exp.organization}</h3>
                    <p className="text-gray-300">{exp.role}</p>
                    <p className="text-sm text-gray-400">{exp.period}</p>
                    {exp.description && (
                      <div className="text-gray-300 mt-2 prose max-w-none prose-invert" dangerouslySetInnerHTML={{ __html: exp.description }} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  기술 스택 (Skills)
                </span>
              </h2>
              <div className="space-y-4">
                {skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg text-gray-200 mb-2">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items?.map((item: string, itemIdx: number) => (
                        <span
                          key={itemIdx}
                          className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-full text-sm border border-cyan-500/30 hover:bg-gray-700 hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Research Interests */}
          {researchInterests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  연구 관심 분야 (Research Interests)
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-800 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30 hover:bg-gray-700 hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-default"
                  >
                    {interest.name || interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  수상 경력 (Awards)
                </span>
              </h2>
              <div className="space-y-3">
                {awards.map((award, idx) => (
                  <div key={idx} className="border-l-4 border-yellow-400 pl-4">
                    <h3 className="font-semibold text-lg text-white">{award.name}</h3>
                    <p className="text-gray-300">{award.organization}</p>
                    <p className="text-sm text-gray-400">{award.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}

