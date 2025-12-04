'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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

interface SummarizationResult {
  summary: string
  keyPoints: string[]
  keywords: string[]
  methodology?: string
  contributions?: string[]
  relatedQuestions: string[]
}

interface PaperChatProps {
  paper?: Paper
}

export default function PaperChat({ paper }: PaperChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 요약 관련 상태
  const [summary, setSummary] = useState<SummarizationResult | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [showSummary, setShowSummary] = useState(true)

  const exampleQuestions = [
    '이 논문의 핵심 아이디어를 쉽게 설명해주세요',
    '연구 방법론의 장단점은?',
    '실험 결과를 상세히 설명해주세요',
    '실용적 응용 사례는?',
    '관련 연구와의 차이점은?',
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 논문이 변경되면 자동으로 요약 생성
  useEffect(() => {
    if (paper?.id && !summary) {
      generateSummary()
    }
  }, [paper?.id])

  async function generateSummary() {
    if (!paper?.id) return
    
    setIsLoadingSummary(true)
    try {
      const response = await fetch('/api/papers/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paperId: paper.id }),
      })

      if (!response.ok) {
        throw new Error(`Summary API error: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data)
    } catch (error: any) {
      console.error('Failed to generate summary:', error)
      // 에러 발생해도 계속 진행
    } finally {
      setIsLoadingSummary(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // MCP 서버를 통한 논문 챗봇 API 호출
      const response = await fetch('/api/mcp/paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentInput,
          conversationId,
        }),
      })

      if (!response.ok) {
        // 에러 응답의 상세 정보 가져오기
        let errorMessage = `API error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          const errorText = await response.text()
          if (errorText) {
            errorMessage = errorText
          }
        }
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.chunk) {
                assistantMessage.content += parsed.chunk
                setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = { ...assistantMessage }
                  return newMessages
                })
              }
              if (parsed.conversationId) {
                setConversationId(parsed.conversationId)
              }
            } catch (e) {
              // JSON 파싱 실패 시 무시
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `죄송합니다. 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}. 다시 시도해주세요.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl">
      {/* 논문 정보 섹션 */}
      {paper && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{paper.title}</h2>
              <p className="text-sm text-gray-300 mb-1">{paper.authors}</p>
              {paper.venue && paper.year && (
                <p className="text-xs text-gray-400 mb-3">{paper.venue} ({paper.year})</p>
              )}
            </div>
            <a
              href="/paper.pdf"
              download="(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 text-sm font-medium shadow-lg shadow-cyan-500/50 whitespace-nowrap"
            >
              📥 PDF 다운로드
            </a>
          </div>
          {paper.abstract && (
            <p className="text-sm text-gray-300 mb-3">{paper.abstract}</p>
          )}
          {paper.tags && paper.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {paper.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-800 text-cyan-400 rounded text-xs border border-cyan-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NotebookLM 스타일 요약 섹션 */}
      {paper && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                📚 논문 요약 (NotebookLM 스타일)
              </span>
            </h3>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              {showSummary ? '접기' : '펼치기'}
            </button>
          </div>

          {showSummary && (
            <div className="space-y-4">
              {isLoadingSummary ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="ml-3 text-gray-400">요약 생성 중...</span>
                </div>
              ) : summary ? (
                <>
                  {/* 전체 요약 */}
                  {summary.summary && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">📄 전체 요약</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{summary.summary}</p>
                    </div>
                  )}

                  {/* 핵심 포인트 */}
                  {summary.keyPoints && summary.keyPoints.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">✨ 핵심 포인트</h4>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 키워드 */}
                  {summary.keywords && summary.keywords.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">🏷️ 키워드</h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-700/50 text-cyan-300 rounded-full text-xs border border-cyan-500/30"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 연구 방법론 */}
                  {summary.methodology && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">🔬 연구 방법론</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{summary.methodology}</p>
                    </div>
                  )}

                  {/* 주요 기여사항 */}
                  {summary.contributions && summary.contributions.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">🎯 주요 기여사항</h4>
                      <ul className="space-y-2">
                        {summary.contributions.map((contribution, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <span className="text-cyan-400 mr-2">→</span>
                            <span>{contribution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 관련 질문 */}
                  {summary.relatedQuestions && summary.relatedQuestions.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">❓ 관련 질문</h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.relatedQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInput(question)}
                            className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-cyan-300 transition-colors text-xs border border-gray-600/50 text-left"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <p>요약을 생성할 수 없습니다.</p>
                  <button
                    onClick={generateSummary}
                    className="mt-2 px-4 py-2 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors text-sm border border-cyan-500/30"
                  >
                    다시 시도
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 채팅창 제목 */}
      <h3 className="text-lg font-bold text-white mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          논문 질의응답 (MCP 연동)
        </span>
      </h3>
      <div className="h-96 overflow-y-auto mb-4 border border-gray-700 rounded-lg p-4 bg-gray-950">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <p className="mb-4">아래 예시 질문을 클릭하거나 직접 질문을 입력해보세요</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 hover:text-cyan-300 transition-colors text-sm border border-cyan-500/30"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="논문에 대해 질문하세요"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-cyan-500/50"
        >
          전송
        </button>
      </form>
    </div>
  )
}

