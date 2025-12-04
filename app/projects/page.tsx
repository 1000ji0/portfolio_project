import { createClient } from '@/lib/supabase/server'
import FadeInOnScroll from '@/components/FadeInOnScroll'

export default async function ProjectsPage() {
  let projects = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Projects fetch error:', error)
    } else {
      projects = data
    }
  } catch (error: any) {
    console.error('Failed to initialize Supabase:', error.message || error)
    // 환경 변수 문제일 수 있으므로 계속 진행
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Projects
          </span>
        </h1>
        
        {!projects || projects.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center shadow-xl">
            <p className="text-gray-400 text-lg">등록된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <FadeInOnScroll key={project.id} delay={idx * 100} direction="up">
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300 shadow-xl"
                >
                {project.image_urls && project.image_urls.length > 0 && (
                  <img
                    src={project.image_urls[0]}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-800 text-cyan-400 rounded text-xs border border-cyan-500/30 hover:bg-gray-700 hover:border-cyan-400 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300 text-sm border border-gray-700"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-cyan-500/50"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
              </FadeInOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

