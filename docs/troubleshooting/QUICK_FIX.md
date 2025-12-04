# 빠른 문제 해결 가이드

## 현재 발생 중인 에러

1. **Profile fetch error**: Supabase에서 프로필 데이터를 가져오지 못함
2. **Papers fetch error**: 논문 데이터를 가져오지 못함  
3. **/api/chat 500 에러**: AI 챗봇 API 오류

## 원인

가장 가능성 높은 원인:
1. **Supabase 환경 변수가 플레이스홀더 값** (`your_supabase_url` 등)
2. **Supabase 프로젝트가 생성되지 않음**
3. **데이터베이스 스키마가 생성되지 않음**

## 해결 방법

### Step 1: 환경 변수 확인

`.env.local` 파일을 열고 다음을 확인:

```bash
cat .env.local
```

**확인 사항**:
- `NEXT_PUBLIC_SUPABASE_URL`이 `https://`로 시작하는 실제 URL인가?
- `your_supabase_url` 같은 플레이스홀더가 아닌가?

### Step 2: Supabase 프로젝트 생성 (아직 안 했다면)

1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. 프로젝트 생성 완료 대기 (약 2분)

### Step 3: Supabase API 키 가져오기

1. Supabase Dashboard → 프로젝트 선택
2. **Settings** → **API** 클릭
3. 다음 값 복사:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key: 긴 문자열

### Step 4: .env.local 파일 업데이트

`.env.local` 파일을 열고 **실제 값**으로 교체:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**중요**: 
- `https://`로 시작해야 함
- 따옴표 사용하지 않음
- 공백 없음

### Step 5: 데이터베이스 스키마 생성

1. Supabase Dashboard → **SQL Editor** 클릭
2. **New query** 클릭
3. `database/supabase/schema.sql` 파일 내용 복사하여 붙여넣기
4. **Run** 클릭
5. `database/supabase/functions.sql` 파일도 동일하게 실행

### Step 6: 개발 서버 재시작

```bash
# 개발 서버 중지 (Ctrl+C)
rm -rf .next
npm run dev
```

### Step 7: 프로필 데이터 입력

1. `/admin/profile` 접속
2. `PROFILE_DATA.md` 참조하여 정보 입력
3. 저장 클릭

## 확인 체크리스트

- [ ] `.env.local`에 실제 Supabase URL 입력됨 (플레이스홀더 아님)
- [ ] `.env.local`에 실제 Supabase 키 입력됨
- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 완료 (`database/supabase/schema.sql`)
- [ ] 벡터 검색 함수 생성 완료 (`database/supabase/functions.sql`)
- [ ] 개발 서버 재시작 완료
- [ ] 프로필 데이터 입력 완료

## 여전히 문제가 있다면

터미널의 **서버 로그**를 확인하세요. 에러 메시지가 더 자세히 표시됩니다.

개발 서버를 실행한 터미널에서 에러 메시지를 확인하고, `CHECK_ENV.md`를 참조하세요.

