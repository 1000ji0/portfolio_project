'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  name: string
  content: string
  message_type: 'question' | 'support' | 'general'
  color: string
  position_x: number
  position_y: number
  rotation: number
  created_at: string
}

const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange']

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    message_type: 'general' as 'question' | 'support' | 'general',
    color: 'yellow',
  })

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Messages load error:', error)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('이름과 메시지를 입력해주세요.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    // 랜덤 위치와 회전 각도 생성
    const position_x = Math.floor(Math.random() * 200) - 100
    const position_y = Math.floor(Math.random() * 200) - 100
    const rotation = Math.floor(Math.random() * 11) - 5 // -5 ~ 5

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...formData,
        position_x,
        position_y,
        rotation,
      })
      .select()
      .single()

    if (error) {
      console.error('Message insert error:', error)
      alert('메시지 작성 중 오류가 발생했습니다: ' + error.message)
    } else {
      setMessages([data, ...messages])
      setFormData({
        name: '',
        content: '',
        message_type: 'general',
        color: 'yellow',
      })
    }
    setSubmitting(false)
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-200 text-yellow-900 border-yellow-300',
      pink: 'bg-pink-200 text-pink-900 border-pink-300',
      blue: 'bg-blue-200 text-blue-900 border-blue-300',
      green: 'bg-green-200 text-green-900 border-green-300',
      purple: 'bg-purple-200 text-purple-900 border-purple-300',
      orange: 'bg-orange-200 text-orange-900 border-orange-300',
    }
    return colors[color] || colors.yellow
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            메시지 게시판
          </span>
        </h1>

        {/* 작성 폼 */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">새 메시지 작성</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="이름을 입력하세요"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">메시지 유형</label>
                <select
                  value={formData.message_type}
                  onChange={(e) => setFormData({ ...formData, message_type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="general">일반</option>
                  <option value="question">질문</option>
                  <option value="support">응원</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">메시지</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="질문이나 응원 메시지를 작성해주세요"
                rows={3}
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">포스트잇 색상</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      formData.color === color
                        ? 'border-cyan-400 scale-110'
                        : 'border-gray-600'
                    } ${getColorClasses(color)}`}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-cyan-500/50"
            >
              {submitting ? '작성 중...' : '메시지 작성'}
            </button>
          </form>
        </div>

        {/* 포스트잇 게시판 */}
        <div className="relative min-h-[600px] bg-gray-950 rounded-lg border border-gray-800 p-8 overflow-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-lg">아직 메시지가 없습니다. 첫 번째 메시지를 작성해보세요!</p>
            </div>
          ) : (
            <div className="relative" style={{ minHeight: '600px' }}>
              {messages.map((message, index) => {
                // 그리드 기반 배치 (더 나은 레이아웃)
                const row = Math.floor(index / 4)
                const col = index % 4
                const baseX = col * 280 + 50
                const baseY = row * 200 + 50
                
                return (
                  <div
                    key={message.id}
                    className={`absolute p-4 rounded-lg shadow-lg border-2 cursor-pointer hover:scale-105 transition-transform ${getColorClasses(message.color)}`}
                    style={{
                      left: `${baseX + message.position_x}px`,
                      top: `${baseY + message.position_y}px`,
                      transform: `rotate(${message.rotation}deg)`,
                      width: '250px',
                      maxWidth: '250px',
                      zIndex: messages.length - index,
                    }}
                  >
                    <div className="font-bold text-sm mb-2 flex items-center justify-between">
                      <span>{message.name}</span>
                      {message.message_type === 'question' && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          질문
                        </span>
                      )}
                      {message.message_type === 'support' && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded">
                          응원
                        </span>
                      )}
                    </div>
                    <div className="text-sm whitespace-pre-wrap break-words mb-2">{message.content}</div>
                    <div className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

