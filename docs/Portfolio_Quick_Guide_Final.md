# 포트폴리오 - 개발 실행 가이드 (for Cursor AI)

> **프로젝트**: 김지영 연구자 개인 포트폴리오 웹사이트  
> **핵심**: PDF 기반 RAG 챗봇 + NotebookLM 스타일 논문 AI + 관리자 시스템

---

## 🎯 핵심 요구사항

### 사용자 정보
- 이름: 김지영 (Jiyeong Kim)
- 학위: 석사과정 (Master's Candidate)
- 소속: 명지대학교 기록정보과학전문대학원 AI정보과학전공
- 관심분야: 멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용

### 주요 원칙
1. **로그인 불필요**: 일반 사용자는 로그인 없이 모든 페이지 열람
2. **관리자 전용**: 관리자만 로그인하여 컨텐츠 추가/수정/삭제
3. **초기 상태**: 모든 컨텐츠는 비어있음 (관리자가 채워야 함)
4. **라이트 모드**: 다크 모드 없음

---

## 📋 페이지 구조

### 공개 페이지 (로그인 불필요)
1. **Home**: AI 챗봇 (관리자가 업로드한 PDF 문서 기반 RAG 답변)
2. **Profile**: 프로필 전체 보기 (학력, 경력, 기술 스택 등)
3. **Publications**: 논문 목록 + NotebookLM 스타일 AI 요약/질의응답
4. **Projects**: 프로젝트 포트폴리오
5. **Contact**: 연락처 정보

### 관리자 페이지 (로그인 필수)
- `/admin`: 대시보드
- `/admin/documents`: PDF 문서 관리 (홈 챗봇용)
- `/admin/profile`: 프로필 관리
- `/admin/publications`: 논문 관리
- `/admin/projects`: 프로젝트 관리
- `/admin/contact`: 연락처 관리

---

## 🛠 기술 스택

```
Frontend: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
Database: Supabase PostgreSQL + pgvector (RAG)
Auth: Supabase Auth (Google OAuth)
Storage: Supabase Storage (PDF, 이미지)
AI: Google Gemini API (gemini-1.5-flash)
Embeddings: Google text-embedding-004
Deploy: Vercel (무료)
```

---

## 📁 디렉토리 구조

```
portfolio/
├── app/
│   ├── page.tsx                   # Home (챗봇)
│   ├── profile/page.tsx           # Profile
│   ├── publications/
│   │   ├── page.tsx               # 논문 목록
│   │   └── [id]/page.tsx          # 논문 AI 분석
│   ├── projects/page.tsx          # Projects
│   ├── contact/page.tsx           # Contact
│   ├── admin/                     # 관리자 (보호됨)
│   │   ├── layout.tsx             # 인증 체크
│   │   ├── page.tsx               # 대시보드
│   │   ├── documents/page.tsx     # PDF 문서 관리
│   │   ├── profile/page.tsx       # 프로필 편집
│   │   ├── publications/page.tsx  # 논문 관리
│   │   ├── projects/page.tsx      # 프로젝트 관리
│   │   └── contact/page.tsx       # 연락처 관리
│   ├── api/
│   │   ├── chat/route.ts          # 홈 챗봇 API
│   │   ├── chat-paper/route.ts    # 논문 챗봇 API
│   │   ├── embeddings/            # 임베딩 생성/검색
│   │   └── upload/route.ts        # 파일 업로드
│   └── auth/
│       ├── login/page.tsx
│       └── callback/route.ts
├── components/
│   ├── chat/
│   ├── admin/
│   └── layout/
└── lib/
    ├── supabase/
    ├── ai/
    └── pdf/
```

---

## 🗄 데이터베이스 스키마

```sql
-- profiles: 프로필 정보
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  name_en TEXT,
  profile_image_url TEXT,
  affiliation TEXT,
  affiliation_en TEXT,
  degree_program TEXT,
  bio TEXT,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  awards JSONB DEFAULT '[]',
  research_interests JSONB DEFAULT '[]',
  other_info TEXT
);

-- documents: 홈 챗봇용 PDF
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  file_size INTEGER
);

-- papers: 논문
CREATE TABLE papers (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  venue TEXT,
  year INTEGER,
  abstract TEXT,
  tags TEXT[],
  pdf_file_path TEXT
);

-- projects: 프로젝트
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  github_url TEXT,
  demo_url TEXT,
  image_urls TEXT[],
  detailed_description TEXT
);

-- contact: 연락처
CREATE TABLE contact (
  id UUID PRIMARY KEY,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  scholar_url TEXT,
  other_links JSONB DEFAULT '[]'
);

-- embeddings: RAG 벡터
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  source_type TEXT CHECK (source_type IN ('document', 'paper', 'project')),
  source_id UUID NOT NULL
);

CREATE INDEX embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- admin_users: 관리자
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

-- RLS: 읽기(전체), 쓰기(관리자만)
```

**Supabase Storage**
- `profile-images`
- `documents`
- `paper-pdfs`
- `project-images`

---

## 🔑 핵심 기능 구현

### 1. PDF 기반 RAG 챗봇 (홈)

```typescript
// lib/ai/embeddings.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values; // number[]
}
```

```typescript
// lib/ai/rag.ts
export async function ragQuery(userQuery: string, sourceType: 'document' | 'paper') {
  // 1. 질문 임베딩
  const queryEmbedding = await generateEmbedding(userQuery);
  
  // 2. 벡터 검색
  const { data } = await supabase.rpc('match_embeddings', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5
  }).eq('source_type', sourceType);
  
  // 3. 컨텍스트 구성
  const context = data.map(d => d.content).join('\n\n');
  
  // 4. LLM 질의
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
당신은 김지영의 포트폴리오 AI 어시스턴트입니다.

컨텍스트:
${context}

질문: ${userQuery}

답변 (한국어, 친절하게):
`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message } = await req.json();
  
  const queryEmbedding = await generateEmbedding(message);
  const docs = await searchSimilarContent(queryEmbedding, 'document', 3);
  const context = docs.map(d => d.content).join('\n\n');
  
  // 스트리밍
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat();
  const result = await chat.sendMessageStream(`컨텍스트: ${context}\n\n질문: ${message}`);
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });
  
  return new Response(stream);
}
```

---

### 2. NotebookLM 스타일 논문 AI

```typescript
// app/api/papers/[id]/summary/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const paperId = params.id;
  
  // 논문의 임베딩 검색
  const { data: chunks } = await supabase
    .from('embeddings')
    .select('content')
    .eq('source_type', 'paper')
    .eq('source_id', paperId)
    .limit(10);
  
  const paperContent = chunks.map(c => c.content).join('\n\n');
  
  // 구조화된 요약 생성
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
다음은 연구 논문의 내용입니다. NotebookLM 스타일로 구조화된 요약을 생성해주세요.

