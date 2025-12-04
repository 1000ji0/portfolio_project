# 포트폴리오 (Portfolio) - Product Requirements Document (PRD)

## 1. 프로젝트 개요

### 1.1 프로젝트 명
**포트폴리오 (Portfolio)** - AI 기반 개인 연구 포트폴리오 웹사이트

### 1.2 프로젝트 목적
천지영 연구자의 학력, 경력, 연구 업적을 효과적으로 소개하고, 방문자가 AI 챗봇과 대화하며 정보를 탐색할 수 있는 인터랙티브 포트폴리오 제공

### 1.3 핵심 가치
- **PDF 기반 AI 챗봇**: 관리자가 업로드한 문서를 기반으로 답변
- **NotebookLM 스타일 논문 분석**: 논문을 AI가 요약하고 질의응답
- **완전한 관리자 제어**: 모든 컨텐츠를 관리자가 직접 추가/수정
- **로그인 불필요 열람**: 일반 사용자는 로그인 없이 모든 내용 확인 가능

---

## 2. 사용자 정보

### 2.1 기본 정보
- **이름**: 천지영 (Jiyeong Kim)
- **학위 과정**: 석사과정 (Master's Candidate)
- **소속**:
  - 한글: 명지대학교 기록정보과학전문대학원 AI정보과학전공
  - 영문: Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University

### 2.2 연구 관심 분야
- 멀티모달 분석 (Multimodal Analysis)
- 대규모 언어 모델 (LLM)
- 감성 분석 (Sentiment Analysis)
- 자연어 처리 (NLP)
- AI 에이전트 (AI Agent)
- 데이터 분석 (Data Analysis)
- 멀티 에이전트 시스템 (Multi-Agent Systems)
- 음악치료 AI 응용 (AI Application in Music Therapy)

---

## 3. 핵심 기능 명세

### 3.1 전체 메뉴 구조

**공개 메뉴** (로그인 불필요)
1. **Home** - AI 챗봇 (PDF 문서 기반 답변)
2. **Profile** - 프로필 전체 보기
3. **Publications** - 논문 목록 + NotebookLM 스타일 AI
4. **Projects** - 프로젝트 포트폴리오
5. **Contact** - 연락처 정보

**관리자 전용 메뉴** (로그인 시에만 표시)
- **Admin** - 관리자 대시보드

**중요 원칙**
- 일반 사용자: 로그인 없이 모든 공개 페이지 열람 가능
- 관리자: 로그인하여 컨텐츠 추가/수정/삭제
- 초기 상태: 모든 컨텐츠는 비어있음 (관리자가 채워야 함)

---

### 3.2 Home 페이지 (AI 챗봇)

#### 3.2.1 상단 프로필 섹션
- 프로필 이미지 (필수)
- 이름: "김지영 (Jiyeong Kim)"
- 현재 소속:
  - 한글: "명지대학교 기록정보과학전문대학원 AI정보과학전공"
  - 영문: "Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University"
- 학위 과정: "석사과정 (Master's Candidate)"
- 한 줄 소개: "멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다"

#### 3.2.2 중앙 AI 챗봇 인터페이스
**입력 영역**
- 프롬프트 입력창
  - 플레이스홀더: "지영님에 대해 궁금한 점을 물어보세요"
- 예시 질문 버튼 (클릭 시 자동 입력)
  - "주요 연구 분야가 무엇인가요?"
  - "학력과 경력을 알려주세요"
  - "어떤 논문을 작성했나요?"
  - "관심 있는 연구 주제는 무엇인가요?"

**대화 인터페이스**
- 실시간 스트리밍 답변
- 마크다운 렌더링 지원
- 출처 표시 (문서명 표시)
- 대화 히스토리 유지 (세션 내)
- "새 대화" 버튼

#### 3.2.3 데이터 소스 (RAG)
**관리자가 업로드한 PDF 문서 기반**
- 자기소개서
- 이력서 (CV)
- 연구 소개 문서
- 기타 소개 자료

**작동 방식**
1. 관리자가 `/admin/documents`에서 PDF 업로드
2. 시스템이 자동으로 텍스트 추출 및 임베딩 생성
3. 사용자 질문 시 관련 내용을 검색하여 답변

---

### 3.3 Profile 페이지 (프로필 전체 보기)

#### 3.3.1 표시 내용
**기본 정보**
- 프로필 이미지
- 이름 (한글/영문)
- 현재 소속 (한글/영문)
- 학위 과정
- 한 줄 소개

**학력 (Education)**
- 관리자가 추가한 학력 정보
- 형식: 학교명, 전공, 학위, 기간, 기타

**경력 (Experience)**
- 관리자가 추가한 경력 정보
- 형식: 기관명, 역할, 기간, 주요 업무

**기술 스택 (Skills)**
- 관리자가 추가한 기술/도구
- 카테고리별 분류 가능

**연구 관심 분야 (Research Interests)**
- 멀티모달 분석
- LLM
- 감성 분석
- NLP
- AI Agent
- 데이터 분석
- Multi-Agent Systems
- 음악치료 AI 응용
- 기타 관리자가 추가한 분야

**수상 경력 (Awards)**
- 관리자가 추가한 수상 내역
- 형식: 수상명, 기관, 날짜

**기타 정보**
- 관심사, 취미 등

#### 3.3.2 중요 사항
- 초기 상태: 프로필 정보는 비어있음
- 관리자가 `/admin/profile`에서 직접 작성
- 동적 섹션 추가/삭제 가능

---

### 3.4 Publications 페이지 (논문 + NotebookLM 스타일 AI)

#### 3.4.1 논문 목록 화면
**카드 형태 레이아웃**
- 각 카드 포함 정보:
  - 논문 제목
  - 저자 (본인 이름 하이라이트)
  - 학회/저널명
  - 발표 연도
  - 초록 미리보기 (2-3줄)
  - 태그/키워드
  - PDF 다운로드 버튼
  - **"AI로 요약/정리하기"** 버튼

**필터링 및 정렬**
- 연도별 필터
- 태그별 필터
- 최신순/오래된순 정렬

**초기 상태**
- 논문 목록은 비어있음
- 관리자가 `/admin/publications`에서 논문 PDF 업로드

#### 3.4.2 NotebookLM 스타일 논문 AI 분석

**진입 방식**
- "AI로 요약/정리하기" 버튼 클릭
- 전용 페이지 또는 모달로 이동

**자동 요약 (구조화)**
페이지 로드 시 또는 버튼 클릭 시 자동 생성:
1. **핵심 기여 (Key Contribution)**
   - 이 논문의 주요 혁신점
   - 100-150 단어
   
2. **연구 방법론 (Methodology)**
   - 어떤 방법을 사용했는가
   - 100-150 단어
   
3. **주요 결과 (Results)**
   - 어떤 결과를 얻었는가
   - 100-150 단어
   
4. **한계점 및 향후 연구 (Limitations & Future Work)**
   - 개선점과 향후 방향
   - 100-150 단어
   
5. **실용적 함의 (Practical Implications)**
   - 실제 적용 가능성
   - 100-150 단어

**인터랙티브 질의응답**
- 논문 PDF 내용 기반 자유로운 대화
- 예시 질문 제공:
  - "이 논문의 핵심 아이디어를 쉽게 설명해주세요"
  - "연구 방법론의 장단점은?"
  - "실험 결과를 상세히 설명해주세요"
  - "실용적 응용 사례는?"
  - "관련 연구와의 차이점은?"
- 스트리밍 응답
- 참조 페이지 번호 표시 (가능한 경우)

**UI 레이아웃 (선택 사항)**
- 좌측: 요약 및 챗봇
- 우측: PDF 뷰어 (임베드)

#### 3.4.3 기술적 요구사항
- 각 논문 PDF를 청크 단위로 임베딩
- 논문별 독립적인 컨텍스트 유지 (source_type: 'paper', source_id: paper_id)
- PDF에서 텍스트, 표, 그래프 정보 추출
- 논문 내용 기반 Context-aware 답변

---

### 3.5 Projects 페이지 (프로젝트 포트폴리오)

#### 3.5.1 프로젝트 카드
**각 카드 포함 정보**
- 프로젝트명
- 한 줄 설명
- 사용 기술 스택 (태그 형태)
- GitHub 링크
- 데모 링크 (있는 경우)
- 썸네일 이미지 또는 스크린샷

**프로젝트 상세 페이지 (선택)**
- 클릭 시 상세 페이지로 이동
- 포함 내용:
  - 프로젝트 배경 및 동기
  - 주요 기능
  - 기술적 도전과 해결 방법
  - 결과 및 배운 점
  - 이미지/스크린샷

#### 3.5.2 초기 상태
- 프로젝트 목록은 비어있음
- 관리자가 `/admin/projects`에서 직접 추가

---

### 3.6 Contact 페이지 (연락처 정보)

#### 3.6.1 표시 내용
- 이메일 주소
- GitHub 프로필 링크
- LinkedIn 프로필 링크
- Google Scholar 링크 (선택)
- 기타 소셜 미디어

#### 3.6.2 연락 폼 (선택 사항)
- 이름, 이메일, 메시지 입력 필드
- 전송 버튼
- 이메일 전송 기능 (Resend, SendGrid 등 활용)

#### 3.6.3 관리자 기능
- `/admin/contact`에서 연락처 정보 수정

---

### 3.7 관리자 시스템 (Admin)

#### 3.7.1 인증 (Authentication)
**로그인 방식**
- Google OAuth

**보안**
- `/admin` 경로 보호
- 관리자 이메일 화이트리스트 (환경변수)
- 세션 관리 (Supabase Auth)

**중요**
- 일반 사용자는 로그인 불필요
- 오직 관리자만 로그인하여 컨텐츠 관리

#### 3.7.2 관리자 대시보드 (`/admin`)
**메인 화면**
- 통계 위젯:
  - 총 업로드된 문서 수
  - 총 논문 수
  - 총 프로젝트 수
- 빠른 액션:
  - PDF 문서 업로드
  - 새 논문 추가
  - 새 프로젝트 추가

**사이드 메뉴**
1. Dashboard (대시보드)
2. Documents (PDF 문서 관리)
3. Profile (프로필 관리)
4. Publications (논문 관리)
5. Projects (프로젝트 관리)
6. Contact (연락처 관리)

#### 3.7.3 PDF 문서 관리 (`/admin/documents`)
**목적**: 홈 페이지 AI 챗봇이 참조할 문서 관리

**문서 목록 화면**
- 테이블 형태
  - 파일명, 설명, 업로드일, 파일 크기
- 액션: 다운로드, 삭제
- "새 문서 업로드" 버튼

**문서 업로드**
- PDF 파일 업로드 (드래그 앤 드롭)
- 문서 설명 입력 (선택)
- 자동 처리:
  1. PDF 텍스트 추출
  2. 청킹 (1000자 단위, 200자 겹침)
  3. 임베딩 생성
  4. Vector Store에 저장 (source_type: 'document')

#### 3.7.4 프로필 관리 (`/admin/profile`)
**편집 가능 필드**
- **기본 정보**
  - 이름 (한글/영문)
  - 프로필 이미지 업로드
  - 현재 소속 (한글/영문)
  - 학위 과정
  - 한 줄 소개

- **학력** (동적 추가/수정/삭제)
  - 학교명
  - 전공
  - 학위
  - 기간
  - 기타 정보 (마크다운)

- **경력** (동적 추가/수정/삭제)
  - 기관명
  - 역할
  - 기간
  - 주요 업무 (마크다운)

- **기술 스택** (동적 추가/수정/삭제)
  - 카테고리 (예: AI/ML, 프로그래밍, 도구)
  - 기술/도구 목록

- **수상 경력** (동적 추가/수정/삭제)
  - 수상명
  - 발급 기관
  - 날짜

- **연구 관심 분야** (동적 추가/수정/삭제)
  - 분야명 (한글/영문)

- **기타 정보**
  - 자유 형식 (마크다운)

**저장 방식**
- Supabase `profiles` 테이블
- JSONB 필드로 유연한 구조

**중요**
- 모든 필드는 초기에 비어있음
- 관리자가 직접 입력

#### 3.7.5 논문 관리 (`/admin/publications`)
**논문 목록 화면**
- 테이블 형태
  - 제목, 저자, 연도, 업로드일
- 액션: 수정, 삭제, AI 요약 미리보기
- "새 논문 추가" 버튼

**논문 추가/수정 화면**
- 입력 필드:
  - 제목 (필수)
  - 저자 (필수)
  - 학회/저널명
  - 발표 연도
  - 초록 (텍스트에어리어)
  - 태그/키워드 (다중 입력)
  - **PDF 파일 업로드** (필수)
- 버튼: 저장, 취소

**PDF 업로드 시 자동 처리**
1. Supabase Storage에 파일 저장
2. PDF 텍스트 추출
3. 청킹
4. 임베딩 생성
5. Vector Store에 저장 (source_type: 'paper', source_id: paper_id)

#### 3.7.6 프로젝트 관리 (`/admin/projects`)
**프로젝트 목록 화면**
- 카드 또는 테이블 형태
- 액션: 수정, 삭제
- "새 프로젝트 추가" 버튼

**프로젝트 추가/수정 화면**
- 입력 필드:
  - 프로젝트명 (필수)
  - 한 줄 설명 (필수)
  - 기술 스택 (다중 입력)
  - GitHub URL
  - 데모 URL
  - 이미지 업로드 (다중, 드래그 앤 드롭)
  - 상세 설명 (마크다운 에디터)
- 버튼: 저장, 취소

#### 3.7.7 연락처 관리 (`/admin/contact`)
**편집 가능 필드**
- 이메일
- GitHub URL
- LinkedIn URL
- Google Scholar URL
- 기타 링크 (동적 추가/삭제)

---

## 4. UI/UX 요구사항

### 4.1 디자인 원칙
- 깔끔하고 전문적인 느낌
- 읽기 편한 타이포그래피
- 적절한 여백과 간격
- **라이트 모드 전용** (다크 모드 없음)

### 4.2 반응형 네비게이션
- 데스크톱: 상단 고정 네비게이션 바
- 모바일: 햄버거 메뉴
- 현재 페이지 하이라이트
- 부드러운 페이지 전환 애니메이션

### 4.3 반응형 브레이크포인트
- 모바일: < 768px
- 태블릿: 768px - 1024px
- 데스크톱: > 1024px

### 4.4 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환

---

## 5. 데이터 요구사항

### 5.1 필요한 데이터
1. **프로필 정보** (관리자 입력)
   - 기본 정보
   - 학력, 경력
   - 기술 스택
   - 수상 경력
   - 연구 관심 분야

2. **PDF 문서** (관리자 업로드)
   - 자기소개서, CV, 연구 소개 등
   - 홈 챗봇 데이터 소스

3. **논문** (관리자 업로드)
   - 논문 메타데이터 + PDF

4. **프로젝트** (관리자 입력)
   - 프로젝트 정보 + 이미지

5. **연락처** (관리자 입력)
   - 이메일, 소셜 링크

### 5.2 데이터베이스 테이블 (Supabase)
```sql
-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  name_en TEXT,
  profile_image_url TEXT,
  affiliation TEXT,
  affiliation_en TEXT,
  degree_program TEXT,
  bio TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  research_interests JSONB DEFAULT '[]'::jsonb,
  other_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- documents (홈 챗봇용 PDF 문서)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- papers (논문)
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  venue TEXT,
  year INTEGER,
  abstract TEXT,
  tags TEXT[],
  pdf_file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- projects (프로젝트)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  github_url TEXT,
  demo_url TEXT,
  image_urls TEXT[],
  detailed_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- contact (연락처)
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  scholar_url TEXT,
  other_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- embeddings (RAG용 벡터)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  source_type TEXT CHECK (source_type IN ('document', 'paper', 'project')),
  source_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- admin_users (관리자)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 Supabase Storage Buckets
- `profile-images`: 프로필 사진
- `documents`: 홈 챗봇용 PDF 문서
- `paper-pdfs`: 논문 PDF 파일
- `project-images`: 프로젝트 스크린샷

---

## 6. 개발 우선순위

### Phase 1 (MVP)
1. ✅ 프로젝트 초기 설정 (Next.js, Supabase)
2. ✅ 데이터베이스 및 인증 (Google OAuth)
3. ✅ 기본 레이아웃 및 네비게이션
4. ✅ 홈 화면 + AI 챗봇 (PDF 기반 RAG)
5. ✅ Profile 페이지 + 관리자 프로필 편집
6. ✅ Publications 페이지 (기본 목록) + 관리자 논문 관리
7. ✅ 관리자 PDF 문서 관리
8. ✅ 배포 (Vercel)

### Phase 2
1. Publications NotebookLM 스타일 AI 요약/질의응답
2. Projects 페이지 + 관리자 프로젝트 관리
3. Contact 페이지 + 관리자 연락처 관리
4. 이미지 업로드 기능 개선

### Phase 3 (선택)
1. 연락 폼 이메일 전송
2. Analytics 연동
3. SEO 최적화
4. 성능 최적화

---

## 7. 성공 지표

### 7.1 사용자 참여도
- 평균 세션 시간: 3분 이상
- AI 챗봇 사용률: 방문자의 40% 이상
- 논문 AI 분석 사용률: 30% 이상

### 7.2 관리자 효율성
- 새 컨텐츠 추가 시간: 5분 이내
- PDF 업로드 및 임베딩 생성: 1분 이내

### 7.3 기술적 지표
- 페이지 로드 시간: 3초 이내
- AI 응답 시작 시간: 3초 이내
- 에러율: 1% 미만

---

## 8. 제약사항

### 8.1 예산
- 무료 tier 서비스만 사용
- Supabase 무료: 500MB DB, 1GB Storage
- Google AI Studio 무료: 일일 1,500 requests
- Vercel 무료: 100GB 대역폭/월

### 8.2 초기 데이터
- 모든 컨텐츠는 비어있는 상태로 시작
- 관리자가 수동으로 입력/업로드
- 샘플 데이터 없음

---

**문서 버전**: 2.0  
**작성일**: 2024-12-03  
**작성자**: Jiyeong Kim  
**최종 수정**: 사용자 요구사항 반영
