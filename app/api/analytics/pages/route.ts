import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // 최근 N일 데이터 가져오기
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let views = null
    let error = null

    try {
      const result = await supabase
        .from('page_views')
        .select('page_path, visitor_id')
        .gte('created_at', startDate.toISOString())
      
      views = result.data
      error = result.error
    } catch (dbError: any) {
      console.error('Database query error:', dbError)
      // 테이블이 없거나 다른 DB 에러면 빈 배열 반환
      return NextResponse.json([])
    }

    if (error) {
      console.error('Page stats error:', error)
      // 모든 에러를 빈 배열로 처리
      return NextResponse.json([])
    }

    // 데이터가 없으면 빈 배열 반환
    if (!views || views.length === 0) {
      return NextResponse.json([])
    }

    // 페이지별로 그룹화
    const pageStats: Record<string, { page: string; views: number; uniqueVisitors: Set<string> }> = {}

    views?.forEach((view: any) => {
      const page = view.page_path || '/'
      if (!pageStats[page]) {
        pageStats[page] = {
          page,
          views: 0,
          uniqueVisitors: new Set(),
        }
      }
      pageStats[page].views++
      if (view.visitor_id) {
        pageStats[page].uniqueVisitors.add(view.visitor_id)
      }
    })

    // 배열로 변환 및 정렬 (조회수 기준)
    const result = Object.values(pageStats)
      .map((stat) => ({
        page: stat.page,
        views: stat.views,
        uniqueVisitors: stat.uniqueVisitors.size,
      }))
      .sort((a, b) => b.views - a.views)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Page analytics error:', error)
    // 모든 에러를 빈 배열로 처리
    return NextResponse.json([])
  }
}

