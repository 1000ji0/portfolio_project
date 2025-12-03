import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()

  const education = (profile?.education as any[]) || []
  const experience = (profile?.experience as any[]) || []
  const skills = (profile?.skills as any[]) || []
  const awards = (profile?.awards as any[]) || []
  const researchInterests = (profile?.research_interests as any[]) || []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            {profile?.profile_image_url && (
              <img
                src={profile.profile_image_url}
                alt={profile.name || 'Profile'}
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-100"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile?.name || '천지영'} ({profile?.name_en || 'Jiyeong Kim'})
              </h1>
              <p className="text-xl text-gray-600 mb-1">
                {profile?.affiliation || '명지대학교 기록정보과학전문대학원 AI정보과학전공'}
              </p>
              <p className="text-lg text-gray-500 mb-4">
                {profile?.degree_program || '석사과정 (Master\'s Candidate)'}
              </p>
              <p className="text-gray-700">
                {profile?.bio || '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다'}
              </p>
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">학력 (Education)</h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900">{edu.school}</h3>
                    <p className="text-gray-600">{edu.major} - {edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.period}</p>
                    {edu.other && (
                      <p className="text-gray-700 mt-2">{edu.other}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">경력 (Experience)</h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900">{exp.organization}</h3>
                    <p className="text-gray-600">{exp.role}</p>
                    <p className="text-sm text-gray-500">{exp.period}</p>
                    {exp.description && (
                      <div className="text-gray-700 mt-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">기술 스택 (Skills)</h2>
              <div className="space-y-4">
                {skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items?.map((item: string, itemIdx: number) => (
                        <span
                          key={itemIdx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">연구 관심 분야 (Research Interests)</h2>
              <div className="flex flex-wrap gap-2">
                {researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">수상 경력 (Awards)</h2>
              <div className="space-y-3">
                {awards.map((award, idx) => (
                  <div key={idx} className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900">{award.name}</h3>
                    <p className="text-gray-600">{award.organization}</p>
                    <p className="text-sm text-gray-500">{award.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other Info */}
          {profile?.other_info && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">기타 정보</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: profile.other_info }} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

