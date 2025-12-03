'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contact, setContact] = useState({
    email: '',
    github_url: '',
    linkedin_url: '',
    scholar_url: '',
    other_links: [] as { name: string; url: string }[],
  })

  useEffect(() => {
    loadContact()
  }, [])

  async function loadContact() {
    const supabase = createClient()
    const { data } = await supabase.from('contact').select('*').single()
    if (data) {
      setContact({
        email: data.email || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        scholar_url: data.scholar_url || '',
        other_links: (data.other_links as any[]) || [],
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('contact')
      .upsert(contact, { onConflict: 'id' })

    if (error) {
      alert('저장 중 오류가 발생했습니다: ' + error.message)
    } else {
      alert('저장되었습니다.')
    }
    setSaving(false)
  }

  function addOtherLink() {
    const name = prompt('링크 이름:')
    const url = prompt('링크 URL:')
    if (name && url) {
      setContact({
        ...contact,
        other_links: [...contact.other_links, { name, url }],
      })
    }
  }

  function removeOtherLink(index: number) {
    setContact({
      ...contact,
      other_links: contact.other_links.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">연락처 관리</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="url"
            value={contact.github_url}
            onChange={(e) => setContact({ ...contact, github_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={contact.linkedin_url}
            onChange={(e) => setContact({ ...contact, linkedin_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Scholar URL</label>
          <input
            type="url"
            value={contact.scholar_url}
            onChange={(e) => setContact({ ...contact, scholar_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">기타 링크</label>
            <button
              type="button"
              onClick={addOtherLink}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              추가
            </button>
          </div>
          <div className="space-y-2">
            {contact.other_links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                <span className="flex-1 text-sm">
                  <strong>{link.name}:</strong> {link.url}
                </span>
                <button
                  onClick={() => removeOtherLink(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

