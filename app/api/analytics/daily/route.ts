import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // 최근 N일 데이터 가져오기
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let views = null
    let error = null

    try {
      const result = await supabase
        .from('page_views')
        .select('created_at, page_path')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })
      
      views = result.data
      error = result.error
    } catch (dbError: any) {
      console.error('Database query error:', dbError)
      // 테이블이 없거나 다른 DB 에러면 빈 배열 반환
      return NextResponse.json([])
    }

    if (error) {
      console.error('Daily stats error:', error)
      // 모든 에러를 빈 배열로 처리
      return NextResponse.json([])
    }

    // 데이터가 없으면 빈 배열 반환
    if (!views || views.length === 0) {
      return NextResponse.json([])
    }

    // 날짜별로 그룹화
    const dailyStats: Record<string, { date: string; views: number; uniquePages: Set<string> }> = {}

    views?.forEach((view: any) => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          views: 0,
          uniquePages: new Set(),
        }
      }
      dailyStats[date].views++
      dailyStats[date].uniquePages.add(view.page_path)
    })

    // 배열로 변환 및 정렬
    const result = Object.values(dailyStats).map((stat) => ({
      date: stat.date,
      views: stat.views,
      uniquePages: stat.uniquePages.size,
    })).sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Daily analytics error:', error)
    // 모든 에러를 빈 배열로 처리
    return NextResponse.json([])
  }
}

