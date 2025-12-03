import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
    const projectDataStr = formData.get('projectData') as string
    const images = formData.getAll('images') as File[]

    if (!projectDataStr) {
      return NextResponse.json({ error: 'Missing project data' }, { status: 400 })
    }

    const projectData = JSON.parse(projectDataStr)

    // 이미지 업로드
    const adminSupabase = createAdminClient()
    const imageUrls: string[] = []

    for (const image of images) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `project-images/${fileName}`

      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await adminSupabase.storage
        .from('project-images')
        .upload(filePath, buffer, {
          contentType: image.type,
        })

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = adminSupabase.storage.from('project-images').getPublicUrl(filePath)
        imageUrls.push(publicUrl)
      }
    }

    // 데이터베이스에 저장
    const { data: project, error: dbError } = await adminSupabase
      .from('projects')
      .insert({
        ...projectData,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, project })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

