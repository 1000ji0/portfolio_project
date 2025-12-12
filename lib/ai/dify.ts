/**
 * Dify AI API 클라이언트
 * Dify 지식베이스 연동을 위한 함수들
 */

const DIFY_API_BASE = 'https://api.dify.ai/v1'
const DIFY_CHATBOT_ID = 'o6mgf5YVWRLOj5NH' // 웹앱 ID

interface DifyMessage {
  role: 'user' | 'assistant'
  content: string
}

interface DifyChatRequest {
  inputs: Record<string, any>
  query: string
  response_mode: 'streaming' | 'blocking'
  conversation_id?: string
  user?: string
}

interface DifyChatResponse {
  event: string
  task_id?: string
  id?: string
  answer?: string
  conversation_id?: string
  created_at?: number
  message_id?: string
}

/**
 * Dify API 키 가져오기
 */
function getDifyApiKey(): string {
  const apiKey = process.env.DIFY_API_KEY
  if (!apiKey) {
    throw new Error('DIFY_API_KEY is not set in environment variables')
  }
  return apiKey
}

/**
 * Dify 채팅 완성 (스트리밍)
 */
export async function* difyChatStream(
  query: string,
  conversationId?: string,
  inputs: Record<string, any> = {}
): AsyncGenerator<string, void, unknown> {
  const apiKey = getDifyApiKey()
  
  const requestBody: DifyChatRequest = {
    inputs,
    query,
    response_mode: 'streaming',
    conversation_id: conversationId,
    user: 'portfolio-user',
  }

  const response = await fetch(`${DIFY_API_BASE}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Dify API error: ${response.status} - ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return
          }
          try {
            const parsed: DifyChatResponse = JSON.parse(data)
            if (parsed.event === 'message' && parsed.answer) {
              yield parsed.answer
            } else if (parsed.event === 'message_end') {
              return
            }
          } catch (e) {
            // JSON 파싱 실패 시 무시
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Dify 채팅 완성 (블로킹)
 */
export async function difyChat(
  query: string,
  conversationId?: string,
  inputs: Record<string, any> = {}
): Promise<{ answer: string; conversationId: string }> {
  const apiKey = getDifyApiKey()
  
  const requestBody: DifyChatRequest = {
    inputs,
    query,
    response_mode: 'blocking',
    conversation_id: conversationId,
    user: 'portfolio-user',
  }

  const response = await fetch(`${DIFY_API_BASE}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Dify API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return {
    answer: data.answer || '',
    conversationId: data.conversation_id || '',
  }
}

