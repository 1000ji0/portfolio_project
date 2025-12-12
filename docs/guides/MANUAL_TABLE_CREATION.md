# Supabase 무료 플랜 - 테이블 수동 생성 가이드

SQL Editor가 없는 무료 플랜에서도 테이블을 생성할 수 있습니다!

## 방법 1: Cursor DB Explorer에서 SQL 실행 (가장 쉬움)

### Step 1: DB Explorer 열기
1. Cursor 왼쪽 사이드바에서 **"DB Explorer"** 아이콘 클릭
2. **"Supabase main (Production)"** 데이터베이스가 보이는지 확인

### Step 2: SQL 실행
1. `database/supabase/create_tables_simple.sql` 파일을 Cursor에서 엽니다
2. **전체 내용 선택** (`Cmd+A`)
3. **복사** (`Cmd+C`)
4. DB Explorer에서 Supabase 데이터베이스 **우클릭**
5. **"New Query"** 또는 **"Execute SQL"** 선택
6. SQL Editor가 열리면 **붙여넣기** (`Cmd+V`)
7. **실행 버튼 클릭** 또는 `Cmd+Enter`

### Step 3: functions_safe.sql 실행
1. `database/supabase/functions_safe.sql` 파일도 동일하게 실행

---

## 방법 2: Supabase Dashboard Table Editor 사용

### Step 1: Table Editor 열기
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴 → **"Table Editor"** 클릭

### Step 2: 테이블 수동 생성

각 테이블을 하나씩 생성합니다:

#### profiles 테이블 생성
1. **"New table"** 클릭
2. 테이블 이름: `profiles`
3. 다음 컬럼 추가:
   - `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
   - `name` (text)
   - `name_en` (text)
   - `profile_image_url` (text)
   - `affiliation` (text)
   - `affiliation_en` (text)
   - `degree_program` (text)
   - `bio` (text)
   - `education` (jsonb, Default: `[]`)
   - `experience` (jsonb, Default: `[]`)
   - `skills` (jsonb, Default: `[]`)
   - `awards` (jsonb, Default: `[]`)
   - `research_interests` (jsonb, Default: `[]`)
   - `other_info` (text)
   - `created_at` (timestamptz, Default: `now()`)
   - `updated_at` (timestamptz, Default: `now()`)
4. **"Save"** 클릭

#### 나머지 테이블들도 동일하게 생성
- `documents`
- `papers`
- `projects`
- `contact`
- `embeddings` (vector 타입 주의!)
- `admin_users`

### Step 3: RLS 설정
각 테이블에서:
1. 테이블 선택
2. **"Policies"** 탭 클릭
3. **"New Policy"** 클릭
4. 정책 추가 (예: "Public profiles are viewable by everyone")

---

## 방법 3: Supabase Dashboard에서 SQL 실행 (가능한 경우)

일부 무료 플랜도 SQL Editor가 있을 수 있습니다:

1. Supabase Dashboard → **"SQL Editor"** 확인
2. 있으면 `create_tables_simple.sql` 내용 실행
3. 없으면 방법 1 또는 2 사용

---

## 추천: Cursor DB Explorer 사용

**가장 쉬운 방법**은 Cursor의 DB Explorer입니다:

1. `database/supabase/create_tables_simple.sql` 파일 열기
2. 전체 복사
3. DB Explorer에서 Supabase 우클릭 → "New Query"
4. 붙여넣기 후 실행

이 방법이 이전에 사용하신 방법과 동일할 것입니다!

## 실행 확인

실행 후 다음 쿼리로 확인:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

7개 테이블이 나와야 합니다.

