'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChatInterface } from './ChatInterface'
import { supabase } from '@/lib/supabase/client'

interface Profile {
  name: string
  name_en: string
  affiliation: string
  affiliation_en: string
  degree_program: string
  bio: string
  profile_image_url?: string
}

export function HomePage() {
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
          })
        }
      } catch (error) {
        console.error('Error:', error)
        // 기본 프로필 정보로 폴백
        setProfile({
          name: '천지영',
          name_en: 'Jiyeong Cheon',
          affiliation: '명지대학교 기록정보과학전문대학원 AI정보과학전공',
          affiliation_en: 'Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University',
          degree_program: '석사과정 (Master\'s Candidate)',
          bio: '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다',
        })
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

  const imageUrl = profile?.profile_image_url || '/images/photo.jpeg'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 프로필 섹션 */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            <Image
              src={imageUrl}
              alt={profile?.name || 'Profile'}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {profile?.name} ({profile?.name_en})
        </h1>
        <p className="text-lg text-gray-700 mb-1">
          {profile?.affiliation}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          {profile?.affiliation_en}
        </p>
        <p className="text-base text-gray-600 mb-4">
          {profile?.degree_program}
        </p>
        <p className="text-base text-gray-700 max-w-2xl mx-auto">
          {profile?.bio}
        </p>
      </div>

      {/* AI 챗봇 인터페이스 */}
      <div className="max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  )
}

