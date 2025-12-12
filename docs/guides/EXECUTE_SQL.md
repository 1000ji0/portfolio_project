# Supabase SQL 실행 가이드

Cursor의 DB Explorer를 사용하여 SQL을 실행하는 방법입니다.

## 실행 순서

### Step 1: schema_safe.sql 실행

1. Cursor에서 **DB Explorer** 열기
2. Supabase main (Production) DB 선택
3. **Query** 또는 **SQL Editor** 탭 열기
4. `database/supabase/schema_safe.sql` 파일 내용을 복사하여 붙여넣기
5. **Run** 또는 **Execute** 클릭
6. 성공 메시지 확인

### Step 2: functions_safe.sql 실행

1. 동일한 SQL Editor에서
2. `database/supabase/functions_safe.sql` 파일 내용을 복사하여 붙여넣기
3. **Run** 또는 **Execute** 클릭
4. 성공 메시지 확인

## 생성되는 테이블

다음 테이블들이 생성됩니다:

1. **profiles** - 프로필 정보
2. **documents** - 홈 챗봇용 PDF 문서
3. **papers** - 논문 정보
4. **projects** - 프로젝트 정보
5. **contact** - 연락처 정보
6. **embeddings** - RAG용 벡터 데이터
7. **admin_users** - 관리자 정보

## 생성되는 함수

1. **match_embeddings** - 벡터 유사도 검색 함수
2. **insert_embedding** - 임베딩 삽입 함수

## 확인 방법

SQL 실행 후 다음 쿼리로 확인:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 함수 목록 확인
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- RLS 정책 확인
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 문제 해결

### "extension already exists" 에러
- 무시해도 됩니다. `IF NOT EXISTS`로 안전하게 처리됩니다.

### "table already exists" 에러
- `schema_safe.sql`은 `IF NOT EXISTS`를 사용하므로 안전합니다.
- 기존 데이터는 유지됩니다.

### "policy already exists" 에러
- `schema_safe.sql`은 기존 정책을 먼저 삭제하므로 안전합니다.

### "function already exists" 에러
- `functions_safe.sql`은 `CREATE OR REPLACE`를 사용하므로 안전합니다.

## 실행 후 확인

1. **Table Editor**에서 테이블 목록 확인
2. 각 테이블의 구조 확인
3. RLS Policies 탭에서 정책 확인
4. SQL Editor에서 함수 테스트:

```sql
-- 함수 테스트
SELECT match_embeddings(
  '[0.1, 0.2, ...]'::vector(768),
  0.7,
  5,
  NULL,
  NULL
);
```

## 다음 단계

SQL 실행이 완료되면:
1. 개발 서버 재시작: `rm -rf .next && npm run dev`
2. 관리자 페이지에서 프로필 데이터 입력
3. 홈페이지에서 확인

