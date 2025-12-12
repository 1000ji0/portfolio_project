'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface Contact {
  email?: string
  github_url?: string
  linkedin_url?: string
  scholar_url?: string
  other_links?: any[]
}

export function ContactAdminPage() {
  const [contact, setContact] = useState<Contact>({
    email: '',
    github_url: '',
    linkedin_url: '',
    scholar_url: '',
    other_links: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadContact()
  }, [])

  async function loadContact() {
    try {
      const { data, error } = await supabase.from('contact').select('*').single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading contact:', error)
      }

      if (data) {
        setContact(data)
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
      const { error } = await supabase.from('contact').upsert(contact)

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
        <h1 className="text-3xl font-bold text-gray-900">연락처 관리</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          <Save size={20} />
          <span>저장</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            value={contact.github_url || ''}
            onChange={(e) => setContact({ ...contact, github_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={contact.linkedin_url || ''}
            onChange={(e) => setContact({ ...contact, linkedin_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Scholar URL
          </label>
          <input
            type="url"
            value={contact.scholar_url || ''}
            onChange={(e) => setContact({ ...contact, scholar_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}


