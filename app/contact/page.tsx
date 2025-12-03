import { createClient } from '@/lib/supabase/server'

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: contact } = await supabase
    .from('contact')
    .select('*')
    .single()

  const otherLinks = (contact?.other_links as any[]) || []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>
          
          <div className="space-y-6">
            {contact?.email && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">이메일</h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.email}
                </a>
              </div>
            )}

            {contact?.github_url && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">GitHub</h2>
                <a
                  href={contact.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.github_url}
                </a>
              </div>
            )}

            {contact?.linkedin_url && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn</h2>
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.linkedin_url}
                </a>
              </div>
            )}

            {contact?.scholar_url && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Google Scholar</h2>
                <a
                  href={contact.scholar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.scholar_url}
                </a>
              </div>
            )}

            {otherLinks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">기타 링크</h2>
                <ul className="space-y-2">
                  {otherLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {link.name || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!contact && (
              <p className="text-gray-500">연락처 정보가 등록되지 않았습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

