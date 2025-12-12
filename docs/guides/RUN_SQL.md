# DATABASE_URL을 사용한 SQL 실행 방법

## 방법 1: psql 사용 (터미널)

### Step 1: psql 설치 확인
```bash
which psql
```

### Step 2: SQL 실행
```bash
cd /Users/cheonjiyeong/my_venv/Portfolio_project

# create_tables.sql 실행
psql "postgresql://postgres.hhxwjrhsuxebzvzlwchj:ai123%21%40%23@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres" -f database/supabase/create_tables.sql

# create_functions.sql 실행
psql "postgresql://postgres.hhxwjrhsuxebzvzlwchj:ai123%21%40%23@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres" -f database/supabase/create_functions.sql
```

### Step 3: 확인
```bash
psql "postgresql://postgres.hhxwjrhsuxebzvzlwchj:ai123%21%40%23@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
```

## 방법 2: Cursor DB Explorer 사용

1. Cursor에서 DB Explorer 열기
2. "New Connection" 또는 "+" 클릭
3. Connection Type: PostgreSQL 선택
4. 다음 정보 입력:
   - Host: `aws-1-ap-northeast-2.pooler.supabase.com`
   - Port: `6543`
   - Database: `postgres`
   - Username: `postgres.hhxwjrhsuxebzvzlwchj`
   - Password: `ai123!@#`
5. 연결 후 SQL 파일 실행

## 방법 3: .env.local에 추가 (선택사항)

프로젝트에서 직접 PostgreSQL 연결이 필요하면:

```env
DATABASE_URL=postgresql://postgres.hhxwjrhsuxebzvzlwchj:ai123%21%40%23@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

**주의**: 이 URL은 직접 DB 연결용이며, 현재 프로젝트는 Supabase REST API를 사용하므로 필수는 아닙니다.

