# Google API 키 유출 문제 해결 가이드

## 문제
"Your API key was reported as leaked" 에러는 API 키가 공개되어 유출된 것으로 감지되었을 때 발생합니다.

## 해결 방법

### Step 1: Google Cloud Console에서 새 API 키 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택
3. **APIs & Services** → **Credentials** 클릭
4. 기존 API 키 찾기 (유출된 키)
5. **Delete** 또는 **Restrict key** 클릭하여 비활성화

### Step 2: 새 API 키 생성

1. **+ CREATE CREDENTIALS** 클릭
2. **API key** 선택
3. 새 API 키가 생성됨
4. **Restrict key** 클릭하여 보안 설정:
   - **API restrictions**: "Restrict key" 선택
   - **Select APIs**: 다음 API만 선택
     - Generative Language API
     - (필요한 다른 API들)
   - **Application restrictions**: "None" 또는 "IP addresses" (선택사항)
5. **Save** 클릭
6. **API key** 복사 (나중에 다시 볼 수 없으니 저장!)

### Step 3: .env.local 파일 업데이트

`.env.local` 파일을 열고 `GOOGLE_API_KEY` 값을 새 키로 교체:

```env
GOOGLE_API_KEY=새로운_API_키_여기에_입력
```

**중요**:
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인

### Step 4: 기존 키 제한 설정

보안을 위해 기존 키에 제한을 설정하세요:

1. Google Cloud Console → Credentials
2. 기존 API 키 클릭
3. **API restrictions** 설정:
   - "Restrict key" 선택
   - 필요한 API만 선택
4. **Save** 클릭

### Step 5: 개발 서버 재시작

```bash
# 개발 서버 중지 (Ctrl+C)
rm -rf .next
npm run dev
```

## 보안 권장사항

### 1. API 키 제한 설정
- **API restrictions**: 필요한 API만 허용
- **Application restrictions**: IP 주소 또는 HTTP 리퍼러 제한

### 2. .gitignore 확인
`.gitignore` 파일에 다음이 포함되어 있는지 확인:
```
.env
.env.local
.env*.local
```

### 3. 환경 변수 확인
Git에 커밋하기 전에:
```bash
git status
```
`.env.local` 파일이 나오지 않아야 합니다.

### 4. GitHub에서 키 제거 (이미 올라갔다면)
1. GitHub 저장소에서 `.env` 또는 `.env.local` 파일 삭제
2. Git 히스토리에서도 제거:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. 새 API 키 생성 및 교체

## 확인

새 API 키로 교체 후:
1. 개발 서버 재시작
2. 챗봇에서 테스트
3. 에러가 사라졌는지 확인

## 문제가 계속되면

1. Google Cloud Console → APIs & Services → Credentials
2. 모든 API 키 확인
3. 유출된 키 삭제
4. 새 키 생성 및 제한 설정
5. .env.local 업데이트

