# Google OAuth 활성화 가이드

"Unsupported provider: provider is not enabled" 에러는 Supabase에서 Google OAuth가 활성화되지 않았기 때문입니다.

## 해결 방법

### Step 1: Supabase Dashboard에서 Google OAuth 활성화

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴 → **Authentication** 클릭
4. **Providers** 탭 클릭
5. **Google** 찾기
6. **Enable Google** 토글을 켜기 (ON)
7. 다음 정보 입력:
   - **Client ID (for OAuth)**: Google Cloud Console에서 가져오기
   - **Client Secret (for OAuth)**: Google Cloud Console에서 가져오기
8. **Save** 클릭

### Step 2: Google Cloud Console에서 OAuth 설정

Google OAuth를 사용하려면 Google Cloud Console에서 설정이 필요합니다:

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택 또는 새로 생성
3. **APIs & Services** → **Credentials** 클릭
4. **Create Credentials** → **OAuth client ID** 선택
5. Application type: **Web application** 선택
6. **Authorized redirect URIs**에 추가:
   ```
   https://hhxwjrhsuxebzvzlwchj.supabase.co/auth/v1/callback
   ```
   (로컬 개발용으로는):
   ```
   http://localhost:3000/api/auth/callback
   ```
7. **Create** 클릭
8. **Client ID**와 **Client Secret** 복사

### Step 3: Supabase에 OAuth 정보 입력

1. Supabase Dashboard → Authentication → Providers → Google
2. **Client ID** 입력
3. **Client Secret** 입력
4. **Save** 클릭

### Step 4: Redirect URL 확인

Supabase Dashboard → Authentication → URL Configuration에서:
- **Site URL**: `http://localhost:3000` (개발용)
- **Redirect URLs**: 다음 추가:
  ```
  http://localhost:3000/api/auth/callback
  https://your-domain.com/api/auth/callback
  ```

## 대안: 이메일/비밀번호 인증 사용

Google OAuth 설정이 복잡하다면, 임시로 이메일/비밀번호 인증을 사용할 수 있습니다:

1. Supabase Dashboard → Authentication → Providers
2. **Email** 활성화
3. 관리자 이메일로 계정 생성
4. 로그인 페이지 수정 (이메일/비밀번호 입력)

## 확인

설정 완료 후:
1. 개발 서버 재시작: `npm run dev`
2. `/api/auth/signin` 접속
3. Google 로그인 버튼 클릭
4. 정상적으로 리다이렉트되는지 확인

## 문제 해결

### "redirect_uri_mismatch" 에러
- Google Cloud Console의 Authorized redirect URIs에 정확한 URL이 추가되었는지 확인

### "invalid_client" 에러
- Client ID와 Client Secret이 정확한지 확인
- Supabase Dashboard에 올바르게 입력되었는지 확인

### 여전히 작동하지 않으면
- Supabase Dashboard → Authentication → Logs에서 상세 에러 확인
- 브라우저 콘솔에서 추가 에러 메시지 확인

