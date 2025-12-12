import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/frontend/lib/supabase/client'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // 마지막 사용자 메시지 가져오기
    const userMessage = messages[messages.length - 1]?.content
    if (!userMessage) {
      return NextResponse.json({ error: '메시지가 없습니다.' }, { status: 400 })
    }

    // RAG: 관련 문서 검색
    const queryEmbedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userMessage,
    })

    const embedding = queryEmbedding.data[0].embedding

    // Supabase에서 유사한 임베딩 검색
    const { data: matches } = await supabase.rpc(
      'match_embeddings',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
        source_type_filter: 'document',
      }
    )

    let context = ''
    const sources: string[] = []

    if (matches && matches.length > 0) {
      context = matches
        .map((match: any) => {
          sources.push(match.metadata?.file_name || '문서')
          return match.content
        })
        .join('\n\n')
    }

    // 시스템 프롬프트
    const systemPrompt = `당신은 천지영 연구자에 대한 정보를 제공하는 AI 어시스턴트입니다.
제공된 문서를 기반으로 정확하고 친절하게 답변해주세요.
한국어로 답변하며, 문서에 없는 정보는 추측하지 마세요.

참고 문서:
${context || '관련 문서를 찾을 수 없습니다.'}`

    // OpenAI 스트리밍 응답
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-5), // 최근 5개 메시지만 포함
      ],
      stream: true,
      temperature: 0.7,
    })

    // 스트리밍 응답 생성
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
        // 소스 정보 전송
        if (sources.length > 0) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`)
          )
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
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: '채팅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

