# 문제 해결 가이드

## 서버 사이드 에러 발생 시

### 1. 환경 변수 확인

터미널에서 다음 명령어로 환경 변수가 제대로 로드되는지 확인:

```bash
cat .env.local
```

**필수 환경 변수**:
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_APP_URL`

**주의**: `your_supabase_url` 같은 플레이스홀더가 아닌 실제 값이어야 합니다.

### 2. 서버 로그 확인

개발 서버를 실행한 터미널에서 에러 메시지를 확인하세요:

```bash
npm run dev
```

에러 메시지 예시:
- `Missing Supabase environment variables` → 환경 변수 미설정
- `Failed to fetch` → Supabase 연결 오류
- `Table does not exist` → 데이터베이스 스키마 미생성

### 3. 일반적인 에러 및 해결 방법

#### 에러: "Missing Supabase environment variables"

**원인**: `.env.local` 파일에 Supabase 환경 변수가 없거나 잘못됨

**해결**:
1. `.env.local` 파일 확인
2. Supabase 프로젝트에서 실제 값 복사
3. 개발 서버 재시작

#### 에러: "Failed to fetch" 또는 네트워크 오류

**원인**: Supabase 프로젝트가 없거나 URL이 잘못됨

**해결**:
1. [Supabase Dashboard](https://app.supabase.com)에서 프로젝트 확인
2. Settings → API에서 URL과 키 확인
3. `.env.local` 파일 업데이트
4. 개발 서버 재시작

#### 에러: "relation does not exist" 또는 "Table does not exist"

**원인**: 데이터베이스 스키마가 생성되지 않음

**해결**:
1. Supabase Dashboard → SQL Editor로 이동
2. `database/supabase/schema.sql` 파일의 내용 실행
3. `database/supabase/functions.sql` 파일의 내용 실행
4. 개발 서버 재시작

#### 에러: "DOMMatrix is not defined" (pdf-parse 관련)

**원인**: pdf-parse는 서버 사이드에서만 작동

**해결**: 이미 수정됨. 문제가 계속되면:
```bash
rm -rf .next
npm run build
```

### 4. 단계별 진단

#### Step 1: 환경 변수 테스트

새 터미널에서:

```bash
cd /Users/cheonjiyeong/my_venv/Portfolio_project
node -e "require('dotenv').config({ path: '.env.local' }); console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

값이 출력되면 환경 변수는 정상입니다.

#### Step 2: Supabase 연결 테스트

Supabase Dashboard에서:
1. Settings → API
2. Project URL과 anon key 확인
3. 테스트 쿼리 실행 (SQL Editor에서 `SELECT 1`)

#### Step 3: 빌드 테스트

```bash
npm run build
```

빌드가 성공하면 코드 문제는 없습니다.

#### Step 4: 개발 서버 재시작

```bash
# 개발 서버 중지 (Ctrl+C)
rm -rf .next
npm run dev
```

### 5. 상세 로그 확인

Next.js 개발 서버는 자동으로 에러를 표시합니다. 브라우저 콘솔과 터미널 모두 확인하세요.

### 6. 데이터베이스 초기화

처음 시작하는 경우:

1. Supabase Dashboard → SQL Editor
2. 다음 SQL 실행:

```sql
-- 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS embeddings CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

3. `database/supabase/schema.sql` 실행
4. `database/supabase/functions.sql` 실행

### 7. 여전히 문제가 있다면

1. **에러 메시지 전체 복사**
2. **터미널 로그 전체 확인**
3. **브라우저 콘솔 에러 확인**
4. **환경 변수 값 확인** (민감한 정보는 마스킹)

## 빠른 체크리스트

- [ ] `.env.local` 파일 존재 확인
- [ ] 모든 환경 변수에 실제 값 설정 (플레이스홀더 아님)
- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 완료
- [ ] Storage 버킷 생성 완료
- [ ] 개발 서버 재시작 (`rm -rf .next && npm run dev`)

## 도움말

추가 도움이 필요하면:
1. 에러 메시지 전체를 복사해주세요
2. 터미널 로그를 확인해주세요
3. 환경 변수 설정 상태를 알려주세요 (값은 제외)

