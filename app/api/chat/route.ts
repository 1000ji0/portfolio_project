import { NextRequest, NextResponse } from 'next/server'
import { generateStream } from '@/lib/ai/google-ai'
import { searchSimilarContent } from '@/lib/rag/search'

export async function POST(request: NextRequest) {
  try {
    const { message, sourceType, sourceId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // RAG 검색
    const searchResults = await searchSimilarContent(
      message,
      sourceType,
      sourceId,
      5
    )

    // 컨텍스트 구성
    const context = searchResults
      .map((result) => result.content)
      .join('\n\n')

    const sources = searchResults
      .map((result) => result.metadata.file_name || result.metadata.title || '문서')
      .filter((v, i, a) => a.indexOf(v) === i)

    // 시스템 프롬프트
    const systemPrompt = `당신은 천지영 연구자의 포트폴리오 AI 어시스턴트입니다. 
제공된 문서 내용을 바탕으로 정확하고 친절하게 답변해주세요.
답변은 한국어로 작성해주세요.
모르는 내용은 추측하지 말고, 제공된 정보만을 바탕으로 답변해주세요.`

    const prompt = `다음 문서 내용을 참고하여 질문에 답변해주세요:\n\n${context}\n\n질문: ${message}`

    // 스트리밍 응답 생성
    const stream = await generateStream(prompt, systemPrompt)

    // ReadableStream 생성
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText, sources })}\n\n`))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

