# 환경 변수 체크리스트

Vercel 배포 전에 다음 환경 변수들이 모두 설정되어 있는지 확인하세요.

## 📋 필수 환경 변수 목록

### Supabase 설정
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Google AI 설정
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY`

### Dify AI 설정
- [ ] `DIFY_API_KEY` (Paper 페이지용)
- [ ] `DIFY_API_KEY_HOME` (Home 챗봇용)

## 🔍 환경 변수 확인 방법

### 로컬에서 확인

```bash
# .env.local 파일 확인
cat .env.local
```

### Vercel에서 확인

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 모든 변수가 추가되었는지 확인

## ⚠️ 주의사항

1. **공개되지 않도록 주의**: API 키는 절대 GitHub에 커밋하지 마세요
2. **.gitignore 확인**: `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
3. **값에 따옴표 없음**: Vercel에 입력할 때 값만 입력 (따옴표 제거)

## 📝 Vercel 환경 변수 추가 예시

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co
Environment: Production, Preview, Development (모두 선택)
```

