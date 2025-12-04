# Dify 지식베이스 연동 가이드

## 설정

### 1. 환경 변수 추가

`.env.local` 파일에 Dify API 키를 추가하세요:

```env
DIFY_API_KEY=your_dify_api_key_here
```

Dify API 키는 Dify 대시보드에서 발급받을 수 있습니다.

### 2. 논문 추가

MADM 논문을 데이터베이스에 추가:

```bash
# 개발 서버가 실행 중이어야 합니다
npm run dev

# 다른 터미널에서
curl -X POST http://localhost:3001/api/admin/papers/add-madm \
  -H "Content-Type: application/json"
```

또는 스크립트 사용:

```bash
./scripts/add-madm-paper.sh
```

### 3. Dify 지식베이스 설정

1. Dify 대시보드에 로그인
2. 지식베이스 생성 또는 기존 지식베이스 선택
3. 논문 PDF 업로드: `문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf`
4. API 키 발급 및 `.env.local`에 설정

### 4. 테스트

1. 홈페이지에서 `/publications` 접속
2. "설계 중심의 Multi Agent Design Methodology(MADM) 제안" 논문 클릭
3. "AI로 요약/정리하기" 버튼 클릭
4. Dify 지식베이스를 기반으로 한 답변 확인

## API 엔드포인트

- **백엔드 API**: `https://api.dify.ai/v1`
- **웹앱**: `https://udify.app/chat/o6mgf5YVWRLOj5NH`
- **MCP 서버**: `https://api.dify.ai/mcp/server/1WZgbNnJCoYNZbev/mcp`

## 문제 해결

### "DIFY_API_KEY is not set"
- `.env.local` 파일에 `DIFY_API_KEY` 환경 변수가 설정되었는지 확인
- 개발 서버 재시작

### API 오류
- Dify API 키가 유효한지 확인
- API 할당량 확인
- 네트워크 연결 확인

