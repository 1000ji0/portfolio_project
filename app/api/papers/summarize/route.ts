import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/ai/google-ai'
import { extractTextFromPDF } from '@/lib/pdf/parser'

interface SummarizationResult {
  summary: string
  keyPoints: string[]
  keywords: string[]
  methodology?: string
  contributions?: string[]
  relatedQuestions: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { paperId } = await request.json()

    if (!paperId) {
      return NextResponse.json(
        { error: 'paperId is required' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServerClient()
    
    // 논문 정보 가져오기
    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .single()

    if (paperError || !paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      )
    }

    // PDF 텍스트 추출 (PDF 파일이 있는 경우)
    let paperText = paper.abstract || ''
    
    if (paper.pdf_file_path) {
      try {
        // Supabase Storage에서 PDF 다운로드
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('papers')
          .download(paper.pdf_file_path)

        if (!pdfError && pdfData) {
          const arrayBuffer = await pdfData.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const extractedText = await extractTextFromPDF(buffer)
          paperText = extractedText || paper.abstract || ''
        }
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError)
        // PDF 추출 실패 시 abstract 사용
      }
    }

    if (!paperText || paperText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Insufficient paper content for summarization' },
        { status: 400 }
      )
    }

    // Google Gemini를 사용한 요약 생성
    const prompt = `다음 논문을 Google NotebookLM 스타일로 분석하여 요약해주세요. 한국어로 답변해주세요.

논문 제목: ${paper.title}
저자: ${paper.authors}
${paper.venue ? `출판처: ${paper.venue} (${paper.year})` : ''}

논문 내용:
${paperText.substring(0, 50000)} ${paperText.length > 50000 ? '...(내용이 길어 일부만 포함)' : ''}

다음 형식으로 JSON으로 응답해주세요. 각 섹션은 명확하고 구체적으로 작성해주세요:
{
  "summary": "논문의 전체 요약 (3-5문단, 200-300단어)",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3", "핵심 포인트 4", "핵심 포인트 5"],
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "methodology": "연구 방법론 요약 (100-150단어)",
  "contributions": ["주요 기여사항 1", "주요 기여사항 2", "주요 기여사항 3"],
  "relatedQuestions": ["관련 질문 1", "관련 질문 2", "관련 질문 3", "관련 질문 4", "관련 질문 5"]
}

중요: JSON 형식으로만 응답하고, 마크다운 코드 블록이나 다른 설명은 포함하지 마세요.`

    const summaryText = await generateText(prompt)

    // JSON 파싱 시도
    let result: SummarizationResult
    try {
      // JSON 부분만 추출 (마크다운 코드 블록 제거)
      const jsonMatch = summaryText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        // JSON 파싱 실패 시 기본 구조로 반환
        result = {
          summary: summaryText.substring(0, 500),
          keyPoints: summaryText.split('\n').slice(0, 5).filter(line => line.trim().length > 0),
          keywords: [],
          contributions: [],
          relatedQuestions: [],
        }
      }
    } catch (parseError) {
      // 파싱 실패 시 기본 구조로 반환
      result = {
        summary: summaryText.substring(0, 500),
        keyPoints: summaryText.split('\n').slice(0, 5).filter(line => line.trim().length > 0),
        keywords: [],
        contributions: [],
        relatedQuestions: [],
      }
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    )
  }
}

