-- 게시판 메시지 테이블 생성
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('question', 'support', 'general')) DEFAULT 'general',
  color TEXT DEFAULT 'yellow', -- 포스트잇 색상
  position_x INTEGER DEFAULT 0, -- 포스트잇 위치 (X)
  position_y INTEGER DEFAULT 0, -- 포스트잇 위치 (Y)
  rotation INTEGER DEFAULT 0, -- 회전 각도 (-5 ~ 5)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있음
CREATE POLICY "Public messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

-- 모든 사용자가 작성할 수 있음 (익명 게시판)
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- 모든 사용자가 삭제할 수 있음 (관리자용)
CREATE POLICY "Anyone can delete messages" ON messages
  FOR DELETE USING (true);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_type_idx ON messages(message_type);

