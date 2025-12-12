# 배포 가이드

이 프로젝트는 프론트엔드(Next.js)와 백엔드(FastAPI)를 분리하여 배포합니다.

## 배포 전 준비사항

### 1. Git 저장소 초기화 및 GitHub 푸시

```bash
# 프로젝트 루트에서
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. .gitignore 확인

다음 파일들이 `.gitignore`에 포함되어 있는지 확인:
- `.env` (환경 변수 파일)
- `node_modules/`
- `backend/venv/`
- `.next/`
- 기타 빌드 파일들

## 프론트엔드 배포 (Vercel)

### 방법 1: Vercel 웹 대시보드 사용 (권장)

1. **Vercel 가입 및 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 선택
   - **Root Directory**: `frontend`로 설정
   - Framework Preset: Next.js (자동 감지)

3. **환경 변수 설정**
   Vercel 대시보드의 "Environment Variables"에서 다음 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ADMIN_EMAIL=cj8442@naver.com
   BACKEND_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```

4. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 후 URL 확인

### 방법 2: Vercel CLI 사용

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

## 백엔드 배포

### 옵션 1: Railway (권장)

1. **Railway 가입**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" → "Deploy from GitHub repo"
   - 저장소 선택
   - **Root Directory**: `backend`로 설정

3. **환경 변수 설정**
   Railway 대시보드의 "Variables"에서:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```

4. **빌드 설정**
   Railway는 자동으로 Python 프로젝트를 감지하지만, 다음 설정 확인:
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.12

5. **배포**
   - 자동으로 배포 시작
   - 배포 완료 후 URL 확인 (예: `https://your-app.railway.app`)

### 옵션 2: Render

1. **Render 가입**
   - https://render.com 접속
   - GitHub 계정으로 로그인

2. **Web Service 생성**
   - "New +" → "Web Service"
   - 저장소 선택
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **환경 변수 설정**
   Render 대시보드의 "Environment"에서 동일한 변수들 추가

4. **배포**
   - "Create Web Service" 클릭

### 옵션 3: Fly.io

```bash
cd backend
flyctl launch
# 설정 완료 후
flyctl deploy
```

## 배포 후 설정

### 1. CORS 설정 업데이트

백엔드 `main.py`의 CORS 설정에 프론트엔드 URL 추가:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1234",
        "https://your-vercel-app.vercel.app",
        os.getenv("NEXT_PUBLIC_APP_URL", "")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. 환경 변수 업데이트

프론트엔드 `.env` 또는 Vercel 환경 변수에서:
```
BACKEND_API_URL=https://your-backend-url.com
```

### 3. Supabase RLS 정책 확인

프로덕션 환경에서도 RLS 정책이 올바르게 작동하는지 확인하세요.

## 자동 배포 설정

### GitHub Actions (선택사항)

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm install && npm run build
```

## 업데이트 배포

코드를 수정한 후 다시 배포하려면:

### Vercel (프론트엔드)
```bash
cd frontend
git add .
git commit -m "Update: 설명"
git push origin main
# Vercel이 자동으로 재배포
```

또는 Vercel CLI 사용:
```bash
cd frontend
vercel --prod
```

### Railway/Render (백엔드)
- GitHub에 푸시하면 자동 재배포
- 또는 대시보드에서 "Redeploy" 버튼 클릭

## 문제 해결

### 프론트엔드가 백엔드에 연결되지 않을 때
1. 백엔드 URL이 올바른지 확인
2. CORS 설정 확인
3. 환경 변수 `BACKEND_API_URL` 확인

### 환경 변수가 적용되지 않을 때
1. Vercel/Railway 대시보드에서 환경 변수 확인
2. 재배포 필요 (환경 변수 변경 후)
3. 빌드 로그 확인

### 빌드 오류
1. 로컬에서 `npm run build` 테스트
2. 빌드 로그 확인
3. 의존성 버전 확인

## 참고

- **프론트엔드**: Vercel (무료 플랜 사용 가능)
- **백엔드**: Railway (무료 플랜 $5 크레딧/월) 또는 Render (무료 플랜 사용 가능)
- **데이터베이스**: Supabase (무료 플랜 사용 가능)

