import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const pagePath = searchParams.get('page')

    // 기본값 설정
    const defaultStats = {
      totalViews: 0,
      pageViews: 0,
      recentViews: 0,
      uniqueVisitors: 0,
    }

    // 전체 통계
    let totalViews = null
    let totalError = null
    
    try {
      const result = await supabase
        .from('page_views')
        .select('id', { count: 'exact', head: true })
      totalViews = result.data
      totalError = result.error
    } catch (dbError: any) {
      console.error('Database query error:', dbError)
      return NextResponse.json(defaultStats)
    }

    if (totalError) {
      console.error('Total views error:', totalError)
      // 모든 에러를 기본값으로 처리
      return NextResponse.json(defaultStats)
    }

    // 페이지별 통계
    let pageViews = null
    if (pagePath) {
      try {
        const { data, error } = await supabase
          .from('page_views')
          .select('id', { count: 'exact', head: true })
          .eq('page_path', pagePath)

        if (!error) {
          pageViews = data
        }
      } catch (dbError) {
        // 에러 무시
      }
    }

    // 최근 7일 통계
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    let recentViews = null
    let recentError = null
    
    try {
      const result = await supabase
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
      recentViews = result.data
      recentError = result.error
    } catch (dbError: any) {
      console.error('Recent views query error:', dbError)
      return NextResponse.json(defaultStats)
    }

    if (recentError) {
      console.error('Recent views error:', recentError)
      // 모든 에러를 기본값으로 처리
      return NextResponse.json(defaultStats)
    }

    // 고유 방문자 수 (최근 30일)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    let uniqueVisitors = null
    let uniqueError = null

    try {
      const result = await supabase
        .from('page_views')
        .select('visitor_id')
        .gte('created_at', thirtyDaysAgo.toISOString())
      uniqueVisitors = result.data
      uniqueError = result.error
    } catch (dbError: any) {
      console.error('Unique visitors query error:', dbError)
      return NextResponse.json(defaultStats)
    }

    const uniqueVisitorCount = uniqueVisitors && !uniqueError
      ? new Set(uniqueVisitors.map((v: any) => v.visitor_id)).size
      : 0

    return NextResponse.json({
      totalViews: totalViews?.length || 0,
      pageViews: pageViews?.length || 0,
      recentViews: recentViews?.length || 0,
      uniqueVisitors: uniqueVisitorCount,
    })
  } catch (error: any) {
    console.error('Analytics stats error:', error)
    // 모든 에러를 기본값으로 처리
    return NextResponse.json({
      totalViews: 0,
      pageViews: 0,
      recentViews: 0,
      uniqueVisitors: 0,
    })
  }
}

