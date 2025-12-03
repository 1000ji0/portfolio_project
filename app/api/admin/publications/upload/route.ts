import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractTextFromPDF, chunkText } from '@/lib/pdf/parser'
import { generateEmbedding } from '@/lib/ai/google-ai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const paperDataStr = formData.get('paperData') as string

    if (!file || !paperDataStr) {
      return NextResponse.json({ error: 'Missing file or paper data' }, { status: 400 })
    }

    const paperData = JSON.parse(paperDataStr)

    // Supabase Storage에 업로드
    const adminSupabase = createAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `paper-pdfs/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await adminSupabase.storage
      .from('paper-pdfs')
      .upload(filePath, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Public URL 가져오기
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from('paper-pdfs').getPublicUrl(filePath)

    // 데이터베이스에 저장
    const { data: paper, error: dbError } = await adminSupabase
      .from('papers')
      .insert({
        ...paperData,
        pdf_file_path: publicUrl,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // PDF 텍스트 추출 및 임베딩
    try {
      const text = await extractTextFromPDF(buffer)
      const chunks = chunkText(text, 1000, 200)

      // 각 청크에 대해 임베딩 생성 및 저장
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.content)

        await adminSupabase.rpc('insert_embedding', {
          p_content: chunk.content,
          p_embedding: embedding,
          p_metadata: {
            title: paperData.title,
            page: chunk.page,
            chunk_index: chunk.chunkIndex,
          },
          p_source_type: 'paper',
          p_source_id: paper.id,
        })
      }
    } catch (error) {
      console.error('Error processing PDF:', error)
      // PDF 처리 실패해도 논문은 저장됨
    }

    return NextResponse.json({ success: true, paper })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

