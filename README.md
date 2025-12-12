# 포트폴리오 웹사이트

AI 기반 개인 연구 포트폴리오 웹사이트

## 프로젝트 구조

```
profile_project/
├── frontend/          # Next.js 프론트엔드
│   ├── app/          # Next.js App Router
│   ├── components/   # React 컴포넌트
│   └── lib/          # 유틸리티 및 설정
├── backend/          # Python FastAPI 백엔드
│   ├── main.py       # FastAPI 서버
│   └── process_pdf.py # PDF 처리 스크립트
├── supabase/         # 데이터베이스 스키마
│   └── schema.sql    # Supabase SQL 스크립트
├── documents/        # 문서 파일들
│   ├── paper/        # 논문 PDF
│   ├── photo.jpeg    # 프로필 사진
│   └── profile.md     # 이력서
├── PRD.md           # 제품 요구사항 문서
└── SETUP.md         # 상세 설정 가이드
```

## 시작하기

### 1. 환경 변수 설정

프로젝트 루트와 `backend/` 폴더에 각각 `.env` 파일을 생성하세요. 자세한 내용은 `SETUP.md`를 참고하세요.

**프로젝트 루트 `.env`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
ADMIN_EMAIL=cj8442@naver.com
BACKEND_API_URL=http://localhost:7001
NEXT_PUBLIC_APP_URL=http://localhost:1234
```

**backend/.env:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:1234
```

### 2. Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 파일의 내용 실행
3. Storage에서 다음 버킷 생성 (모두 public):
   - `profile-images`
   - `documents`
   - `paper-pdfs`
   - `project-images`

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:1234`에서 실행됩니다.

### 4. 백엔드 설정 (가상환경 사용)

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 7001
```

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 7001
```

또는 자동 설정 스크립트 사용:
- macOS/Linux: `./setup.sh`
- Windows: `setup.bat`

백엔드는 `http://localhost:7001`에서 실행됩니다.

> **중요**: 백엔드는 반드시 가상환경을 활성화한 상태에서 실행해야 합니다.

### 5. 초기 데이터 설정

1. **프로필 이미지**: `documents/photo.jpeg`가 이미 `frontend/public/images/`에 복사되어 있습니다.
2. **프로필 정보**: 관리자 페이지(`/admin/profile`)에서 프로필 정보를 입력하세요.
3. **문서 업로드**: 관리자 페이지(`/admin/documents`)에서 PDF 문서를 업로드하세요.
4. **논문 추가**: 관리자 페이지(`/admin/publications`)에서 논문 PDF를 업로드하세요.

## 주요 기능

- ✅ **AI 챗봇**: PDF 문서 기반 RAG로 질의응답
- ✅ **논문 관리**: 논문 목록 및 NotebookLM 스타일 AI 분석
- ✅ **프로필 관리**: 학력, 경력, 기술 스택 등 관리
- ✅ **프로젝트 포트폴리오**: 프로젝트 목록 및 상세 정보
- ✅ **관리자 대시보드**: 모든 컨텐츠 관리 인터페이스
- ✅ **Google OAuth**: 관리자 인증

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: Supabase (PostgreSQL + Vector Extension)
- **AI**: OpenAI GPT-4o-mini, text-embedding-3-small
- **Storage**: Supabase Storage

## 페이지 구조

- `/` - 홈 (AI 챗봇)
- `/profile` - 프로필 전체 보기
- `/publications` - 논문 목록
- `/publications/[id]` - 논문 상세 및 AI 분석
- `/projects` - 프로젝트 포트폴리오
- `/contact` - 연락처 정보
- `/admin` - 관리자 대시보드 (로그인 필요)
- `/admin/documents` - 문서 관리
- `/admin/profile` - 프로필 관리
- `/admin/publications` - 논문 관리
- `/admin/projects` - 프로젝트 관리
- `/admin/contact` - 연락처 관리

## 참고사항

- 상세한 설정 가이드는 `SETUP.md`를 참고하세요.
- 제품 요구사항은 `PRD.md`를 참고하세요.
- 초기 상태에서는 모든 컨텐츠가 비어있습니다. 관리자 페이지에서 데이터를 입력해야 합니다.