논문 내용:
${paperContent}

다음 형식으로 요약해주세요 (각 섹션 100-150 단어):
1. 핵심 기여 (Key Contribution)
2. 연구 방법론 (Methodology)
3. 주요 결과 (Results)
4. 한계점 및 향후 연구 (Limitations & Future Work)
5. 실용적 함의 (Practical Implications)

한국어로 작성해주세요.
`;
  
  const result = await model.generateContent(prompt);
  return Response.json({ summary: result.response.text() });
}
```

```typescript
// app/api/chat-paper/route.ts
export async function POST(req: Request) {
  const { message, paperId } = await req.json();
  
  // 해당 논문의 컨텍스트만 검색
  const queryEmbedding = await generateEmbedding(message);
  const { data } = await supabase.rpc('match_embeddings', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5
  })
  .eq('source_type', 'paper')
  .eq('source_id', paperId);
  
  const context = data.map(d => d.content).join('\n\n');
  
  // 스트리밍 응답
  // ... (위와 동일)
}
```

---

### 3. PDF 업로드 & 자동 임베딩

```typescript
// app/api/upload/document/route.ts
import { parsePDF } from '@/lib/pdf/parser';
import { chunkText } from '@/lib/utils/chunking';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('pdf') as File;
  const description = formData.get('description') as string;
  
  // 1. Supabase Storage 업로드
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData } = await supabase.storage
    .from('documents')
    .upload(fileName, file);
  
  // 2. documents 테이블에 저장
  const { data: doc } = await supabase
    .from('documents')
    .insert({
      file_name: file.name,
      file_path: fileName,
      description,
      file_size: file.size
    })
    .select()
    .single();
  
  // 3. PDF 텍스트 추출
  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfText = await parsePDF(buffer);
  
  // 4. 청킹
  const chunks = chunkText(pdfText, 1000, 200);
  
  // 5. 각 청크 임베딩 생성 및 저장
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    
    await supabase.from('embeddings').insert({
      content: chunk,
      embedding,
      source_type: 'document',
      source_id: doc.id,
      metadata: {}
    });
  }
  
  return Response.json({ success: true, document: doc });
}
```

```typescript
// lib/pdf/parser.ts
import pdf from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}
```

