-- ============================================
-- Portfolio Database Schema (Safe Version)
-- 충돌 없이 실행 가능한 버전
-- ============================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop existing policies first (if any)
DO $$ 
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Public papers are viewable by everyone" ON papers;
  DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
  DROP POLICY IF EXISTS "Public contact is viewable by everyone" ON contact;
  DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
  DROP POLICY IF EXISTS "Admin can update profiles" ON profiles;
  DROP POLICY IF EXISTS "Admin can insert documents" ON documents;
  DROP POLICY IF EXISTS "Admin can delete documents" ON documents;
  DROP POLICY IF EXISTS "Admin can insert papers" ON papers;
  DROP POLICY IF EXISTS "Admin can update papers" ON papers;
  DROP POLICY IF EXISTS "Admin can delete papers" ON papers;
  DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
  DROP POLICY IF EXISTS "Admin can update projects" ON projects;
  DROP POLICY IF EXISTS "Admin can delete projects" ON projects;
  DROP POLICY IF EXISTS "Admin can update contact" ON contact;
  DROP POLICY IF EXISTS "Admin can insert contact" ON contact;
  DROP POLICY IF EXISTS "Admin can manage embeddings" ON embeddings;
EXCEPTION
  WHEN undefined_table THEN
    -- 테이블이 없으면 정책 삭제 스킵
    NULL;
END $$;

-- 3. Create Tables (IF NOT EXISTS로 안전하게)
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

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  scholar_url TEXT,
  other_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  source_type TEXT CHECK (source_type IN ('document', 'paper', 'project')),
  source_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 5. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public papers are viewable by everyone" ON papers
  FOR SELECT USING (true);

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public contact is viewable by everyone" ON contact
  FOR SELECT USING (true);

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

CREATE POLICY "Admin can insert contact" ON contact
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage embeddings" ON embeddings
  FOR ALL USING (auth.role() = 'authenticated');

