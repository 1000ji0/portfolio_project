'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

export default function HomeChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const exampleQuestions = [
    '주요 연구 분야가 무엇인가요?',
    '학력과 경력을 알려주세요',
    '어떤 논문을 작성했나요?',
    '관심 있는 연구 주제는 무엇인가요?',
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // MCP 서버를 통한 홈 챗봇 API 호출
      const response = await fetch('/api/mcp/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          conversationId,
        }),
      })

      if (!response.ok) {
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
        sources: [],
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
      console.error('Chat error:', error)
      const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `죄송합니다. 오류가 발생했습니다: ${errorMessage}\n\n다시 시도해주세요.`,
          sources: [],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
  }

  const handleNewChat = () => {
    setMessages([])
  }

  return (
    <div className="w-full">
      {/* 네이버 검색창 스타일 - 둥글둥글한 검색창 */}
      {messages.length === 0 ? (
        <div className="relative">
          {/* 검색창 */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="지영님에 대해 궁금한 점을 물어보세요"
                className="w-full px-6 py-5 pr-14 bg-white/10 backdrop-blur-md border-2 border-gray-700/50 text-white rounded-full text-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/50 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 예시 질문 */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(q)}
                className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-cyan-400 rounded-full hover:bg-gray-700/50 hover:text-cyan-300 transition-colors text-sm border border-cyan-500/30"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 대화가 시작되면 채팅 UI 표시 */
        <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-800/50 p-6 shadow-xl">
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 border border-gray-700/50 rounded-2xl p-4 bg-gray-950/50">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        출처: {msg.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-4">
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
          </div>

          {/* Input (둥근 검색창 스타일) */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="추가 질문을 입력하세요"
                className="w-full px-6 py-4 pr-14 bg-white/10 backdrop-blur-md border-2 border-gray-700/50 text-white rounded-full focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/50 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleNewChat}
              className="mt-3 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full hover:bg-gray-700/50 transition-colors text-sm border border-gray-700/50"
            >
              새 대화 시작
            </button>
          )}
        </div>
      )}
    </div>
  )
}

