import { NextRequest, NextResponse } from 'next/server'

/**
 * Dify MCP 서버를 통한 논문 챗봇 API
 * MCP 서버: https://api.dify.ai/mcp/server/1WZgbNnJCoYNZbev/mcp
 */
export async function POST(request: NextRequest) {
  try {
    const { query, conversationId } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      )
    }

    // MCP 서버를 통한 Dify API 호출
    // 실제로는 Dify API를 직접 호출하거나, MCP 서버를 통해 호출
    const DIFY_API_BASE = 'https://api.dify.ai/v1'
    const apiKey = process.env.DIFY_API_KEY

    if (!apiKey) {
      console.error('DIFY_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'DIFY_API_KEY is not set. Please check your .env.local file.' },
        { status: 500 }
      )
    }

    // Dify API 호출
    const response = await fetch(`${DIFY_API_BASE}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: 'streaming',
        conversation_id: conversationId,
        user: 'portfolio-user',
      }),
    })

    if (!response.ok) {
      let errorMessage = `Dify API error: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (e) {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = `${errorMessage} - ${errorText}`
        }
      }
      console.error('Dify API error:', errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // 스트리밍 응답 반환
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.error(new Error('Response body is not readable'))
            return
          }

          const decoder = new TextDecoder()
          let buffer = ''

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
                  controller.close()
                  return
                }
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.event === 'message' && parsed.answer) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ chunk: parsed.answer })}\n\n`)
                    )
                  } else if (parsed.event === 'message_end') {
                    if (parsed.conversation_id) {
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ conversationId: parsed.conversation_id })}\n\n`)
                      )
                    }
                    controller.close()
                    return
                  }
                } catch (e) {
                  // JSON 파싱 실패 시 무시
                }
              }
            }
          }
          controller.close()
        } catch (error: any) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('MCP paper chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

