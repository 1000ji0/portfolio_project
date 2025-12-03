import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to') || '/admin'

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`/?error=${encodeURIComponent(error.message)}`)
    }

    // 관리자 이메일 확인
    const adminEmail = process.env.ADMIN_EMAIL
    if (data.user?.email && adminEmail && data.user.email !== adminEmail) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`/?error=${encodeURIComponent('관리자 권한이 없습니다.')}`)
    }

    // admin_users 테이블에 추가 (없는 경우)
    if (data.user?.email) {
      const adminSupabase = createAdminClient()
      await adminSupabase
        .from('admin_users')
        .upsert({ email: data.user.email }, { onConflict: 'email' })
    }

    return NextResponse.redirect(redirectTo)
  }

  return NextResponse.redirect('/')
}

