'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { Mail, Github, Linkedin, GraduationCap, ExternalLink } from 'lucide-react'

interface Contact {
  email?: string
  github_url?: string
  linkedin_url?: string
  scholar_url?: string
  other_links?: any[]
}

export function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContact()
  }, [])

  async function loadContact() {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading contact:', error)
      }

      if (data) {
        setContact(data)
      } else {
        // 기본 연락처 정보 (profile.md 기반)
        setContact({
          email: 'cj8442@naver.com',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setContact({
        email: 'cj8442@naver.com',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">연락처 정보를 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Mail size={24} className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600">{contact.email}</p>
            </div>
          </a>
        )}

        {contact.github_url && (
          <a
            href={contact.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Github size={24} className="text-gray-900" />
            <div>
              <p className="font-medium text-gray-900">GitHub</p>
              <p className="text-gray-600">{contact.github_url}</p>
            </div>
            <ExternalLink size={16} className="text-gray-400 ml-auto" />
          </a>
        )}

        {contact.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Linkedin size={24} className="text-blue-700" />
            <div>
              <p className="font-medium text-gray-900">LinkedIn</p>
              <p className="text-gray-600">{contact.linkedin_url}</p>
            </div>
            <ExternalLink size={16} className="text-gray-400 ml-auto" />
          </a>
        )}

        {contact.scholar_url && (
          <a
            href={contact.scholar_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <GraduationCap size={24} className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Google Scholar</p>
              <p className="text-gray-600">{contact.scholar_url}</p>
            </div>
            <ExternalLink size={16} className="text-gray-400 ml-auto" />
          </a>
        )}

        {contact.other_links && contact.other_links.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-gray-900 mb-2">기타 링크</p>
            {contact.other_links.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{link.name}</p>
                  <p className="text-gray-600 text-sm">{link.url}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


