import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/frontend/lib/supabase/client'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { paperId } = await req.json()

    // 논문 정보 가져오기
    const { data: paper, error } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .single()

    if (error || !paper) {
      return NextResponse.json({ error: '논문을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 논문 PDF에서 텍스트 추출 (간단한 버전 - 실제로는 백엔드 API 사용 권장)
    // 여기서는 임베딩된 내용을 사용
    const { data: embeddings } = await supabase
      .from('embeddings')
      .select('content')
      .eq('source_type', 'paper')
      .eq('source_id', paperId)
      .limit(20)

    const paperContent = embeddings?.map((e) => e.content).join('\n\n') || paper.abstract || ''

    // 요약 생성
    const prompt = `다음 논문 내용을 바탕으로 구조화된 요약을 생성해주세요. 각 섹션은 100-150단어로 작성해주세요.

논문 제목: ${paper.title}
저자: ${paper.authors}
초록: ${paper.abstract || ''}

논문 내용:
${paperContent}

다음 형식의 JSON으로 응답해주세요:
{
  "keyContribution": "핵심 기여 내용",
  "methodology": "연구 방법론",
  "results": "주요 결과",
  "limitations": "한계점 및 향후 연구",
  "practicalImplications": "실용적 함의"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    const summary = JSON.parse(responseText)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Summary API error:', error)
    return NextResponse.json(
      { error: '요약 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}


