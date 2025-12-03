'use client'

import { useState, useRef, useEffect } from 'react'
import { generateStream } from '@/lib/ai/google-ai'
import { searchSimilarContent } from '@/lib/rag/search'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

export default function HomeChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
      // RAG 검색
      const searchResults = await searchSimilarContent(input, 'document', undefined, 5)
      
      // 컨텍스트 구성
      const context = searchResults
        .map((result) => result.content)
        .join('\n\n')
      
      const sources = searchResults
        .map((result) => result.metadata.file_name || '문서')
        .filter((v, i, a) => a.indexOf(v) === i)

      // 시스템 프롬프트
      const systemPrompt = `당신은 천지영 연구자의 포트폴리오 AI 어시스턴트입니다. 
제공된 문서 내용을 바탕으로 정확하고 친절하게 답변해주세요.
답변은 한국어로 작성해주세요.
모르는 내용은 추측하지 말고, 제공된 정보만을 바탕으로 답변해주세요.`

      const prompt = `다음 문서 내용을 참고하여 질문에 답변해주세요:\n\n${context}\n\n질문: ${input}`

      // 스트리밍 응답 생성
      const stream = await generateStream(prompt, systemPrompt)
      
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        sources,
      }

      setMessages((prev) => [...prev, assistantMessage])

      for await (const chunk of stream) {
        const chunkText = chunk.text?.() || ''
        assistantMessage.content += chunkText
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = { ...assistantMessage }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 챗봇</h2>
        <p className="text-gray-600">지영님에 대해 궁금한 점을 물어보세요</p>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-4">아래 예시 질문을 클릭하거나 직접 질문을 입력해보세요</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(q)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
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
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 text-xs opacity-70">
                      출처: {msg.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="지영님에 대해 궁금한 점을 물어보세요"
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
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleNewChat}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            새 대화
          </button>
        )}
      </form>
    </div>
  )
}

