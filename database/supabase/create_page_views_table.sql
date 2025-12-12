-- 방문자 통계 테이블 생성
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visitor_id TEXT, -- 쿠키 기반 방문자 ID
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS page_views_page_path_idx ON page_views(page_path);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON page_views(visitor_id);

-- RLS 활성화
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있음 (통계 조회용)
CREATE POLICY "Public page views are viewable by everyone" ON page_views
  FOR SELECT USING (true);

-- 모든 사용자가 작성할 수 있음 (방문 기록)
CREATE POLICY "Anyone can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

