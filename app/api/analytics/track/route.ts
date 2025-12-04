import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { pagePath } = await request.json()

    if (!pagePath) {
      return NextResponse.json(
        { error: 'pagePath is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 방문자 ID 생성 또는 가져오기 (쿠키 기반)
    let visitorId = request.cookies.get('visitor_id')?.value

    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`
    }

    // IP 주소 및 User-Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null

    // 페이지 뷰 기록
    try {
      const { error } = await supabase
        .from('page_views')
        .insert({
          page_path: pagePath,
          visitor_id: visitorId,
          ip_address: ipAddress,
          user_agent: userAgent,
          referer,
        })

      if (error) {
        console.error('Page view tracking error:', error)
        // 테이블이 없으면 조용히 성공 반환
        if (error.code === '42P01' || 
            error.message?.includes('does not exist') || 
            error.message?.includes('relation') ||
            error.message?.includes('relation "page_views" does not exist')) {
          const response = NextResponse.json({ success: true, message: 'Table not created yet' })
          if (!request.cookies.get('visitor_id')) {
            response.cookies.set('visitor_id', visitorId, {
              maxAge: 60 * 60 * 24 * 365,
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          }
          return response
        }
        // 다른 에러도 조용히 처리 (테이블이 없을 가능성이 높음)
        const response = NextResponse.json({ success: true, message: 'Tracking skipped' })
        if (!request.cookies.get('visitor_id')) {
          response.cookies.set('visitor_id', visitorId, {
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        }
        return response
      }
    } catch (dbError: any) {
      // 데이터베이스 연결 오류 등도 조용히 처리
      console.error('Database error:', dbError)
      const response = NextResponse.json({ success: true, message: 'Tracking skipped due to DB error' })
      if (!request.cookies.get('visitor_id')) {
        response.cookies.set('visitor_id', visitorId, {
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      }
      return response
    }

    // 쿠키 설정 (새 방문자인 경우)
    const response = NextResponse.json({ success: true })
    if (!request.cookies.get('visitor_id')) {
      response.cookies.set('visitor_id', visitorId, {
        maxAge: 60 * 60 * 24 * 365, // 1년
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error: any) {
    console.error('Analytics tracking error:', error)
    // 모든 에러를 조용히 처리 (테이블이 없을 가능성이 높음)
    const response = NextResponse.json({ success: true, message: 'Tracking skipped' })
    // 쿠키는 설정 시도
    try {
      if (!request.cookies.get('visitor_id')) {
        const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`
        response.cookies.set('visitor_id', visitorId, {
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      }
    } catch (cookieError) {
      // 쿠키 설정 실패도 무시
    }
    return response
  }
}

