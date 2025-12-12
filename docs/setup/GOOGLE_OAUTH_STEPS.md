# Google OAuth 설정 위치 (스크린샷 기준)

## 정확한 위치

스크린샷에서 보이는 왼쪽 사이드바를 보세요:

### Step 1: Providers 메뉴 찾기
1. 왼쪽 사이드바에서 **"CONFIGURATION"** 섹션 찾기
2. 그 아래에 **"Sign In / Providers"** 메뉴가 있습니다
3. **"Sign In / Providers"** 클릭

### Step 2: Google 활성화
1. "Sign In / Providers" 페이지가 열리면
2. 여러 Provider 목록이 보일 것입니다 (Google, GitHub, Apple 등)
3. **Google** 찾기
4. Google 옆에 있는 **토글 스위치**를 켜기 (ON)

### Step 3: Google OAuth 정보 입력
Google을 활성화하면 다음 정보를 입력해야 합니다:

1. **Client ID (for OAuth)**: Google Cloud Console에서 가져오기
2. **Client Secret (for OAuth)**: Google Cloud Console에서 가져오기

## Google Cloud Console에서 OAuth 정보 가져오기

### Step 1: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택 또는 새로 생성

### Step 2: OAuth Client ID 생성
1. 왼쪽 메뉴 → **APIs & Services** → **Credentials** 클릭
2. 상단 **"+ CREATE CREDENTIALS"** 클릭
3. **"OAuth client ID"** 선택
4. 처음이면 OAuth 동의 화면 설정 필요:
   - **User Type**: External 선택
   - **App name**: 원하는 이름 (예: Portfolio Admin)
   - **User support email**: 본인 이메일
   - **Developer contact**: 본인 이메일
   - **Save and Continue** 클릭
   - Scopes는 기본값으로 **Save and Continue**
   - Test users에 본인 이메일 추가 (선택사항)
   - **Back to Dashboard** 클릭

### Step 3: OAuth Client ID 생성
1. **"+ CREATE CREDENTIALS"** → **"OAuth client ID"** 다시 클릭
2. **Application type**: **Web application** 선택
3. **Name**: 원하는 이름 (예: Portfolio Admin)
4. **Authorized redirect URIs**에 추가:
   ```
   https://hhxwjrhsuxebzvzlwchj.supabase.co/auth/v1/callback
   ```
5. **CREATE** 클릭
6. **Client ID**와 **Client Secret** 복사 (나중에 다시 볼 수 없으니 저장!)

### Step 4: Supabase에 입력
1. Supabase Dashboard → Authentication → **Sign In / Providers**
2. Google 활성화
3. **Client ID** 붙여넣기
4. **Client Secret** 붙여넣기
5. **Save** 클릭

## 확인

설정 완료 후:
1. 개발 서버 재시작: `npm run dev`
2. `/api/auth/signin` 접속
3. Google 로그인 버튼 클릭
4. 정상적으로 Google 로그인 페이지로 리다이렉트되는지 확인

## 문제 해결

### "Sign In / Providers" 메뉴가 안 보여요
- 왼쪽 사이드바를 스크롤해서 "CONFIGURATION" 섹션을 찾으세요
- "Sign In / Providers"는 "Policies" 아래에 있습니다

### Google이 목록에 없어요
- Supabase 무료 플랜에서도 Google OAuth는 사용 가능합니다
- 페이지를 새로고침해보세요

### 여전히 에러가 나요
- Supabase Dashboard → Authentication → **Logs**에서 상세 에러 확인
- 브라우저 콘솔(F12)에서 추가 에러 메시지 확인

