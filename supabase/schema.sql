-- Supabase 데이터베이스 스키마

-- profiles 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  name_en TEXT,
  profile_image_url TEXT,
  affiliation TEXT,
  affiliation_en TEXT,
  degree_program TEXT,
  bio TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  research_interests JSONB DEFAULT '[]'::jsonb,
  other_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- documents 테이블 (홈 챗봇용 PDF 문서)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- papers 테이블 (논문)
CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  venue TEXT,
  year INTEGER,
  abstract TEXT,
  tags TEXT[],
  pdf_file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- projects 테이블 (프로젝트)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  github_url TEXT,
  demo_url TEXT,
  image_urls TEXT[],
  detailed_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- contact 테이블 (연락처)
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  scholar_url TEXT,
  other_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- vector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- embeddings 테이블 (RAG용 벡터)
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536), -- text-embedding-3-small은 1536 차원
  metadata JSONB,
  source_type TEXT CHECK (source_type IN ('document', 'paper', 'project')),
  source_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- embeddings 인덱스 생성
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- admin_users 테이블 (관리자)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (모든 사용자가 읽을 수 있음)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public documents are viewable by everyone" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Public papers are viewable by everyone" ON papers
  FOR SELECT USING (true);

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public contact is viewable by everyone" ON contact
  FOR SELECT USING (true);

-- 관리자만 쓰기 가능 (인증된 사용자)
CREATE POLICY "Admin can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update profiles" ON profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert documents" ON documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete documents" ON documents
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert papers" ON papers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update papers" ON papers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete papers" ON papers
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update contact" ON contact
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert embeddings" ON embeddings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete embeddings" ON embeddings
  FOR DELETE USING (auth.role() = 'authenticated');

-- 함수: 임베딩 검색
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  source_type_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE 
    (source_type_filter IS NULL OR embeddings.source_type = source_type_filter)
    AND (1 - (embeddings.embedding <=> query_embedding)) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON papers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 포스트잇 테이블
CREATE TABLE IF NOT EXISTS postits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('cheer', 'question')),
  content TEXT NOT NULL,
  position_x INTEGER DEFAULT 100,
  position_y INTEGER DEFAULT 100,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE postits ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public postits are viewable by everyone" ON postits
  FOR SELECT USING (true);

-- 공개 쓰기 정책 (누구나 작성 가능)
CREATE POLICY "Anyone can insert postits" ON postits
  FOR INSERT WITH CHECK (true);

-- 공개 업데이트 정책 (위치 변경용)
CREATE POLICY "Anyone can update postits" ON postits
  FOR UPDATE USING (true);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_postits_updated_at BEFORE UPDATE ON postits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


