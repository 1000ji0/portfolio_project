# 관리자 로그인 문제 해결 가이드

## 현재 설정 확인

- **ADMIN_EMAIL**: `1000jiji0@gmail.com`
- **NEXT_PUBLIC_APP_URL**: `http://localhost:3000`

## 문제 진단

### 1. Google OAuth 활성화 확인

가장 흔한 원인: Supabase에서 Google OAuth가 활성화되지 않음

**확인 방법:**
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Authentication** → **Providers** (또는 **Sign In / Providers**)
4. **Google** 토글이 **ON**인지 확인

**해결:**
- Google OAuth가 OFF라면 ON으로 변경
- Client ID와 Client Secret 입력 필요

### 2. 에러 메시지 확인

브라우저 콘솔(F12)에서 에러 메시지 확인:

**"provider is not enabled"**
→ Google OAuth 활성화 필요

**"관리자 권한이 없습니다"**
→ 로그인한 이메일이 ADMIN_EMAIL과 일치하지 않음

**"redirect_uri_mismatch"**
→ Google Cloud Console의 Authorized redirect URIs 확인

### 3. 로그인 플로우 확인

1. `/api/auth/signin` 접속
2. Google 로그인 버튼 클릭
3. Google 로그인 완료
4. `/api/auth/callback`으로 리다이렉트
5. `/admin`으로 이동

어느 단계에서 멈추는지 확인하세요.

### 4. 환경 변수 확인

`.env.local` 파일에 다음이 설정되어 있는지 확인:

```env
ADMIN_EMAIL=1000jiji0@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hhxwjrhsuxebzvzlwchj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 5. Google Cloud Console 설정 확인

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. **APIs & Services** → **Credentials**
3. OAuth Client ID 클릭
4. **Authorized redirect URIs**에 다음이 있는지 확인:
   ```
   https://hhxwjrhsuxebzvzlwchj.supabase.co/auth/v1/callback
   ```

## 해결 방법

### 방법 1: Google OAuth 활성화 (가장 중요)

1. Supabase Dashboard → Authentication → **Sign In / Providers**
2. Google 찾기
3. 토글 ON
4. Client ID와 Client Secret 입력
5. Save

### 방법 2: ADMIN_EMAIL 확인

로그인에 사용하는 Google 계정 이메일이 `1000jiji0@gmail.com`과 정확히 일치하는지 확인하세요.

다른 이메일을 사용한다면 `.env.local`의 `ADMIN_EMAIL`을 변경하거나, Google 계정을 변경하세요.

### 방법 3: 임시로 이메일/비밀번호 인증 사용

Google OAuth 설정이 복잡하다면:

1. Supabase Dashboard → Authentication → Providers
2. **Email** 활성화
3. 관리자 계정 생성 (이메일: `1000jiji0@gmail.com`)
4. 로그인 코드 수정 (필요 시)

## 테스트

1. 개발 서버 재시작: `npm run dev`
2. `/api/auth/signin` 접속
3. Google 로그인 시도
4. 에러 메시지 확인

## 디버깅

터미널에서 서버 로그 확인:
```bash
npm run dev
```

브라우저 콘솔(F12)에서 에러 확인:
- Network 탭: API 요청 실패 확인
- Console 탭: JavaScript 에러 확인

## 빠른 확인 체크리스트

- [ ] Supabase에서 Google OAuth 활성화됨
- [ ] Google Cloud Console에 redirect URI 설정됨
- [ ] ADMIN_EMAIL이 로그인 이메일과 일치함
- [ ] .env.local 파일에 모든 환경 변수 설정됨
- [ ] 개발 서버 재시작함

