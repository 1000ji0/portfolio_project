# Vercel 무료 배포 가이드

이 가이드는 Next.js 포트폴리오 앱을 Vercel에 무료로 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

1. **GitHub 계정** (이미 있음)
2. **Vercel 계정** (무료 플랜)
3. **Supabase 프로젝트** (이미 설정됨)
4. **Google AI API 키** (이미 있음)
5. **Dify API 키** (이미 있음)

## 🚀 배포 단계

### 1단계: GitHub에 코드 푸시

```bash
# 현재 상태 확인
git status

# 변경사항 커밋
git add .
git commit -m "Deploy to Vercel"

# GitHub에 푸시
git push origin main
```

### 2단계: Vercel 계정 생성 및 프로젝트 연결

1. **Vercel 웹사이트 방문**: https://vercel.com
2. **"Sign Up" 클릭** → GitHub 계정으로 로그인
3. **"Add New Project" 클릭**
4. **GitHub 저장소 선택**: `1000ji0/portfolio_project` (또는 실제 저장소 이름)
5. **"Import" 클릭**

### 3단계: 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `.next` (자동)
- **Install Command**: `npm install` (자동)

### 4단계: 환경 변수 설정

**중요**: `.env.local` 파일의 모든 환경 변수를 Vercel에 추가해야 합니다.

Vercel 프로젝트 설정에서 **"Environment Variables"** 섹션으로 이동하여 다음 변수들을 추가하세요:

#### 필수 환경 변수:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
DIFY_API_KEY=your_dify_api_key
DIFY_API_KEY_HOME=your_dify_home_api_key
```

#### 환경 변수 추가 방법:

1. Vercel 프로젝트 대시보드에서 **"Settings"** 클릭
2. **"Environment Variables"** 메뉴 선택
3. 각 변수를 추가:
   - **Key**: 변수 이름 (예: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: 실제 값
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택
4. **"Save"** 클릭

### 5단계: 배포 실행

1. **"Deploy" 버튼 클릭**
2. Vercel이 자동으로 빌드 및 배포를 시작합니다 (약 2-3분 소요)
3. 배포가 완료되면 **"Visit"** 버튼으로 사이트 확인

### 6단계: 커스텀 도메인 설정 (선택사항)

Vercel은 무료로 `.vercel.app` 도메인을 제공합니다. 커스텀 도메인을 원하면:

1. **"Settings"** → **"Domains"**
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 설정

## 🔧 배포 후 확인사항

### 1. Supabase CORS 설정

Supabase 대시보드에서 Vercel 도메인을 허용해야 합니다:

1. Supabase 대시보드 → **"Settings"** → **"API"**
2. **"CORS"** 섹션에서 Vercel 도메인 추가:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (모든 Vercel 서브도메인)

### 2. 환경 변수 확인

배포된 사이트에서 환경 변수가 제대로 로드되었는지 확인:

- 브라우저 개발자 도구 → Console
- 에러가 없는지 확인

### 3. 기능 테스트

- [ ] 홈 페이지 로드
- [ ] 프로필 정보 표시
- [ ] Paper 페이지 및 채팅
- [ ] AI 챗봇 동작
- [ ] 메시지 보드
- [ ] Analytics (page_views 테이블 생성 후)

## 📝 자동 배포 설정

Vercel은 GitHub에 푸시할 때마다 자동으로 재배포합니다:

1. 코드 수정
2. `git push origin main`
3. Vercel이 자동으로 새 배포 시작

## 🐛 문제 해결

### 빌드 에러

- **에러 로그 확인**: Vercel 대시보드 → "Deployments" → 실패한 배포 클릭
- **환경 변수 확인**: 모든 필수 변수가 설정되었는지 확인
- **로컬 빌드 테스트**: `npm run build` 실행하여 로컬에서 에러 확인

### 환경 변수 문제

- **변수 이름 확인**: 대소문자 정확히 일치하는지 확인
- **값 확인**: 따옴표 없이 값만 입력
- **재배포**: 환경 변수 변경 후 수동으로 재배포 필요

### Supabase 연결 문제

- **CORS 설정 확인**: Vercel 도메인이 허용되었는지 확인
- **RLS 정책 확인**: 필요한 테이블에 적절한 RLS 정책이 설정되었는지 확인

## 💰 비용

Vercel 무료 플랜:
- ✅ 무제한 프로젝트
- ✅ 무제한 배포
- ✅ 100GB 대역폭/월
- ✅ 자동 HTTPS
- ✅ 커스텀 도메인 지원

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase CORS 설정](https://supabase.com/docs/guides/api/api-cors)

