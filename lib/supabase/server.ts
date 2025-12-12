import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

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
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
