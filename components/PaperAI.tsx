'use client'

import { useState, useEffect, useRef } from 'react'

interface Summary {
  keyContribution: string
  methodology: string
  results: string
  limitations: string
  practicalImplications: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function PaperAI({
  paperId,
  paperTitle,
  pdfUrl,
}: {
  paperId: string
  paperTitle: string
  pdfUrl: string | null
}) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const exampleQuestions = [
    '이 논문의 핵심 아이디어를 쉽게 설명해주세요',
    '연구 방법론의 장단점은?',
    '실험 결과를 상세히 설명해주세요',
    '실용적 응용 사례는?',
    '관련 연구와의 차이점은?',
  ]

  useEffect(() => {
    generateSummary()
  }, [paperId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function generateSummary() {
    setLoadingSummary(true)
    try {
      // Dify API를 사용하여 논문 요약 생성
      const prompt = `다음 논문 "${paperTitle}"에 대해 다음 5가지 섹션으로 요약해주세요. 각 섹션은 100-150단어로 작성해주세요.

1. 핵심 기여 (Key Contribution): 이 논문의 주요 혁신점
2. 연구 방법론 (Methodology): 어떤 방법을 사용했는가
3. 주요 결과 (Results): 어떤 결과를 얻었는가
4. 한계점 및 향후 연구 (Limitations & Future Work): 개선점과 향후 방향
5. 실용적 함의 (Practical Implications): 실제 적용 가능성

JSON 형식으로 응답해주세요:
{
  "keyContribution": "...",
  "methodology": "...",
  "results": "...",
  "limitations": "...",
  "practicalImplications": "..."
}`

      const response = await fetch('/api/dify/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          conversationId,
          inputs: {
            paper_title: paperTitle,
            paper_id: paperId,
          },
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()

      if (result.conversationId) {
        setConversationId(result.conversationId)
      }

      // JSON 파싱 시도
      try {
        const jsonMatch = result.answer.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          setSummary(parsed)
        } else {
          // JSON이 아니면 텍스트를 섹션별로 분리
          const sections = result.answer.split(/\d+\.\s+/).filter(Boolean)
          setSummary({
            keyContribution: sections[0] || '요약 생성 중...',
            methodology: sections[1] || '요약 생성 중...',
            results: sections[2] || '요약 생성 중...',
            limitations: sections[3] || '요약 생성 중...',
            practicalImplications: sections[4] || '요약 생성 중...',
          })
        }
      } catch {
        // 파싱 실패 시 기본 구조
        const answer = result.answer
        setSummary({
          keyContribution: answer.substring(0, 200) || '요약 생성 중...',
          methodology: answer.substring(200, 400) || '요약 생성 중...',
          results: answer.substring(400, 600) || '요약 생성 중...',
          limitations: answer.substring(600, 800) || '요약 생성 중...',
          practicalImplications: answer.substring(800) || '요약 생성 중...',
        })
      }
    } catch (error: any) {
      console.error('Summary generation error:', error)
      setSummary({
        keyContribution: `요약 생성 중 오류가 발생했습니다: ${error.message}`,
        methodology: '',
        results: '',
        limitations: '',
        practicalImplications: '',
      })
    } finally {
      setLoadingSummary(false)
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
      // Dify API를 사용하여 스트리밍 응답 받기
      const response = await fetch('/api/dify/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentInput,
          conversationId,
          inputs: {
            paper_title: paperTitle,
            paper_id: paperId,
          },
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Summary and Chat */}
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI 요약</h2>
          {loadingSummary ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">요약 생성 중...</p>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">핵심 기여</h3>
                <p className="text-gray-700">{summary.keyContribution}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">연구 방법론</h3>
                <p className="text-gray-700">{summary.methodology}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">주요 결과</h3>
                <p className="text-gray-700">{summary.results}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">한계점 및 향후 연구</h3>
                <p className="text-gray-700">{summary.limitations}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">실용적 함의</h3>
                <p className="text-gray-700">{summary.practicalImplications}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Chat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">질의응답</h2>
          <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="mb-4">아래 예시 질문을 클릭하거나 직접 질문을 입력해보세요</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {exampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </form>
        </div>
      </div>

      {/* Right: PDF Viewer */}
      {pdfUrl && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">논문 PDF</h2>
          <iframe
            src={pdfUrl}
            className="w-full h-[800px] border border-gray-200 rounded-lg"
            title="Paper PDF"
          />
        </div>
      )}
    </div>
  )
}

