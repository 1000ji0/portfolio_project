# 초기 데이터 입력 가이드

이 가이드는 관리자 페이지에서 프로필과 논문 정보를 입력하는 방법을 안내합니다.

## 사전 준비

1. **Supabase 설정 완료**: `SETUP_SUPABASE.md` 참조
2. **개발 서버 실행**: `npm run dev`
3. **관리자 로그인**: `/api/auth/signin`에서 Google OAuth 로그인

## 1. 프로필 사진 설정

프로필 사진은 이미 `public/profile-photo.jpeg`로 복사되었습니다.

### 옵션 A: 로컬 파일 사용 (개발 환경)
- 프로필 이미지 URL: `/profile-photo.jpeg`

### 옵션 B: Supabase Storage 사용 (프로덕션 권장)
1. `/admin/documents`에서 프로필 사진 업로드
2. 업로드된 파일의 URL 복사
3. 프로필 관리에서 해당 URL 사용

## 2. 프로필 정보 입력

1. `/admin/profile` 페이지 접속
2. `PROFILE_DATA.md` 파일의 정보를 참고하여 입력:

### 기본 정보
- 이름 (한글): 천지영
- 이름 (영문): Jiyeong Cheon
- 프로필 이미지 URL: `/profile-photo.jpeg`
- 소속 (한글): 명지대학교 기록정보과학전문대학원 AI정보과학전공
- 소속 (영문): Graduate School of Archival and Information Science, Major in AI & Information Science, Myongji University
- 학위 과정: 석사과정 (Master's Candidate)
- 한 줄 소개: 멀티모달 분석, LLM, 감성분석, NLP, AI Agent, 데이터 분석, Multi-Agent Systems, 음악치료 AI 응용에 관심이 있습니다

### 학력 추가
"학력" 섹션에서 "추가" 버튼을 클릭하여 다음 정보 입력:

**학력 1:**
- 학교명: 명지대학교 기록정보과학전문대학원
- 전공: AI정보과학전공
- 학위: 석사과정
- 기간: 2025.03 ~ 2027.02
- 기타: 학점 4.5/4.5, 재학중

**학력 2:**
- 학교명: 명지대학교
- 전공: 정치외교학과 (인문)
- 학위: 학사
- 기간: 2021.03 ~ 2025.02
- 기타: 학점 3.70/4.5, 졸업

### 경력 추가
"경력" 섹션에서 "추가" 버튼을 클릭하여 `PROFILE_DATA.md`의 경력 정보 입력

### 기술 스택 추가
"기술 스택" 섹션에서 카테고리별로 추가:
- AI/ML: AI Agent, 인공지능(AI), 지도학습, NLP, 챗봇, 프롬프팅
- 프로그래밍 언어: Python, R
- 데이터 분석: 데이터 분석, PowerBI

### 수상 경력 추가
- 수상명: 2024년 명지대학교 SW경진대회 데이터분석부문 대상
- 발급 기관: 명지대학교
- 날짜: 2024

### 연구 관심 분야 추가
- 멀티모달 분석
- LLM
- 감성 분석
- NLP
- AI Agent
- 데이터 분석
- Multi-Agent Systems
- 음악치료 AI 응용

3. "저장" 버튼 클릭

## 3. 논문 추가

1. `/admin/publications` 페이지 접속
2. "새 논문 추가" 버튼 클릭
3. `PAPER_DATA.md` 파일의 정보 입력:

- **제목**: 설계 중심의 Multi AI Agent Design Methodology(MADM) 제안: RACID 역할 모델 중심으로
- **저자**: 천지영, 윤석용
- **학회/저널명**: JDCS (Journal of Digital Contents Society)
- **발표 연도**: 2025
- **초록**: `PAPER_DATA.md` 참조
- **태그**: AI Agent, Multi Agent System, AI, LLM, Design Methodology, RACID, MADM

4. **PDF 파일 업로드**: 
   - 파일 선택: `문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf`
   - 업로드 후 자동으로 텍스트 추출 및 임베딩 생성됨

5. "저장" 버튼 클릭

## 4. 문서 업로드 (홈 챗봇용)

홈페이지의 AI 챗봇이 참조할 문서를 업로드합니다:

1. `/admin/documents` 페이지 접속
2. "새 문서 업로드" 클릭
3. 다음 파일들 업로드:
   - `문서/profile.md` (이력서)
   - `문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf` (논문 PDF)

## 5. 연락처 정보 입력

1. `/admin/contact` 페이지 접속
2. 다음 정보 입력:
   - 이메일: cj8442@naver.com
   - GitHub URL: (있는 경우)
   - LinkedIn URL: (있는 경우)
   - Google Scholar URL: (있는 경우)
3. "저장" 버튼 클릭

## 확인

모든 정보 입력 후:

1. 홈페이지 (`/`) 접속하여 프로필 사진과 정보 확인
2. 프로필 페이지 (`/profile`) 접속하여 전체 정보 확인
3. 논문 페이지 (`/publications`) 접속하여 논문 확인
4. 홈 챗봇에 질문하여 문서 기반 답변 확인

## 참고 파일

- `PROFILE_DATA.md`: 프로필 정보 상세
- `PAPER_DATA.md`: 논문 정보 상세

