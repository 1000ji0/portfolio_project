# Profile과 Paper 내용이 비어있는 문제 해결

## 🔍 문제 진단

배포된 사이트에서 Profile과 Paper 내용이 비어있는 경우, 다음을 확인하세요:

### 1. Vercel 환경 변수 확인

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 다음 변수들이 모두 설정되어 있는지 확인:

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ DIFY_API_KEY
✅ DIFY_API_KEY_HOME
✅ GOOGLE_GENERATIVE_AI_API_KEY
```

**중요**: 환경 변수 변경 후에는 **수동으로 재배포**해야 합니다!

### 2. Supabase 데이터 확인

Supabase 대시보드에서 다음 테이블에 데이터가 있는지 확인:

#### `profiles` 테이블
- 최소 1개의 행이 있어야 합니다
- 필수 필드: `name`, `name_en`, `affiliation`

#### `papers` 테이블
- 최소 1개의 논문이 있어야 합니다
- 필수 필드: `title`, `authors`

### 3. 데이터 확인 방법

#### Supabase 대시보드에서 확인:
1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Table Editor** 클릭
4. `profiles` 테이블 확인
5. `papers` 테이블 확인

#### SQL로 확인:
```sql
-- profiles 데이터 확인
SELECT COUNT(*) FROM profiles;

-- papers 데이터 확인
SELECT COUNT(*) FROM papers;

-- 실제 데이터 확인
SELECT * FROM profiles LIMIT 1;
SELECT * FROM papers LIMIT 1;
```

## 🛠 해결 방법

### 방법 1: 데이터가 없는 경우

데이터를 수동으로 추가하거나, 이전에 만든 API 라우트를 사용하세요:

#### Profile 데이터 추가:
```bash
# 로컬에서 실행 (환경 변수 설정 필요)
curl -X POST http://localhost:3000/api/admin/profile/upload-profile \
  -H "Content-Type: application/json" \
  -d @문서/profile.md
```

#### Paper 데이터 추가:
```bash
# 로컬에서 실행
curl -X POST http://localhost:3000/api/admin/papers/add-madm
```

### 방법 2: 환경 변수 재설정

1. Vercel 대시보드 → Settings → Environment Variables
2. 각 변수를 삭제하고 다시 추가
3. **반드시 Production, Preview, Development 모두 선택**
4. **Redeploy** 클릭하여 수동 재배포

### 방법 3: Supabase 연결 확인

브라우저 개발자 도구 → Console에서 에러 확인:

- `Profile fetch error` → Supabase 연결 문제
- `DIFY_API_KEY is not set` → Dify API 키 문제
- `Invalid Supabase URL` → 환경 변수 형식 문제

## 📝 체크리스트

- [ ] Vercel 환경 변수 모두 설정됨
- [ ] 환경 변수 변경 후 재배포 완료
- [ ] Supabase `profiles` 테이블에 데이터 있음
- [ ] Supabase `papers` 테이블에 데이터 있음
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 네트워크 탭에서 API 호출 성공 (200 응답)

## 🚨 자주 발생하는 문제

### 문제 1: 환경 변수는 설정했는데 데이터가 안 보임
**해결**: 환경 변수 변경 후 **수동 재배포** 필요!

### 문제 2: 로컬에서는 되는데 배포된 사이트에서는 안 됨
**해결**: Vercel 환경 변수가 제대로 설정되었는지 확인

### 문제 3: Profile은 보이는데 Paper가 안 보임
**해결**: `papers` 테이블에 데이터가 있는지 확인

## 💡 빠른 확인 방법

배포된 사이트에서 브라우저 개발자 도구(F12) → Console 탭에서:
- 에러 메시지 확인
- Network 탭에서 `/api/mcp/home` 또는 `/api/mcp/paper` 호출 확인
- 응답 상태 코드 확인 (200이어야 함)

