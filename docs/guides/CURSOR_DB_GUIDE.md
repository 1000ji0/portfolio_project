# Cursor DB Explorer에서 SQL 실행하는 방법

## 📋 단계별 가이드

### Step 1: DB Explorer 열기

1. **Cursor 왼쪽 사이드바**에서 **DB Explorer** 아이콘 클릭
   - 또는 `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
   - "Database: Connect" 검색
2. **Supabase main (Production)** 데이터베이스 선택
3. 연결이 완료되면 데이터베이스가 트리 뷰에 표시됩니다

### Step 2: SQL Editor 열기

**방법 A: DB Explorer에서**
1. DB Explorer에서 **Supabase** 데이터베이스 확장
2. **"New Query"** 또는 **"SQL Editor"** 클릭
3. SQL 편집기가 열립니다

**방법 B: 파일에서 직접**
1. `database/supabase/schema_safe.sql` 파일을 Cursor에서 엽니다
2. 파일 내용 전체 선택 (`Cmd+A` / `Ctrl+A`)
3. 복사 (`Cmd+C` / `Ctrl+C`)
4. DB Explorer의 SQL Editor에 붙여넣기 (`Cmd+V` / `Ctrl+V`)

### Step 3: SQL 실행

1. SQL Editor에 SQL이 입력되어 있는지 확인
2. **"Run"** 또는 **"Execute"** 버튼 클릭
   - 또는 `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
3. 실행 결과 확인:
   - ✅ 성공: "Success" 또는 "Query executed successfully" 메시지
   - ❌ 실패: 에러 메시지 확인

### Step 4: functions_safe.sql 실행

1. `database/supabase/functions_safe.sql` 파일 열기
2. 전체 내용 복사
3. SQL Editor에 붙여넣기 (기존 내용 위에 덮어쓰기)
4. 실행

## 🔍 실행 결과 확인

### 테이블 생성 확인

SQL Editor에서 다음 쿼리 실행:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'documents', 'papers', 'projects', 'contact', 'embeddings', 'admin_users')
ORDER BY table_name;
```

**예상 결과**: 7개의 테이블이 나열되어야 합니다

### 함수 생성 확인

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN ('match_embeddings', 'insert_embedding');
```

**예상 결과**: 2개의 함수가 나열되어야 합니다

## ⚠️ 문제 해결

### "extension already exists" 에러
- **의미**: 확장이 이미 존재함
- **해결**: 무시해도 됩니다. `IF NOT EXISTS`로 안전하게 처리됩니다.

### "table already exists" 에러
- **의미**: 테이블이 이미 존재함
- **해결**: `schema_safe.sql`은 `IF NOT EXISTS`를 사용하므로 안전합니다.
- **확인**: 테이블이 이미 있다면 그대로 사용하면 됩니다.

### "policy already exists" 에러
- **의미**: 정책이 이미 존재함
- **해결**: `schema_safe.sql`의 `DROP POLICY IF EXISTS` 부분이 실행되지 않았을 수 있습니다.
- **해결 방법**: SQL을 다시 실행하거나, 에러가 나는 정책 라인을 주석 처리하고 실행

### "permission denied" 에러
- **의미**: 권한이 없음
- **해결**: Supabase Dashboard에서 직접 실행하거나, Service Role Key를 사용해야 할 수 있습니다.

### 테이블이 생성되지 않음
- **확인 사항**:
  1. SQL이 실제로 실행되었는지 확인 (에러 메시지 확인)
  2. 다른 스키마에 생성되었는지 확인
  3. Supabase Dashboard → Table Editor에서 확인

## 🎯 대안: Supabase Dashboard에서 실행

Cursor DB Explorer가 작동하지 않으면:

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴 → **SQL Editor** 클릭
4. **New query** 클릭
5. `database/supabase/schema_safe.sql` 내용 붙여넣기
6. **Run** 클릭
7. `database/supabase/functions_safe.sql`도 동일하게 실행

## ✅ 실행 완료 체크리스트

- [ ] `schema_safe.sql` 실행 완료
- [ ] `functions_safe.sql` 실행 완료
- [ ] 7개 테이블 생성 확인
- [ ] 2개 함수 생성 확인
- [ ] RLS 정책 생성 확인

## 다음 단계

SQL 실행이 완료되면:
1. 개발 서버 재시작: `rm -rf .next && npm run dev`
2. 관리자 페이지에서 프로필 데이터 입력
3. 홈페이지에서 확인

