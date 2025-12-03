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
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Supabase Storage에 업로드
    const adminSupabase = createAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `documents/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await adminSupabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Public URL 가져오기
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from('documents').getPublicUrl(filePath)

    // 데이터베이스에 저장
    const { data: document, error: dbError } = await adminSupabase
      .from('documents')
      .insert({
        file_name: file.name,
        file_path: publicUrl,
        description: description || null,
        file_size: file.size,
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
            file_name: file.name,
            page: chunk.page,
            chunk_index: chunk.chunkIndex,
          },
          p_source_type: 'document',
          p_source_id: document.id,
        })
      }
    } catch (error) {
      console.error('Error processing PDF:', error)
      // PDF 처리 실패해도 문서는 저장됨
    }

    return NextResponse.json({ success: true, document })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

