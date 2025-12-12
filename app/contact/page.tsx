import { createSupabaseServerClient } from '@/lib/supabase/server'
import FadeInOnScroll from '@/components/FadeInOnScroll'

export default async function ContactPage() {
  let contact = null
  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .maybeSingle()
    
    if (error) {
      console.error('Contact fetch error:', error)
    } else {
      contact = data
    }
  } catch (error: any) {
    console.error('Failed to initialize Supabase:', error.message || error)
    // 환경 변수 문제일 수 있으므로 계속 진행
  }

  const otherLinks = (contact?.other_links as any[]) || []

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll delay={0}>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
            <h1 className="text-4xl font-bold text-white mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Contact
              </span>
            </h1>
            
            <div className="space-y-6">
            {contact?.email && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">이메일</h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                >
                  {contact.email}
                </a>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">GitHub</h2>
              <a
                href="https://github.com/1000ji0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
              >
                https://github.com/1000ji0/
              </a>
            </div>

            {otherLinks.length > 0 && otherLinks.some((link: any) => link.name === 'Blog') && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Blog</h2>
                {otherLinks
                  .filter((link: any) => link.name === 'Blog')
                  .map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                    >
                      {link.url}
                    </a>
                  ))}
              </div>
            )}

            {contact?.linkedin_url && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">LinkedIn</h2>
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                >
                  {contact.linkedin_url}
                </a>
              </div>
            )}

            {contact?.scholar_url && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Google Scholar</h2>
                <a
                  href={contact.scholar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                >
                  {contact.scholar_url}
                </a>
              </div>
            )}


            {!contact && (
              <p className="text-gray-400">연락처 정보가 등록되지 않았습니다.</p>
            )}
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}

