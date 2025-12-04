# 빠른 시작 가이드

## 개발 서버 실행

### 방법 1: 기본 실행

```bash
npm run dev
```

### 방법 2: 포트 지정

```bash
PORT=3000 npm run dev
```

### 방법 3: 기존 프로세스 종료 후 실행

```bash
# 기존 프로세스 종료
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null

# 잠금 파일 제거
rm -rf .next/dev/lock

# 개발 서버 실행
npm run dev
```

## 서버 확인

서버가 정상적으로 실행되면 터미널에 다음과 같이 표시됩니다:

```
▲ Next.js 16.0.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.16.245.156:3000
- Environments: .env.local, .env

✓ Ready in X seconds
```

브라우저에서 `http://localhost:3000` (또는 표시된 포트)로 접속하세요.

## 다음 단계

1. **논문 추가** (선택사항):
   ```bash
   curl -X POST http://localhost:3000/api/admin/papers/add-madm \
     -H "Content-Type: application/json"
   ```

2. **문서 업로드** (선택사항):
   ```bash
   # 논문 PDF
   curl -X POST http://localhost:3000/api/admin/documents/upload-direct \
     -H "Content-Type: application/json" \
     -d '{"filePath":"문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf","fileName":"(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf","description":"논문","fileType":"pdf"}'
   
   # 프로필
   curl -X POST http://localhost:3000/api/admin/documents/upload-direct \
     -H "Content-Type: application/json" \
     -d '{"filePath":"문서/profile.md","fileName":"profile.md","description":"프로필","fileType":"markdown"}'
   ```

## MCP 서버 연동

Cursor에 MCP 서버가 추가되어 있다면, Dify API를 통해 자동으로 연동됩니다.

- **MCP 서버 URL**: `https://api.dify.ai/mcp/server/1WZgbNnJCoYNZbev/mcp`
- **Dify API**: `https://api.dify.ai/v1`
- **웹앱**: `https://udify.app/chat/o6mgf5YVWRLOj5NH`

## 문제 해결

### 서버가 시작되지 않는 경우

1. **포트 확인**:
   ```bash
   lsof -ti:3000,3001
   ```

2. **의존성 재설치**:
   ```bash
   rm -rf node_modules .next
   npm install
   ```

3. **환경 변수 확인**:
   `.env.local` 파일이 존재하고 필요한 변수들이 설정되어 있는지 확인

### 에러 메시지 확인

터미널에 표시된 에러 메시지를 확인하고, 필요시 `START_SERVER.md`를 참조하세요.
