import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables.\n' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.\n' +
      'Get these values from: https://app.supabase.com → Your Project → Settings → API'
    )
  }

  // URL 유효성 검사
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}"\n` +
      'The URL must start with http:// or https://\n' +
      'Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local file.\n' +
      'Example: https://xxxxxxxxxxxxx.supabase.co'
    )
  }

  // 플레이스홀더 값 확인
  if (supabaseUrl.includes('your_supabase') || supabaseUrl.includes('example.com')) {
    throw new Error(
      `Supabase URL appears to be a placeholder: "${supabaseUrl}"\n` +
      'Please replace it with your actual Supabase project URL.\n' +
      'Get it from: https://app.supabase.com → Your Project → Settings → API'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // 아래 2개는 Next 서버에서 쿠키 쓰기 필요할 때 사용
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
