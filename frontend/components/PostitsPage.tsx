'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { X, Plus, Heart, MessageCircle } from 'lucide-react'

interface Postit {
  id: string
  type: 'cheer' | 'question'
  content: string
  position_x: number
  position_y: number
  color: string
  created_at: string
}

const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange']

export function PostitsPage() {
  const [postits, setPostits] = useState<Postit[]>([])
  const [selectedType, setSelectedType] = useState<'cheer' | 'question'>('cheer')
  const [showForm, setShowForm] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [draggedPostit, setDraggedPostit] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPostits()
  }, [selectedType])

  async function loadPostits() {
    try {
      const { data, error } = await supabase
        .from('postits')
        .select('*')
        .eq('type', selectedType)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPostits(data || [])
    } catch (error) {
      console.error('Error loading postits:', error)
    }
  }

  async function handleCreate() {
    if (!newContent.trim()) return

    try {
      const { data, error } = await supabase
        .from('postits')
        .insert({
          type: selectedType,
          content: newContent.trim(),
          position_x: Math.random() * 300 + 100,
          position_y: Math.random() * 300 + 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
        .select()
        .single()

      if (error) throw error
      setPostits([...postits, data])
      setNewContent('')
      setShowForm(false)
    } catch (error) {
      console.error('Error creating postit:', error)
      alert('포스트잇 작성에 실패했습니다.')
    }
  }

  async function handleDelete(id: string) {
    if (password !== '8442') {
      alert('패스워드가 올바르지 않습니다.')
      setPassword('')
      return
    }

    try {
      const { error } = await supabase.from('postits').delete().eq('id', id)
      if (error) throw error
      setPostits(postits.filter((p) => p.id !== id))
      setShowPasswordModal(null)
      setPassword('')
    } catch (error) {
      console.error('Error deleting postit:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  async function handleDragEnd(id: string, x: number, y: number) {
    try {
      const { error } = await supabase
        .from('postits')
        .update({ position_x: x, position_y: y })
        .eq('id', id)

      if (error) throw error

      setPostits(
        postits.map((p) => (p.id === id ? { ...p, position_x: x, position_y: y } : p))
      )
    } catch (error) {
      console.error('Error updating position:', error)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    // 삭제 버튼 클릭 시 드래그 방지
    if ((e.target as HTMLElement).closest('button')) return
    
    e.preventDefault()
    setDraggedPostit(id)
    const postit = postits.find((p) => p.id === id)
    if (!postit || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const startX = e.clientX - (rect.left + postit.position_x)
    const startY = e.clientY - (rect.top + postit.position_y)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newX = Math.max(0, Math.min(moveEvent.clientX - rect.left - startX, rect.width - 200))
      const newY = Math.max(0, Math.min(moveEvent.clientY - rect.top - startY, rect.height - 150))

      setPostits(
        postits.map((p) =>
          p.id === id ? { ...p, position_x: newX, position_y: newY } : p
        )
      )
    }

    const handleMouseUp = () => {
      const postit = postits.find((p) => p.id === id)
      if (postit) {
        handleDragEnd(id, postit.position_x, postit.position_y)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setDraggedPostit(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-200 border-yellow-300',
      pink: 'bg-pink-200 border-pink-300',
      blue: 'bg-blue-200 border-blue-300',
      green: 'bg-green-200 border-green-300',
      purple: 'bg-purple-200 border-purple-300',
      orange: 'bg-orange-200 border-orange-300',
    }
    return colors[color] || colors.yellow
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">응원 & 질문 포스트잇</h1>

      {/* 타입 선택 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType('cheer')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === 'cheer'
              ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart size={20} />
          <span>응원창</span>
        </button>
        <button
          onClick={() => setSelectedType('question')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === 'question'
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MessageCircle size={20} />
          <span>질문창</span>
        </button>
      </div>

      {/* 새 포스트잇 작성 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>새 포스트잇 작성</span>
        </button>
      </div>

      {/* 작성 폼 */}
      {showForm && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={
              selectedType === 'cheer'
                ? '응원 메시지를 작성해주세요...'
                : '질문을 작성해주세요...'
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              작성
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setNewContent('')
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 포스트잇 보드 */}
      <div
        ref={containerRef}
        className="relative min-h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4"
        style={{ position: 'relative' }}
      >
        {postits.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <p>아직 작성된 포스트잇이 없습니다.</p>
          </div>
        ) : (
          postits.map((postit) => (
            <div
              key={postit.id}
              className={`absolute ${getColorClass(postit.color)} border-2 rounded-lg p-4 shadow-lg cursor-move ${
                draggedPostit === postit.id ? 'z-50' : 'z-10'
              }`}
              style={{
                left: `${postit.position_x}px`,
                top: `${postit.position_y}px`,
                width: '200px',
                minHeight: '150px',
              }}
              onMouseDown={(e) => handleMouseDown(e, postit.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-600">
                  {selectedType === 'cheer' ? '💝 응원' : '❓ 질문'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPasswordModal(postit.id)
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {postit.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 패스워드 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">포스트잇 삭제</h3>
            <p className="text-gray-600 mb-4">삭제를 위해 패스워드를 입력하세요.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="패스워드"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDelete(showPasswordModal)
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(showPasswordModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(null)
                  setPassword('')
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

