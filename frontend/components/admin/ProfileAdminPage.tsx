'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2 } from 'lucide-react'

interface Profile {
  id?: string
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

export function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    name_en: '',
    affiliation: '',
    affiliation_en: '',
    degree_program: '',
    bio: '',
    education: [],
    experience: [],
    skills: [],
    awards: [],
    research_interests: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

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
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert(profile)

      if (error) throw error
      alert('저장되었습니다.')
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-600">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">프로필 관리</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          <Save size={20} />
          <span>저장</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* 기본 정보 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 (한글)
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 (영문)
              </label>
              <input
                type="text"
                value={profile.name_en}
                onChange={(e) =>
                  setProfile({ ...profile, name_en: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소속 (한글)
              </label>
              <input
                type="text"
                value={profile.affiliation}
                onChange={(e) =>
                  setProfile({ ...profile, affiliation: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소속 (영문)
              </label>
              <input
                type="text"
                value={profile.affiliation_en}
                onChange={(e) =>
                  setProfile({ ...profile, affiliation_en: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학위 과정
              </label>
              <input
                type="text"
                value={profile.degree_program}
                onChange={(e) =>
                  setProfile({ ...profile, degree_program: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로필 이미지 URL
              </label>
              <input
                type="text"
                value={profile.profile_image_url || ''}
                onChange={(e) =>
                  setProfile({ ...profile, profile_image_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                한 줄 소개
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* 학력 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">학력</h2>
            <button
              onClick={() =>
                setProfile({
                  ...profile,
                  education: [
                    ...profile.education,
                    {
                      school: '',
                      major: '',
                      degree: '',
                      period: '',
                      gpa: '',
                      status: '',
                    },
                  ],
                })
              }
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded"
            >
              <Plus size={16} />
              <span>추가</span>
            </button>
          </div>
          {profile.education.map((edu, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="학교명"
                  value={edu.school || ''}
                  onChange={(e) => {
                    const newEdu = [...profile.education]
                    newEdu[idx] = { ...newEdu[idx], school: e.target.value }
                    setProfile({ ...profile, education: newEdu })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="전공"
                  value={edu.major || ''}
                  onChange={(e) => {
                    const newEdu = [...profile.education]
                    newEdu[idx] = { ...newEdu[idx], major: e.target.value }
                    setProfile({ ...profile, education: newEdu })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="학위"
                  value={edu.degree || ''}
                  onChange={(e) => {
                    const newEdu = [...profile.education]
                    newEdu[idx] = { ...newEdu[idx], degree: e.target.value }
                    setProfile({ ...profile, education: newEdu })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="기간"
                  value={edu.period || ''}
                  onChange={(e) => {
                    const newEdu = [...profile.education]
                    newEdu[idx] = { ...newEdu[idx], period: e.target.value }
                    setProfile({ ...profile, education: newEdu })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => {
                  const newEdu = profile.education.filter((_, i) => i !== idx)
                  setProfile({ ...profile, education: newEdu })
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>

        {/* 경력, 기술 스택, 수상 경력 등도 유사한 패턴으로 구현 */}
        {/* 간단화를 위해 기본 구조만 제공 */}
      </div>
    </div>
  )
}


