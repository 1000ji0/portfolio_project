# 데이터베이스 확인 가이드

프로필 정보가 저장되지 않는 경우, 데이터베이스 스키마가 제대로 생성되었는지 확인하세요.

## 1. Supabase Dashboard에서 확인

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Table Editor** 클릭
4. 다음 테이블들이 있는지 확인:
   - `profiles`
   - `papers`
   - `projects`
   - `documents`
   - `contact`
   - `embeddings`
   - `admin_users`

## 2. 테이블이 없다면 스키마 생성

### 방법 1: SQL Editor 사용 (권장)

1. Supabase Dashboard → **SQL Editor** 클릭
2. **New query** 클릭
3. `database/supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. 성공 메시지 확인

### 방법 2: 파일 내용 확인

프로젝트의 `database/supabase/schema.sql` 파일을 열어서 내용을 확인하고, Supabase SQL Editor에 직접 입력하세요.

## 3. 벡터 검색 함수 생성

1. SQL Editor에서 **New query** 클릭
2. `database/supabase/functions.sql` 파일의 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭
4. 성공 메시지 확인

## 4. RLS (Row Level Security) 정책 확인

Table Editor에서 각 테이블을 열고:
1. **Policies** 탭 클릭
2. 다음 정책들이 있는지 확인:
   - `Public profiles are viewable by everyone` (profiles 테이블)
   - `Public papers are viewable by everyone` (papers 테이블)
   - `Admin can insert profiles` (profiles 테이블)
   - 등등...

정책이 없다면 `database/supabase/schema.sql`의 마지막 부분(RLS Policies)을 실행하세요.

## 5. Storage 버킷 확인

1. Supabase Dashboard → **Storage** 클릭
2. 다음 버킷들이 있는지 확인:
   - `profile-images`
   - `documents`
   - `paper-pdfs`
   - `project-images`

버킷이 없다면 생성하세요 (Public으로 설정).

## 6. 테스트 쿼리 실행

SQL Editor에서 다음 쿼리를 실행하여 테이블이 정상 작동하는지 확인:

```sql
-- profiles 테이블 확인
SELECT * FROM profiles LIMIT 1;

-- 테이블 구조 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

## 7. 프로필 데이터 수동 입력 테스트

SQL Editor에서 다음 쿼리로 테스트 데이터 입력:

```sql
INSERT INTO profiles (name, name_en, profile_image_url, affiliation, affiliation_en, degree_program, bio)
VALUES (
  '천지영',
  'Jiyeong Cheon',
  '/profile-photo.jpeg',
  '명지대학교 기록정보과학전문대학원 AI정보과학전공',
  'Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University',
  '석사과정 (Master''s Candidate)',
  '멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다'
);
```

성공하면 관리자 페이지에서도 저장이 가능해야 합니다.

## 문제 해결

### "relation does not exist" 에러

**원인**: 테이블이 생성되지 않음

**해결**: `database/supabase/schema.sql` 실행

### "permission denied" 에러

**원인**: RLS 정책이 없거나 잘못 설정됨

**해결**: `database/supabase/schema.sql`의 RLS Policies 부분 실행

### "function does not exist" 에러 (벡터 검색)

**원인**: 벡터 검색 함수가 생성되지 않음

**해결**: `database/supabase/functions.sql` 실행

## 확인 체크리스트

- [ ] 모든 테이블 생성됨 (Table Editor에서 확인)
- [ ] RLS 정책 설정됨 (각 테이블의 Policies 탭 확인)
- [ ] 벡터 검색 함수 생성됨 (SQL Editor에서 `SELECT match_embeddings(...)` 테스트)
- [ ] Storage 버킷 생성됨
- [ ] 테스트 쿼리 실행 성공

## 다음 단계

데이터베이스가 준비되면:
1. 개발 서버 재시작: `rm -rf .next && npm run dev`
2. 관리자 페이지에서 프로필 입력
3. 홈페이지에서 확인

