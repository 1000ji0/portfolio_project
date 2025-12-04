'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import FadeInOnScroll from '@/components/FadeInOnScroll'

// recharts를 dynamic import로 변경 (SSR 방지)
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })

interface DailyStat {
  date: string
  views: number
  uniquePages: number
}

interface PageStat {
  page: string
  views: number
  uniqueVisitors: number
}

interface OverallStats {
  totalViews: number
  pageViews: number
  recentViews: number
  uniqueVisitors: number
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function AnalyticsPage() {
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [pageStats, setPageStats] = useState<PageStat[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    loadAnalytics()
  }, [days])

  async function loadAnalytics() {
    setLoading(true)
    try {
      // 전체 통계
      const statsRes = await fetch('/api/analytics/stats')
      if (!statsRes.ok) {
        throw new Error(`Stats API error: ${statsRes.status}`)
      }
      const stats: OverallStats = await statsRes.json()
      setOverallStats(stats)

      // 일별 통계
      const dailyRes = await fetch(`/api/analytics/daily?days=${days}`)
      if (!dailyRes.ok) {
        throw new Error(`Daily API error: ${dailyRes.status}`)
      }
      const daily: DailyStat[] = await dailyRes.json()
      setDailyStats(daily || [])

      // 페이지별 통계
      const pagesRes = await fetch(`/api/analytics/pages?days=${days}`)
      if (!pagesRes.ok) {
        throw new Error(`Pages API error: ${pagesRes.status}`)
      }
      const pages: PageStat[] = await pagesRes.json()
      setPageStats(pages || [])
    } catch (error: any) {
      console.error('Failed to load analytics:', error)
      // 에러 발생 시 기본값 설정
      setOverallStats({
        totalViews: 0,
        pageViews: 0,
        recentViews: 0,
        uniqueVisitors: 0,
      })
      setDailyStats([])
      setPageStats([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">통계를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // 페이지 이름 포맷팅
  const formatPageName = (page: string) => {
    if (page === '/') return 'Home'
    return page.charAt(1).toUpperCase() + page.slice(2)
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll delay={0}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                방문자 통계 대시보드
              </span>
            </h1>
            <p className="text-gray-400">웹사이트 방문 및 페이지뷰 통계</p>
          </div>
        </FadeInOnScroll>

        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FadeInOnScroll delay={0} direction="up">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">전체 페이지뷰</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats?.totalViews.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100} direction="up">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">최근 7일</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats?.recentViews.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200} direction="up">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">고유 방문자</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats?.uniqueVisitors.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={300} direction="up">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">페이지 수</p>
                  <p className="text-3xl font-bold text-white">
                    {pageStats.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        {/* 기간 선택 */}
        <FadeInOnScroll delay={400}>
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setDays(7)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                days === 7
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              7일
            </button>
            <button
              onClick={() => setDays(30)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                days === 30
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              30일
            </button>
            <button
              onClick={() => setDays(90)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                days === 90
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              90일
            </button>
          </div>
        </FadeInOnScroll>

        {/* 일별 페이지뷰 차트 */}
        <FadeInOnScroll delay={500}>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                일별 페이지뷰 추이
              </span>
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  labelFormatter={(value) => `날짜: ${formatDate(value)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="페이지뷰"
                  dot={{ fill: '#06b6d4', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="uniquePages"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="고유 페이지"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 페이지별 통계 바 차트 */}
          <FadeInOnScroll delay={600}>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  페이지별 조회수
                </span>
              </h2>
              {pageStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pageStats.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="page"
                      tickFormatter={formatPageName}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      labelFormatter={(value) => `페이지: ${formatPageName(value)}`}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="#06b6d4" name="조회수" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="uniqueVisitors" fill="#8b5cf6" name="고유 방문자" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-400">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </FadeInOnScroll>

          {/* 페이지별 비율 파이 차트 */}
          <FadeInOnScroll delay={700}>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  페이지별 비율
                </span>
              </h2>
                    {pageStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={pageStats.slice(0, 6).map((stat) => ({
                              name: formatPageName(stat.page),
                              value: stat.views,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pageStats.slice(0, 6).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}회`, '조회수']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-400">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </FadeInOnScroll>
        </div>

        {/* 페이지별 상세 통계 테이블 */}
        <FadeInOnScroll delay={800}>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mt-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                페이지별 상세 통계
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">페이지</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">조회수</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">고유 방문자</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {pageStats.length > 0 ? (
                    pageStats.map((stat, idx) => {
                      const totalViews = pageStats.reduce((sum, s) => sum + s.views, 0)
                      const percentage = totalViews > 0 ? (stat.views / totalViews) * 100 : 0
                      return (
                        <tr
                          key={idx}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">{formatPageName(stat.page)}</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-medium">
                            {stat.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-purple-400 font-medium">
                            {stat.uniqueVisitors.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-300">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-24 bg-gray-800 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm w-12 text-right">{percentage.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        데이터가 없습니다. 페이지를 방문하면 통계가 표시됩니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}

