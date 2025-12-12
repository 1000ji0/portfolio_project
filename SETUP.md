# 설정 가이드

## 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin
ADMIN_EMAIL=cj8442@naver.com

# Backend API
BACKEND_API_URL=http://localhost:7001

# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:1234
```

백엔드 폴더에도 `.env` 파일을 생성하세요:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:1234
```

## 2. Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 파일의 내용 실행
3. Storage에서 다음 버킷 생성:
   - `profile-images` (public)
   - `documents` (public)
   - `paper-pdfs` (public)
   - `project-images` (public)

## 3. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

## 4. 백엔드 설정 (가상환경 필수)

백엔드는 Python 가상환경을 사용합니다. **반드시 가상환경을 활성화한 상태에서 실행해야 합니다.**

### macOS/Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload
```

### Windows

```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload
```

### 자동 설정 스크립트 사용

**macOS/Linux:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
cd backend
setup.bat
```

> **주의사항:**
> - 가상환경이 활성화되면 터미널 프롬프트 앞에 `(venv)`가 표시됩니다.
> - 가상환경을 비활성화하려면 `deactivate` 명령을 사용하세요.
> - 백엔드 서버는 가상환경이 활성화된 상태에서만 실행해야 합니다.
> - `requirements.txt`에 명시된 모든 의존성이 설치됩니다.

## 5. 초기 데이터 설정

### 프로필 이미지 설정
`documents/photo.jpeg` 파일을 Supabase Storage의 `profile-images` 버킷에 업로드하고, URL을 프로필에 설정하세요.

### 초기 문서 업로드
관리자 페이지(`/admin/documents`)에서 PDF 문서를 업로드하세요.

### 논문 추가
관리자 페이지(`/admin/publications`)에서 논문 PDF를 업로드하세요.

## 6. Google OAuth 설정

1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
2. 승인된 리디렉션 URI에 `http://localhost:1234/auth/callback` 추가
3. Supabase Authentication 설정에서 Google Provider 활성화

