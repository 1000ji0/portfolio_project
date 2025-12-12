# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. "Start your project" 또는 "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 강력한 비밀번호 (기억해두세요!)
   - **Region**: 가장 가까운 지역 선택
4. 프로젝트 생성 완료 대기 (약 2분)

## 2. API 키 및 URL 확인

1. Supabase Dashboard에서 프로젝트 선택
2. 좌측 메뉴에서 **Settings** (⚙️) 클릭
3. **API** 메뉴 클릭
4. 다음 정보를 복사:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co` 형태
   - **anon public** key: 긴 문자열 (JWT 토큰 형태)
   - **service_role** key: 긴 문자열 (주의: 비공개로 유지)

## 3. .env.local 파일 업데이트

프로젝트 루트의 `.env.local` 파일을 열고 다음 값들을 업데이트:

```env
# Google AI API
GOOGLE_API_KEY=AIzaSyAEWx7Yh8yYkLXI2BOWDLR6bS8WGWFCBGQ

# Supabase (여기에 실제 값 입력!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin
ADMIN_EMAIL=your_actual_email@gmail.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**중요**:
- `https://`로 시작하는 전체 URL을 입력하세요
- `your_supabase_url` 같은 플레이스홀더를 실제 값으로 교체하세요
- 값에 따옴표(`"`)를 사용하지 마세요

## 4. 데이터베이스 스키마 생성

1. Supabase Dashboard → **SQL Editor** 클릭
2. **New query** 클릭
3. `database/supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. 성공 메시지 확인

## 5. 벡터 검색 함수 생성

1. SQL Editor에서 **New query** 클릭
2. `database/supabase/functions.sql` 파일의 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭
4. 성공 메시지 확인

## 6. Storage 버킷 생성

1. Supabase Dashboard → **Storage** 클릭
2. 다음 버킷들을 생성 (각각 **Public**으로 설정):

   **버킷 1: profile-images**
   - Name: `profile-images`
   - Public: ✅ 체크

   **버킷 2: documents**
   - Name: `documents`
   - Public: ✅ 체크

   **버킷 3: paper-pdfs**
   - Name: `paper-pdfs`
   - Public: ✅ 체크

   **버킷 4: project-images**
   - Name: `project-images`
   - Public: ✅ 체크

## 7. 개발 서버 재시작

```bash
# 개발 서버 중지 (Ctrl+C)
rm -rf .next
npm run dev
```

## 확인 사항

✅ Supabase 프로젝트 생성 완료
✅ API 키 및 URL 복사 완료
✅ .env.local 파일 업데이트 완료
✅ 데이터베이스 스키마 실행 완료
✅ 벡터 검색 함수 생성 완료
✅ Storage 버킷 4개 생성 완료
✅ 개발 서버 재시작 완료

## 문제 해결

### "Invalid supabaseUrl" 에러

- URL이 `https://`로 시작하는지 확인
- 플레이스홀더 값(`your_supabase_url`)이 아닌 실제 값인지 확인
- .env.local 파일 저장 후 개발 서버 재시작

### "Missing Supabase environment variables" 에러

- .env.local 파일이 프로젝트 루트에 있는지 확인
- 파일명이 정확히 `.env.local`인지 확인 (`.env.local.txt` 아님)
- 개발 서버 재시작

### 연결 오류

- Supabase 프로젝트가 활성화되어 있는지 확인
- 인터넷 연결 확인
- URL과 키가 정확한지 다시 확인

## 다음 단계

설정이 완료되면 `TESTING.md`를 참조하여 테스트를 진행하세요.

