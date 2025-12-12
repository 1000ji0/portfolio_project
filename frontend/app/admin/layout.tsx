import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/frontend/lib/supabase/server'
import { AdminSidebar } from '@/frontend/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // 관리자 이메일 확인
  const adminEmail = process.env.ADMIN_EMAIL || ''
  if (user.email !== adminEmail) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        {/* @ts-ignore - React version mismatch between root and frontend */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}


