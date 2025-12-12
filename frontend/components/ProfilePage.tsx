'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/frontend/lib/supabase/client'

interface Profile {
  name: string
  name_en: string
  affiliation: string
  affiliation_en: string
  degree_program: string
  bio: string
  profile_image_url?: string
  education: any[]
  experience: any[]
  skills: any[]
  awards: any[]
  research_interests: any[]
  other_info?: string
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error)
        }

        if (data) {
          setProfile(data)
        } else {
          // 기본 프로필 정보 (profile.md 기반)
          setProfile({
            name: '천지영',
            name_en: 'Jiyeong Cheon',
            affiliation: '명지대학교 기록정보과학전문대학원 AI정보과학전공',
            affiliation_en: 'Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University',
            degree_program: '석사과정 (Master\'s Candidate)',
            bio: '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다',
            education: [
              {
                school: '명지대학교 기록정보과학전문대학원',
                major: 'AI정보과학전공',
                degree: '석사과정',
                period: '2025.03 ~ 2027.02',
                gpa: '4.5 / 4.5',
                status: '재학중',
              },
              {
                school: '명지대학교',
                major: '정치외교학과',
                degree: '학사',
                period: '2021.03 ~ 2025.02',
                gpa: '3.70 / 4.5',
                status: '졸업',
              },
            ],
            experience: [
              {
                organization: 'AI음악재활연구회',
                role: '창립멤버 · 부회장',
                period: '2025.06 ~ 현재',
                description: '인공지능·심리학·음악치료 석사 이상 전문가들이 모여 AI 기반 음악치료 연구 및 프로젝트를 수행하는 연구회. 연구회 창립 멤버이자 부회장으로 활동 중.',
              },
              {
                organization: '명지대학교 제18대 사회과학대학 학생회',
                role: '부학생회장',
                period: '2023.01 ~ 2023.12',
                description: '약 2000명의 단과대 학생을 대상으로 다양한 사업 운영. 신입생 오리엔테이션 기획 & 예산 3000만 원 집행.',
              },
            ],
            skills: [
              {
                category: '프로그래밍',
                items: ['R', 'Python'],
              },
              {
                category: 'AI/ML',
                items: ['AI Agent', 'NLP', '챗봇', '지도학습'],
              },
              {
                category: '도구',
                items: ['PowerBI', '프롬프팅'],
              },
            ],
            awards: [
              {
                name: '2024년 명지대학교 SW경진대회 데이터분석부문 대상',
                organization: '명지대학교',
                date: '2024',
                description: 'KONEX 상장기업의 이전상장 및 상장폐지 예측 모델 개발',
              },
            ],
            research_interests: [
              '멀티모달 분석',
              'LLM',
              '감성 분석',
              'NLP',
              'AI Agent',
              '데이터 분석',
              'Multi-Agent Systems',
              '음악치료 AI 응용',
            ],
          })
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">프로필을 불러올 수 없습니다.</div>
      </div>
    )
  }

  const imageUrl = profile.profile_image_url || '/images/photo.jpeg'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 기본 정보 */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200">
            <Image
              src={imageUrl}
              alt={profile.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {profile.name} ({profile.name_en})
        </h1>
        <p className="text-lg text-gray-700 mb-1">{profile.affiliation}</p>
        <p className="text-sm text-gray-600 mb-1">{profile.affiliation_en}</p>
        <p className="text-base text-gray-600 mb-4">{profile.degree_program}</p>
        <p className="text-base text-gray-700 max-w-2xl mx-auto">
          {profile.bio}
        </p>
      </div>

      {/* 학력 */}
      {profile.education && profile.education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">학력 (Education)</h2>
          <div className="space-y-6">
            {profile.education.map((edu: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {edu.school}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">전공:</span> {edu.major}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">학위:</span> {edu.degree}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">기간:</span> {edu.period}
                </p>
                {edu.gpa && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">학점:</span> {edu.gpa}
                  </p>
                )}
                {edu.status && (
                  <p className="text-gray-700">
                    <span className="font-medium">상태:</span> {edu.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 경력 */}
      {profile.experience && profile.experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">경력 (Experience)</h2>
          <div className="space-y-6">
            {profile.experience.map((exp: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {exp.organization}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">역할:</span> {exp.role}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">기간:</span> {exp.period}
                </p>
                {exp.description && (
                  <p className="text-gray-600">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 기술 스택 */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">기술 스택 (Skills)</h2>
          <div className="space-y-4">
            {profile.skills.map((skill: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items?.map((item: string, itemIdx: number) => (
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

      {/* 연구 관심 분야 */}
      {profile.research_interests && profile.research_interests.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            연구 관심 분야 (Research Interests)
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.research_interests.map((interest: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 수상 경력 */}
      {profile.awards && profile.awards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">수상 경력 (Awards)</h2>
          <div className="space-y-4">
            {profile.awards.map((award: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {award.name}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">기관:</span> {award.organization}
                </p>
                {award.date && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">날짜:</span> {award.date}
                  </p>
                )}
                {award.description && (
                  <p className="text-gray-600">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 기타 정보 */}
      {profile.other_info && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">기타 정보</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {profile.other_info}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

