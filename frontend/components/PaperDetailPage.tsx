'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase/client'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Paper {
  id: string
  title: string
  authors: string
  venue?: string
  year?: number
  abstract?: string
  tags?: string[]
  pdf_file_path?: string
}

interface Summary {
  keyContribution?: string
  methodology?: string
  results?: string
  limitations?: string
  practicalImplications?: string
}

export function PaperDetailPage({ paperId }: { paperId: string }) {
  const [paper, setPaper] = useState<Paper | null>(null)
  const [summary, setSummary] = useState<Summary>({})
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    loadPaper()
  }, [paperId])

  async function loadPaper() {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', paperId)
        .single()

      if (error) throw error
      setPaper(data)
    } catch (error) {
      console.error('Error loading paper:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateSummary() {
    if (!paper) return

    setSummaryLoading(true)
    try {
      const response = await fetch('/api/paper-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId: paper.id }),
      })

      if (!response.ok) throw new Error('요약 생성 실패')

      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setSummaryLoading(false)
    }
  }

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || !paper) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')

    try {
      const response = await fetch('/api/paper-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperId: paper.id,
          message: chatInput,
          history: chatMessages,
        }),
      })

      if (!response.ok) throw new Error('응답 실패')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantMessage += parsed.content
                  setChatMessages((prev) => {
                    const last = prev[prev.length - 1]
                    if (last?.role === 'assistant') {
                      return [...prev.slice(0, -1), { ...last, content: assistantMessage }]
                    }
                    return [...prev, { role: 'assistant', content: assistantMessage }]
                  })
                }
              } catch (e) {
                // JSON 파싱 실패 무시
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">논문을 찾을 수 없습니다.</div>
      </div>
    )
  }

  const getPdfUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('paper-pdfs').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/publications"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>목록으로</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 좌측: 요약 및 챗봇 */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Sparkles size={24} />
                <span>AI 요약</span>
              </h2>
              {!summary.keyContribution && (
                <button
                  onClick={generateSummary}
                  disabled={summaryLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {summaryLoading ? '생성 중...' : '요약 생성'}
                </button>
              )}
            </div>

            {summary.keyContribution && (
              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">핵심 기여</h3>
                  <p className="text-gray-700">{summary.keyContribution}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">연구 방법론</h3>
                  <p className="text-gray-700">{summary.methodology}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">주요 결과</h3>
                  <p className="text-gray-700">{summary.results}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">한계점 및 향후 연구</h3>
                  <p className="text-gray-700">{summary.limitations}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">실용적 함의</h3>
                  <p className="text-gray-700">{summary.practicalImplications}</p>
                </section>
              </div>
            )}
          </div>

          {/* 챗봇 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">논문 질의응답</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="논문에 대해 질문하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                전송
              </button>
            </form>
          </div>
        </div>

        {/* 우측: 논문 정보 및 PDF */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{paper.title}</h1>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">저자:</span>{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: paper.authors.replace(
                    /천지영|Ji-Yeong Cheon/g,
                    '<span class="font-semibold text-blue-600">$&</span>'
                  ),
                }}
              />
            </p>
            {paper.venue && (
              <p className="text-gray-700 mb-2">
                <span className="font-medium">학회/저널:</span> {paper.venue}
              </p>
            )}
            {paper.year && (
              <p className="text-gray-700 mb-4">
                <span className="font-medium">연도:</span> {paper.year}
              </p>
            )}
            {paper.abstract && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">초록</h3>
                <p className="text-gray-700">{paper.abstract}</p>
              </div>
            )}
            {paper.tags && paper.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {paper.pdf_file_path && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <iframe
                src={getPdfUrl(paper.pdf_file_path)}
                className="w-full h-screen min-h-[600px]"
                title="PDF Viewer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