```typescript
// lib/utils/chunking.ts
export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  
  return chunks;
}
```

---

### 4. 인증 시스템

```typescript
// app/auth/login/page.tsx
'use client';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button 
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Google로 로그인
      </button>
    </div>
  );
}
```

```typescript
// lib/supabase/middleware.ts
export async function checkAdminAccess(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .single();
  
  return !!data;
}
```

```typescript
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/lib/supabase/middleware';

export default async function AdminLayout({ children }) {
  const isAdmin = await checkAdminAccess();
  if (!isAdmin) redirect('/auth/login');
  
  return (
    <div className="admin-layout">
      <aside>관리자 메뉴</aside>
      <main>{children}</main>
    </div>
  );
}
```

---

### 5. 프로필 관리 (동적 필드)

```typescript
// app/admin/profile/page.tsx
'use client';
import { useState } from 'react';

export default function ProfileEditor() {
  const [education, setEducation] = useState([]);
  
  const addEducation = () => {
    setEducation([...education, {
      school: '',
      major: '',
      degree: '',
      period: '',
      etc: ''
    }]);
  };
  
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };
  
  const handleSave = async () => {
    await fetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: '...',
        education,
        // ...
      })
    });
  };
  
  return (
    <div>
      <h1>프로필 편집</h1>
      
      {/* 학력 */}
      <section>
        <h2>학력</h2>
        {education.map((edu, i) => (
          <div key={i}>
            <input value={edu.school} onChange={...} placeholder="학교명" />
            <input value={edu.major} onChange={...} placeholder="전공" />
            <button onClick={() => removeEducation(i)}>삭제</button>
          </div>
        ))}
        <button onClick={addEducation}>+ 학력 추가</button>
      </section>
      
      {/* 경력, 기술 스택, 수상 등 동일하게 */}
      
      <button onClick={handleSave}>저장</button>
    </div>
  );
}
```

---

## 🌍 환경 변수

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_AI_API_KEY=
ADMIN_EMAILS=your_email@gmail.com
```

---

## ✅ 개발 체크리스트

### 기본 설정
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] Supabase 프로젝트 생성
- [ ] 환경변수 설정

### 데이터베이스
- [ ] 테이블 생성 (SQL 실행)
- [ ] pgvector extension 활성화
- [ ] RLS 정책 설정
- [ ] Storage buckets 생성

### 인증
- [ ] Google OAuth 설정
- [ ] 관리자 이메일 등록 (admin_users 테이블)
- [ ] 인증 미들웨어 구현

### AI 시스템
- [ ] Google AI Studio API 키 발급
- [ ] 임베딩 함수 구현
- [ ] 벡터 검색 함수 구현
- [ ] RAG 파이프라인 구현
- [ ] 스트리밍 API 구현

### 페이지
- [ ] Home (챗봇)
- [ ] Profile (공개)
- [ ] Publications (목록)
- [ ] Publications (AI 분석)
- [ ] Projects
- [ ] Contact
- [ ] 관리자 대시보드
- [ ] 관리자 PDF 문서 관리
- [ ] 관리자 프로필 관리
- [ ] 관리자 논문 관리
- [ ] 관리자 프로젝트 관리

### 배포
- [ ] Vercel 배포
- [ ] 환경변수 설정

---

## 📦 필수 패키지

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install @google/generative-ai
npm install pdf-parse
npm install react-markdown remark-gfm rehype-highlight
npm install zod
npm install clsx tailwind-merge
npm install lucide-react
```

---

## 🎨 UI 가이드

- **라이트 모드 전용**
- 깔끔하고 전문적인 디자인
- 반응형 네비게이션 바
- 모바일 대응
- Tailwind CSS 활용

---

## 🚀 빠른 시작

```bash
# 1. 프로젝트 생성
npx create-next-app@latest portfolio --typescript --tailwind --app

# 2. 패키지 설치
cd portfolio
npm install <패키지들>

# 3. Supabase 설정
# - 프로젝트 생성
# - SQL 실행
# - Storage 생성

# 4. 환경변수 설정
# .env.local 파일 생성

# 5. 개발 서버
npm run dev

# 6. 배포
vercel
```

---

## ⚠️ 중요 사항

1. **초기 데이터 없음**: 모든 컨텐츠는 관리자가 직접 입력
2. **PDF 필수**: 홈 챗봇과 논문 AI는 PDF 업로드 필수
3. **라이트 모드만**: 다크 모드 구현 안 함
4. **무료 tier**: 비용 최소화

---

**시작하세요!** 🚀
