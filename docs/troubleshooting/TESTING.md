# 로컬 테스트 가이드

배포 전에 로컬에서 모든 기능을 테스트하는 가이드입니다.

## 사전 준비 체크리스트

### 1. 환경 변수 확인

`.env.local` 파일이 존재하고 다음 변수들이 설정되어 있는지 확인:

```bash
# 필수 환경 변수
GOOGLE_API_KEY=AIzaSyAEWx7Yh8yYkLXI2BOWDLR6bS8WGWFCBGQ
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_admin_email@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase 설정 확인

- [ ] Supabase 프로젝트 생성 완료
- [ ] `database/supabase/schema.sql` 실행 완료
- [ ] `database/supabase/functions.sql` 실행 완료
- [ ] Storage 버킷 생성 완료:
  - `profile-images`
  - `documents`
  - `paper-pdfs`
  - `project-images`

### 3. 의존성 설치 확인

```bash
npm install
```

## 테스트 단계

### Step 1: 빌드 테스트

빌드가 성공하는지 확인:

```bash
npm run build
```

**예상 결과**: 빌드 성공, 에러 없음

**문제 발생 시**:
- TypeScript 에러 확인
- 환경 변수 누락 확인
- 의존성 설치 확인

### Step 2: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### Step 3: 기본 페이지 테스트

#### 3.1 홈페이지 (`/`)
- [ ] 페이지 로드 확인
- [ ] 프로필 섹션 표시 확인
- [ ] AI 챗봇 UI 표시 확인
- [ ] 네비게이션 바 동작 확인

#### 3.2 프로필 페이지 (`/profile`)
- [ ] 페이지 로드 확인
- [ ] 빈 상태 메시지 표시 확인 (초기에는 데이터 없음)

#### 3.3 논문 페이지 (`/publications`)
- [ ] 페이지 로드 확인
- [ ] 빈 상태 메시지 표시 확인

#### 3.4 프로젝트 페이지 (`/projects`)
- [ ] 페이지 로드 확인
- [ ] 빈 상태 메시지 표시 확인

#### 3.5 연락처 페이지 (`/contact`)
- [ ] 페이지 로드 확인
- [ ] 빈 상태 메시지 표시 확인

### Step 4: 관리자 시스템 테스트

#### 4.1 관리자 로그인
1. `/api/auth/signin` 접속 또는 네비게이션에서 "관리자 로그인" 클릭
2. Google OAuth 로그인
3. 로그인 성공 후 `/admin`으로 리다이렉트 확인

**주의**: `ADMIN_EMAIL`과 일치하는 Google 계정으로 로그인해야 함

#### 4.2 관리자 대시보드 (`/admin`)
- [ ] 대시보드 로드 확인
- [ ] 통계 위젯 표시 확인
- [ ] 사이드 메뉴 동작 확인

#### 4.3 문서 관리 (`/admin/documents`)
- [ ] 페이지 로드 확인
- [ ] PDF 업로드 테스트
- [ ] 업로드 후 목록에 표시 확인
- [ ] 문서 삭제 테스트

**테스트 파일**: 간단한 PDF 파일 준비

#### 4.4 프로필 관리 (`/admin/profile`)
- [ ] 페이지 로드 확인
- [ ] 기본 정보 입력 및 저장 테스트
- [ ] 학력 추가/삭제 테스트
- [ ] 저장 후 `/profile` 페이지에서 확인

#### 4.5 논문 관리 (`/admin/publications`)
- [ ] 페이지 로드 확인
- [ ] 논문 추가 (PDF 포함) 테스트
- [ ] 논문 수정 테스트
- [ ] 논문 삭제 테스트
- [ ] 논문 상세 페이지 (`/publications/[id]`) 접속 및 AI 요약 확인

#### 4.6 프로젝트 관리 (`/admin/projects`)
- [ ] 페이지 로드 확인
- [ ] 프로젝트 추가 테스트
- [ ] 이미지 업로드 테스트
- [ ] 프로젝트 수정/삭제 테스트

#### 4.7 연락처 관리 (`/admin/contact`)
- [ ] 페이지 로드 확인
- [ ] 연락처 정보 입력 및 저장 테스트
- [ ] `/contact` 페이지에서 확인

### Step 5: AI 기능 테스트

#### 5.1 홈 챗봇 테스트
1. `/admin/documents`에서 PDF 업로드 (자기소개서, CV 등)
2. 홈페이지로 이동
3. 챗봇에 질문 입력
4. 응답 확인:
   - [ ] 스트리밍 응답 작동 확인
   - [ ] 답변 내용이 업로드한 문서 기반인지 확인
   - [ ] 출처 표시 확인

**테스트 질문 예시**:
- "주요 연구 분야가 무엇인가요?"
- "학력과 경력을 알려주세요"

#### 5.2 논문 AI 분석 테스트
1. `/admin/publications`에서 논문 PDF 업로드
2. 논문 상세 페이지 (`/publications/[id]`) 접속
3. AI 요약 확인:
   - [ ] 자동 요약 생성 확인
   - [ ] 5개 섹션 모두 표시 확인
4. 질의응답 테스트:
   - [ ] 질문 입력
   - [ ] 스트리밍 응답 확인
   - [ ] 논문 내용 기반 답변 확인

### Step 6: 에러 처리 테스트

- [ ] 존재하지 않는 페이지 접속 시 404 표시
- [ ] 관리자 권한 없는 사용자 로그인 시도
- [ ] 잘못된 파일 형식 업로드 시도
- [ ] 네트워크 오류 시나리오

## 테스트 체크리스트 요약

### 필수 기능
- [ ] 모든 페이지 로드
- [ ] 관리자 로그인/로그아웃
- [ ] PDF 업로드 및 처리
- [ ] AI 챗봇 동작
- [ ] 논문 AI 분석 동작
- [ ] CRUD 작업 (생성, 읽기, 수정, 삭제)

### 데이터베이스
- [ ] Supabase 연결 확인
- [ ] 테이블 접근 확인
- [ ] Storage 업로드/다운로드 확인
- [ ] 벡터 검색 동작 확인

### 성능
- [ ] 페이지 로드 시간 확인
- [ ] AI 응답 시간 확인
- [ ] 대용량 파일 업로드 테스트

## 문제 해결

### 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 에러 확인
npm run build
```

### Supabase 연결 오류
- 환경 변수 확인
- Supabase 프로젝트 상태 확인
- 네트워크 연결 확인

### AI 기능 오류
- Google API 키 확인
- API 할당량 확인
- 네트워크 연결 확인

## 테스트 완료 후

모든 테스트가 통과하면:
1. `TESTING.md`의 체크리스트 모두 체크
2. 주요 기능 스크린샷 저장 (선택)
3. 배포 준비 완료

## 다음 단계

테스트 완료 후 `DEPLOY.md`를 참조하여 Vercel 배포를 진행하세요.

