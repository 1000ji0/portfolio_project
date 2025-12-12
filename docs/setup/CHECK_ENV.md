# 환경 변수 확인 가이드

에러가 발생하는 경우, 먼저 환경 변수가 제대로 설정되었는지 확인하세요.

## 빠른 확인 방법

터미널에서 다음 명령어 실행:

```bash
cd /Users/cheonjiyeong/my_venv/Portfolio_project
cat .env.local | grep SUPABASE
```

## 확인 사항

### 1. 파일 존재 확인

`.env.local` 파일이 프로젝트 루트에 있는지 확인:

```bash
ls -la .env.local
```

### 2. 환경 변수 값 확인

다음 명령어로 실제 값이 설정되어 있는지 확인:

```bash
cat .env.local
```

**중요**: 다음처럼 플레이스홀더가 아닌 실제 값이어야 합니다:

❌ 잘못된 예:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

✅ 올바른 예:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase 프로젝트 생성 확인

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트가 생성되어 있는지 확인
3. 프로젝트가 활성화되어 있는지 확인 (일시정지 상태가 아닌지)

### 4. 환경 변수 가져오기

Supabase Dashboard에서:
1. 프로젝트 선택
2. **Settings** → **API** 클릭
3. 다음 값들을 복사:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key: 긴 문자열
   - **service_role** key: 긴 문자열 (비공개)

### 5. .env.local 파일 업데이트

`.env.local` 파일을 열고 다음 형식으로 입력:

```env
# Google AI API
GOOGLE_API_KEY=AIzaSyAEWx7Yh8yYkLXI2BOWDLR6bS8WGWFCBGQ

# Supabase (실제 값으로 교체!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin
ADMIN_EMAIL=your_email@gmail.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**주의사항**:
- URL은 `https://`로 시작해야 합니다
- 값에 따옴표(`"`)를 사용하지 마세요
- 공백이나 줄바꿈이 없어야 합니다

### 6. 개발 서버 재시작

환경 변수를 변경한 후 반드시 개발 서버를 재시작하세요:

```bash
# 개발 서버 중지 (Ctrl+C)
rm -rf .next
npm run dev
```

## 일반적인 에러 및 해결

### "Invalid supabaseUrl" 에러

**원인**: URL이 잘못되었거나 플레이스홀더 값

**해결**:
1. Supabase Dashboard에서 Project URL 확인
2. `.env.local`에 정확한 URL 입력 (https://로 시작)
3. 개발 서버 재시작

### "Missing Supabase environment variables" 에러

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. `.env.local` 파일 존재 확인
2. 모든 Supabase 환경 변수 입력 확인
3. 개발 서버 재시작

### "Profile fetch error" 또는 "Papers fetch error"

**원인**: Supabase 연결 실패 또는 데이터베이스 스키마 미생성

**해결**:
1. 환경 변수 확인 (위 단계 참조)
2. Supabase 프로젝트 상태 확인
3. 데이터베이스 스키마 생성 확인 (`SETUP_SUPABASE.md` 참조)

### "/api/chat 500 에러"

**원인**: RAG 검색 실패 (Supabase 연결 또는 벡터 검색 함수 미생성)

**해결**:
1. Supabase 환경 변수 확인
2. `database/supabase/functions.sql` 실행 확인
3. 문서가 업로드되었는지 확인

## 테스트 방법

환경 변수가 제대로 로드되는지 테스트:

```bash
node -e "require('dotenv').config({ path: '.env.local' }); console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '설정 안됨')"
```

값이 출력되면 환경 변수는 정상입니다.

## 추가 도움말

- `SETUP_SUPABASE.md`: Supabase 초기 설정 가이드
- `TROUBLESHOOTING.md`: 문제 해결 가이드

