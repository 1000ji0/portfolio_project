# Vercel 배포 가이드

이 문서는 포트폴리오 웹사이트를 Vercel에 배포하는 방법을 설명합니다.

## 사전 준비

1. **GitHub 저장소 생성**
   - 프로젝트를 GitHub에 푸시해야 합니다
   - 모든 파일이 커밋되어 있는지 확인하세요

2. **Supabase 프로젝트 설정 완료**
   - 데이터베이스 스키마 생성 완료
   - Storage 버킷 생성 완료
   - 환경 변수 준비

## 배포 단계

### 1. Vercel 계정 생성 및 로그인

1. [Vercel](https://vercel.com)에 접속
2. GitHub 계정으로 로그인
3. 대시보드로 이동

### 2. 새 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

### 3. 환경 변수 설정

**중요**: 배포 전에 반드시 환경 변수를 설정해야 합니다.

Vercel 프로젝트 설정 → **Environment Variables**에서 다음 변수들을 추가하세요:

```
GOOGLE_API_KEY=AIzaSyAEWx7Yh8yYkLXI2BOWDLR6bS8WGWFCBGQ

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ADMIN_EMAIL=your_admin_email@example.com

NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**환경별 설정**:
- **Production**: 프로덕션 환경
- **Preview**: 프리뷰 환경 (PR 등)
- **Development**: 개발 환경

모든 환경에 동일한 변수를 추가하거나, 환경별로 다르게 설정할 수 있습니다.

### 4. Supabase 설정

#### CORS 설정

Supabase 대시보드에서 CORS 설정을 추가해야 합니다:

1. Supabase 프로젝트 → **Settings** → **API**
2. **CORS** 섹션에서 Vercel 도메인 추가:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (프리뷰 환경용)

#### Redirect URL 설정

1. Supabase 프로젝트 → **Authentication** → **URL Configuration**
2. **Redirect URLs**에 추가:
   - `https://your-project.vercel.app/api/auth/callback`
   - `https://your-project.vercel.app/**`

### 5. 배포 실행

1. 환경 변수 설정 완료 후 **"Deploy"** 버튼 클릭
2. 빌드 진행 상황 확인
3. 배포 완료 후 제공되는 URL로 접속

### 6. 배포 후 확인

1. **홈페이지 접속**: `https://your-project.vercel.app`
2. **관리자 로그인 테스트**: `/api/auth/signin`
3. **각 페이지 동작 확인**

## 자동 배포 설정

Vercel은 기본적으로 다음 경우에 자동 배포됩니다:

- **Production**: `main` 또는 `master` 브랜치에 푸시 시
- **Preview**: 다른 브랜치에 푸시 시

## 환경 변수 업데이트

환경 변수를 변경하려면:

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
2. 변수 수정 또는 추가
3. **Redeploy** 클릭하여 재배포

## 문제 해결

### 빌드 실패

1. **로그 확인**: Vercel 대시보드의 **Deployments** 탭에서 로그 확인
2. **로컬 빌드 테스트**:
   ```bash
   npm run build
   ```
3. **환경 변수 확인**: 모든 필수 환경 변수가 설정되었는지 확인

### PDF 파싱 오류

`pdf-parse`는 Node.js 네이티브 모듈입니다. Vercel에서 자동으로 처리되지만, 문제가 발생하면:

1. `package.json`에 `engines` 필드 추가:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Supabase 연결 오류

1. CORS 설정 확인
2. 환경 변수 확인 (특히 `NEXT_PUBLIC_SUPABASE_URL`)
3. Supabase 프로젝트 상태 확인

## 커스텀 도메인 설정 (선택)

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 도메인 추가
3. DNS 설정 안내에 따라 DNS 레코드 추가

## 모니터링

- **Analytics**: Vercel 대시보드에서 트래픽 및 성능 모니터링
- **Logs**: 실시간 로그 확인
- **Functions**: Serverless 함수 실행 통계

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)

