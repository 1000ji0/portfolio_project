# 포트폴리오 웹사이트 - 기술 문서

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [프로젝트 목적 및 배경](#프로젝트-목적-및-배경)
3. [핵심 기능](#핵심-기능)
4. [기술 아키텍처](#기술-아키텍처)
5. [주요 기술 스택](#주요-기술-스택)
6. [MCP (Model Context Protocol) 활용](#mcp-model-context-protocol-활용)
7. [RAG (Retrieval-Augmented Generation) 구현](#rag-retrieval-augmented-generation-구현)
8. [시스템 아키텍처](#시스템-아키텍처)
9. [데이터베이스 설계](#데이터베이스-설계)
10. [배포 및 인프라](#배포-및-인프라)

---

## 프로젝트 개요

### 프로젝트 명
**AI 기반 개인 연구 포트폴리오 웹사이트**

연구자의 학력, 경력, 연구 업적을 효과적으로 소개하고, 방문자가 AI 챗봇과 대화하며 정보를 탐색할 수 있는 인터랙티브 포트폴리오 플랫폼입니다.

### 개발자 정보
- **이름**: 천지영 (Jiyeong Cheon)
- **소속**: 명지대학교 기록정보과학전문대학원 AI정보과학전공
- **학위 과정**: 석사과정 (Master's Candidate)

---

## 프로젝트 목적 및 배경

### 1. 프로젝트를 만든 이유

#### 1.1 전통적인 포트폴리오의 한계
기존의 정적 포트폴리오 웹사이트는 다음과 같은 한계가 있었습니다:
- **일방향 소통**: 방문자가 정보를 단순히 읽기만 함
- **제한된 정보 탐색**: 원하는 정보를 찾기 위해 여러 페이지를 탐색해야 함
- **개인화 부족**: 모든 방문자에게 동일한 정보만 제공
- **관리 복잡성**: 컨텐츠 업데이트 시 코드 수정 필요

#### 1.2 AI 기술을 활용한 혁신적 접근
본 프로젝트는 다음과 같은 목표를 가지고 있습니다:
- **대화형 인터페이스**: 방문자가 자연어로 질문하고 AI가 답변
- **지능형 정보 검색**: RAG 기술로 관련 문서에서 정확한 정보 추출
- **NotebookLM 스타일 논문 분석**: 논문을 AI가 요약하고 심층 질의응답 제공
- **쉬운 컨텐츠 관리**: 관리자 대시보드에서 코드 수정 없이 모든 컨텐츠 관리

#### 1.3 연구 관심 분야의 실증
본인의 연구 관심 분야인 **AI Agent**, **Multi-Agent Systems**, **LLM** 등을 실제로 활용하여:
- 이론적 지식을 실무에 적용
- 최신 AI 기술 스택 경험
- 포트폴리오 자체가 연구 역량의 증명

---

## 핵심 기능

### 1. AI 챗봇 (RAG 기반)
- **PDF 문서 기반 답변**: 관리자가 업로드한 이력서, 자기소개서, 연구 문서를 기반으로 답변
- **실시간 스트리밍**: OpenAI API를 통한 실시간 응답 스트리밍
- **출처 표시**: 답변에 사용된 문서명 표시
- **대화 히스토리 관리**: 세션 내 대화 컨텍스트 유지

### 2. NotebookLM 스타일 논문 분석
- **자동 요약**: 논문 PDF를 업로드하면 AI가 자동으로 요약 생성
- **심층 질의응답**: 논문 내용에 대한 상세 질문 가능
- **MCP 연동**: Dify MCP 서버를 통한 전문적인 논문 분석

### 3. 응원 & 질문 포스트잇
- **실시간 상호작용**: 방문자가 응원 메시지나 질문을 포스트잇으로 작성
- **드래그 앤 드롭**: 포스트잇을 자유롭게 이동 가능
- **타입별 필터링**: 응원창/질문창 분리 표시
- **보안 삭제**: 패스워드 기반 삭제 기능

### 4. 관리자 대시보드
- **프로필 관리**: 학력, 경력, 기술 스택 등 프로필 정보 관리
- **문서 관리**: PDF 문서 업로드 및 자동 임베딩 생성
- **논문 관리**: 논문 정보 및 PDF 관리
- **프로젝트 관리**: 프로젝트 포트폴리오 관리
- **Google OAuth 인증**: 안전한 관리자 인증

### 5. 반응형 디자인
- **모바일 최적화**: 모든 디바이스에서 최적화된 UI/UX
- **현대적 디자인**: Tailwind CSS를 활용한 깔끔한 디자인
- **애니메이션**: Framer Motion을 활용한 부드러운 전환 효과

---

## 기술 아키텍처

### 전체 구조
```
┌─────────────────────────────────────────┐
│         Frontend (Next.js 16)          │
│  - React Server Components              │
│  - App Router                           │
│  - TypeScript                           │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                 │
┌──────▼──────┐  ┌──────▼──────────┐
│  API Routes │  │  Backend (FastAPI)│
│  (Next.js)  │  │  - PDF Processing │
└──────┬──────┘  └──────┬───────────┘
       │                 │
       └───────┬─────────┘
               │
    ┌──────────▼──────────────┐
    │   External Services     │
    │  - OpenAI API           │
    │  - Dify API (MCP)       │
    │  - Google AI            │
    │  - Supabase (DB+Storage)│
    └─────────────────────────┘
```

### 프론트엔드 아키텍처
- **Next.js App Router**: 서버 컴포넌트와 클라이언트 컴포넌트 분리
- **React Server Components**: 서버 사이드 렌더링으로 초기 로딩 최적화
- **Streaming SSR**: 실시간 스트리밍 응답 처리
- **TypeScript**: 타입 안전성 보장

### 백엔드 아키텍처
- **FastAPI**: 비동기 처리 및 PDF 파싱
- **Python 가상환경**: 의존성 격리
- **RESTful API**: 표준 HTTP 프로토콜 사용

---

## 주요 기술 스택

### Frontend
- **Next.js 16.0.10**: React 프레임워크, App Router 사용
- **React 19.2.0**: 최신 React 기능 활용
- **TypeScript 5**: 타입 안전성
- **Tailwind CSS 4**: 유틸리티 기반 CSS
- **Framer Motion**: 애니메이션 라이브러리

### Backend
- **FastAPI 0.109.0**: 고성능 Python 웹 프레임워크
- **Uvicorn**: ASGI 서버
- **pdfplumber**: PDF 텍스트 추출
- **OpenAI Python SDK**: GPT 모델 호출

### Database & Storage
- **Supabase**: 
  - PostgreSQL 데이터베이스
  - Vector Extension (pgvector) - 임베딩 저장
  - Storage - 파일 저장
  - Authentication - Google OAuth

### AI Services
- **OpenAI GPT-4o-mini**: 챗봇 및 텍스트 생성
- **OpenAI text-embedding-3-small**: 벡터 임베딩 생성
- **Dify API**: MCP를 통한 전문 AI 서비스
- **Google Generative AI**: 대안 AI 모델

### Development Tools
- **ESLint**: 코드 품질 관리
- **TypeScript**: 정적 타입 검사
- **Git**: 버전 관리

---

## MCP (Model Context Protocol) 활용

### MCP란?
**Model Context Protocol (MCP)**은 AI 모델과 외부 시스템 간의 표준화된 통신 프로토콜입니다. 본 프로젝트에서는 Dify AI 플랫폼의 MCP 서버를 활용하여 전문적인 AI 서비스를 제공합니다.

### MCP 구현 상세

#### 1. 홈 챗봇 MCP 연동 (`/app/api/mcp/home/route.ts`)

```typescript
/**
 * Dify MCP 서버를 통한 홈 챗봇 API
 * Home 페이지용 MCP 연동
 */
```

**주요 기능:**
- Dify API를 통한 스트리밍 챗봇 응답
- 대화 컨텍스트 관리 (`conversation_id`)
- 실시간 스트리밍 처리 (Server-Sent Events)

**작동 방식:**
1. 클라이언트에서 질문 전송
2. Next.js API Route에서 Dify API 호출
3. 스트리밍 응답을 실시간으로 클라이언트에 전달
4. 대화 히스토리 유지를 위한 `conversation_id` 관리

#### 2. 논문 분석 MCP 연동 (`/app/api/mcp/paper/route.ts`)

```typescript
/**
 * Dify MCP 서버를 통한 논문 챗봇 API
 * MCP 서버: https://api.dify.ai/mcp/server/1WZgbNnJCoYNZbev/mcp
 */
```

**특징:**
- 논문 전용 AI 분석 서비스
- NotebookLM 스타일의 심층 질의응답
- 논문 내용에 특화된 프롬프트 엔지니어링

### MCP의 장점

1. **표준화된 인터페이스**: 다양한 AI 서비스와 일관된 방식으로 통신
2. **확장성**: 새로운 AI 서비스를 쉽게 통합 가능
3. **컨텍스트 관리**: 대화 히스토리 및 상태 관리 용이
4. **전문성**: Dify의 특화된 AI 모델 활용

### MCP 활용 시나리오

#### 시나리오 1: 홈 페이지 챗봇
```
사용자 질문 → Next.js API Route → Dify MCP API → 
스트리밍 응답 → 클라이언트 실시간 표시
```

#### 시나리오 2: 논문 분석
```
논문 선택 → 논문 ID 전송 → Dify MCP (논문 전용) → 
전문적인 분석 및 질의응답
```

---

## RAG (Retrieval-Augmented Generation) 구현

### RAG 아키텍처

```
PDF 업로드
    ↓
텍스트 추출 (pdfplumber)
    ↓
텍스트 청킹 (chunking)
    ↓
임베딩 생성 (OpenAI text-embedding-3-small)
    ↓
Supabase Vector Store 저장
    ↓
사용자 질문
    ↓
질문 임베딩 생성
    ↓
벡터 유사도 검색 (pgvector)
    ↓
관련 문서 청크 추출
    ↓
GPT 프롬프트에 컨텍스트 포함
    ↓
최종 답변 생성
```

### 구현 상세

#### 1. PDF 처리 (`/backend/main.py`)

```python
def extract_text_from_pdf(file: UploadFile) -> str:
    """PDF에서 텍스트 추출"""
    with pdfplumber.open(file.file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text
```

#### 2. 텍스트 청킹

```python
def chunk_text(text: str, chunk_size: int = 1000) -> List[str]:
    """텍스트를 청크로 분할"""
    # 의미 있는 단위로 분할 (문단, 문장 기준)
    chunks = []
    # ... 청킹 로직
    return chunks
```

#### 3. 임베딩 생성

```python
def create_embeddings(texts: List[str]) -> List[List[float]]:
    """OpenAI API를 사용하여 임베딩 생성"""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]
```

#### 4. 벡터 검색 (`/lib/rag/search.ts`)

```typescript
export async function searchSimilarContent(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  // 질문을 임베딩으로 변환
  const embedding = await createEmbedding(query);
  
  // Supabase Vector Store에서 유사도 검색
  const { data } = await supabase.rpc('match_embeddings', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit
  });
  
  return data || [];
}
```

### RAG의 장점

1. **정확성**: 문서 기반 답변으로 환각(hallucination) 감소
2. **출처 추적**: 답변에 사용된 문서명 표시 가능
3. **동적 업데이트**: 새 문서 추가 시 자동으로 학습
4. **도메인 특화**: 특정 도메인 문서에 특화된 답변

---

## 시스템 아키텍처

### 데이터 흐름

#### 1. 문서 업로드 플로우
```
관리자 → PDF 업로드 → FastAPI 백엔드
    ↓
PDF 텍스트 추출 → 청킹 → 임베딩 생성
    ↓
Supabase Vector Store 저장
    ↓
메타데이터 저장 (문서명, 설명 등)
```

#### 2. 챗봇 질의응답 플로우
```
사용자 질문 → Next.js API Route
    ↓
질문 임베딩 생성
    ↓
벡터 유사도 검색 (Supabase)
    ↓
관련 문서 청크 추출
    ↓
GPT 프롬프트 구성 (질문 + 컨텍스트)
    ↓
OpenAI API 호출 → 스트리밍 응답
    ↓
클라이언트 실시간 표시
```

#### 3. 논문 분석 플로우
```
논문 PDF 업로드 → FastAPI 처리
    ↓
텍스트 추출 및 임베딩 생성
    ↓
Supabase 저장
    ↓
사용자 질문 → Dify MCP API
    ↓
논문 전용 AI 분석 → 응답
```

### API 구조

#### RESTful API 엔드포인트

**백엔드 (FastAPI)**
- `POST /api/process-document`: PDF 문서 처리 및 임베딩 생성
- `GET /api/health`: 헬스 체크

**프론트엔드 (Next.js API Routes)**
- `POST /api/chat`: RAG 기반 챗봇
- `POST /api/mcp/home`: 홈 챗봇 (Dify MCP)
- `POST /api/mcp/paper`: 논문 분석 (Dify MCP)
- `POST /api/paper-summary`: 논문 요약
- `POST /api/paper-chat`: 논문 질의응답

---

## 데이터베이스 설계

### 주요 테이블

#### 1. `profiles`
연구자 프로필 정보 저장
- JSONB 필드를 활용한 유연한 구조
- 학력, 경력, 기술 스택 등을 JSON으로 저장

#### 2. `documents`
업로드된 PDF 문서 메타데이터
- 파일 경로, 설명, 업로드 날짜 등

#### 3. `embeddings`
벡터 임베딩 저장 (pgvector)
- `content`: 원본 텍스트 청크
- `embedding`: 벡터 임베딩 (1536차원)
- `metadata`: 소스 정보 (문서 ID, 타입 등)

#### 4. `papers`
논문 정보
- 제목, 저자, 연도, 초록 등
- PDF 파일 경로

#### 5. `projects`
프로젝트 포트폴리오
- 프로젝트명, 설명, 기술 스택 등
- 이미지 URL 배열

#### 6. `postits`
응원 & 질문 포스트잇
- 타입 (cheer/question)
- 내용, 위치 (x, y 좌표)
- 색상 정보

### 벡터 검색 함수

```sql
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  source_type_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
```

**작동 원리:**
- 코사인 유사도 계산
- 임계값 이상의 결과만 반환
- 소스 타입별 필터링 지원

---

## 배포 및 인프라

### 배포 구조

#### 프론트엔드 (Vercel)
- **플랫폼**: Vercel
- **빌드**: Next.js Standalone 빌드
- **환경 변수**: Vercel 대시보드에서 관리
- **자동 배포**: GitHub 푸시 시 자동 배포

#### 백엔드 (Railway/Render)
- **플랫폼**: Railway 또는 Render
- **런타임**: Python 3.12
- **서버**: Uvicorn ASGI 서버
- **환경 변수**: 플랫폼 대시보드에서 관리

#### 데이터베이스 (Supabase)
- **PostgreSQL**: 벡터 확장 포함
- **Storage**: 파일 저장소
- **Authentication**: Google OAuth

### 환경 변수 관리

**프론트엔드 (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DIFY_API_KEY=
DIFY_API_KEY_HOME=
GOOGLE_GENERATIVE_AI_API_KEY=
```

**백엔드 (.env)**
```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

### 보안 고려사항

1. **환경 변수 분리**: 공개 키와 비공개 키 분리
2. **RLS (Row Level Security)**: Supabase RLS 정책으로 데이터 접근 제어
3. **CORS 설정**: 허용된 도메인만 API 접근 가능
4. **인증**: Google OAuth를 통한 관리자 인증

---

## 기술적 하이라이트

### 1. 실시간 스트리밍
- **Server-Sent Events (SSE)**: 실시간 응답 스트리밍
- **ReadableStream API**: 효율적인 스트림 처리
- **점진적 렌더링**: 응답이 생성되는 대로 표시

### 2. 벡터 검색 최적화
- **pgvector**: PostgreSQL 벡터 확장 활용
- **인덱싱**: HNSW 인덱스로 빠른 유사도 검색
- **임계값 필터링**: 관련성 낮은 결과 제외

### 3. 타입 안전성
- **TypeScript**: 전체 프론트엔드 타입 안전성
- **Pydantic**: 백엔드 데이터 검증
- **타입 추론**: 자동 타입 추론으로 개발 생산성 향상

### 4. 성능 최적화
- **React Server Components**: 서버 사이드 렌더링
- **이미지 최적화**: Next.js Image 컴포넌트
- **코드 스플리팅**: 자동 코드 분할
- **캐싱**: 적절한 캐싱 전략

---

## 향후 개선 방향

### 단기 개선
1. **다국어 지원**: 영어/한국어 전환 기능
2. **검색 기능 강화**: 전체 텍스트 검색 추가
3. **애널리틱스**: 방문자 통계 및 분석

### 장기 개선
1. **멀티모달 AI**: 이미지 분석 기능 추가
2. **음성 인터페이스**: 음성 질의응답 지원
3. **개인화**: 사용자별 맞춤 추천
4. **실시간 협업**: 여러 사용자 동시 상호작용

---

## 결론

본 프로젝트는 최신 AI 기술을 활용하여 전통적인 포트폴리오의 한계를 극복하고, 대화형 인터페이스를 제공하는 혁신적인 플랫폼입니다. 

**주요 성과:**
- ✅ RAG 기술을 활용한 정확한 정보 검색
- ✅ MCP 프로토콜을 통한 전문 AI 서비스 통합
- ✅ 실시간 스트리밍을 통한 자연스러운 대화 경험
- ✅ 관리자 친화적인 컨텐츠 관리 시스템
- ✅ 확장 가능한 아키텍처 설계

이 프로젝트는 연구자의 AI 역량을 보여주는 동시에, 실제로 활용 가능한 포트폴리오 플랫폼으로서의 가치를 제공합니다.

---

**작성일**: 2025년 12월  
**작성자**: 천지영 (Jiyeong Cheon)  
**버전**: 1.0

