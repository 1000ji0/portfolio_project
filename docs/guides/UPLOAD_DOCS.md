# 문서 업로드 가이드 (관리자 로그인 없이)

논문과 프로필 문서를 RAG로 직접 업로드하는 방법입니다.

## 방법 1: API 라우트 사용 (권장)

### Step 1: 개발 서버 실행

```bash
npm run dev
```

### Step 2: API 호출로 업로드

터미널에서 다음 명령어 실행:

#### 논문 PDF 업로드
```bash
# 포트 확인: 터미널에서 "Local: http://localhost:XXXX" 확인 후 포트 번호 변경
curl -X POST http://localhost:3001/api/admin/documents/upload-direct \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf",
    "fileName": "(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf",
    "description": "천지영 연구자의 논문: 설계 중심의 Multi AI Agent Design Methodology(MADM) 제안",
    "fileType": "pdf"
  }'
```

#### 프로필 마크다운 업로드
```bash
curl -X POST http://localhost:3001/api/admin/documents/upload-direct \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "문서/profile.md",
    "fileName": "profile.md",
    "description": "천지영 연구자의 프로필 및 이력서",
    "fileType": "markdown"
  }'
```

**참고:** 개발 서버가 다른 포트(예: 3001)에서 실행 중이면 URL의 포트 번호를 변경하세요.

### Step 3: 업로드 확인

브라우저에서 `http://localhost:3000` 접속하여 챗봇에 질문해보세요.

## 방법 2: 스크립트 사용

`scripts/upload-simple.sh` 파일을 실행:

```bash
# 개발 서버가 실행 중이어야 합니다
npm run dev

# 다른 터미널에서
./scripts/upload-simple.sh
```

## 업로드 확인

업로드가 완료되면:

1. Supabase Dashboard → Table Editor → `documents` 테이블 확인
2. `embeddings` 테이블에 임베딩이 생성되었는지 확인
3. 홈페이지 챗봇에서 테스트:
   - "천지영님의 연구 분야는 무엇인가요?"
   - "MADM에 대해 설명해주세요"
   - "학력과 경력을 알려주세요"

## 문제 해결

### "Internal server error"
- 개발 서버가 실행 중인지 확인
- `.env.local`에 모든 환경 변수가 설정되었는지 확인

### "pdf-parse를 올바르게 로드할 수 없습니다"
- `npm install pdf-parse` 실행
- 개발 서버 재시작

### 임베딩 생성 실패
- Google API 키가 유효한지 확인
- API 할당량 확인

