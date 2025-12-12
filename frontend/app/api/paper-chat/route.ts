import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/frontend/lib/supabase/client'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { paperId, message, history } = await req.json()

    // 논문 정보 가져오기
    const { data: paper } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .single()

    // 관련 임베딩 검색
    const queryEmbedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    })

    const embedding = queryEmbedding.data[0].embedding

    const { data: matches } = await supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5,
      source_type_filter: 'paper',
    })

    let context = ''
    if (matches && matches.length > 0) {
      context = matches.map((m: any) => m.content).join('\n\n')
    }

    const systemPrompt = `당신은 논문 "${paper?.title}"에 대한 질문에 답변하는 AI 어시스턴트입니다.
논문 내용을 바탕으로 정확하고 상세하게 답변해주세요.
한국어로 답변하며, 논문 내용에 없는 정보는 추측하지 마세요.

논문 정보:
- 제목: ${paper?.title}
- 저자: ${paper?.authors}
- 초록: ${paper?.abstract || ''}

참고 내용:
${context || '관련 내용을 찾을 수 없습니다.'}`

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-5).map((h: any) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: message },
      ],
      stream: true,
      temperature: 0.7,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Paper chat API error:', error)
    return NextResponse.json(
      { error: '채팅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}


