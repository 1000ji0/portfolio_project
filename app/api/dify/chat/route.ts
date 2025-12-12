import { NextRequest, NextResponse } from 'next/server'
import { difyChatStream, difyChat } from '@/lib/ai/dify'

/**
 * Dify 채팅 API 라우트
 * 클라이언트에서 Dify API를 호출하기 위한 프록시
 */
export async function POST(request: NextRequest) {
  try {
    const { query, conversationId, inputs, stream = true } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      )
    }

    if (stream) {
      // 스트리밍 응답
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of difyChatStream(query, conversationId, inputs || {})) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
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
    } else {
      // 블로킹 응답
      const result = await difyChat(query, conversationId, inputs || {})
      return NextResponse.json(result)
    }
  } catch (error: any) {
    console.error('Dify chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

