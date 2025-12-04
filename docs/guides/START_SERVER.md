# 개발 서버 실행 가이드

## 빠른 시작

### 1. 개발 서버 실행

```bash
npm run dev
```

서버가 시작되면 터미널에 다음과 같은 메시지가 표시됩니다:

```
▲ Next.js 16.0.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.16.245.156:3000
- Environments: .env.local, .env

✓ Ready in X seconds
```

### 2. 브라우저에서 확인

터미널에 표시된 URL(예: `http://localhost:3000`)로 접속하세요.

## 문제 해결

### 포트가 이미 사용 중인 경우

포트 3000이 이미 사용 중이면 자동으로 3001, 3002 등으로 변경됩니다.
터미널에 표시된 포트 번호를 확인하세요.

### 잠금 파일 오류

다음 명령어로 해결:

```bash
# 기존 프로세스 종료
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 잠금 파일 제거
rm -rf .next/dev/lock

# 다시 실행
npm run dev
```

### 의존성 문제

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수 확인

`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google AI
GOOGLE_API_KEY=your-google-api-key

# Dify (선택사항)
DIFY_API_KEY=your-dify-api-key

# 기타
ADMIN_EMAIL=your-email@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 일반적인 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## MCP 서버 연동

Cursor에 MCP 서버가 추가되어 있다면, Dify API를 통해 자동으로 연동됩니다.

MCP 서버 URL: `https://api.dify.ai/mcp/server/1WZgbNnJCoYNZbev/mcp`

