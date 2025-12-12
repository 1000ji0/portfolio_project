# 백엔드 설정 가이드

## 가상환경 설정

백엔드는 Python 가상환경을 사용합니다.

### macOS/Linux

```bash
# 가상환경 생성
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate

# requirements.txt로 의존성 설치
pip install -r requirements.txt
```

또는 자동 설정 스크립트 사용:
```bash
chmod +x setup.sh
./setup.sh
```

### Windows

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
venv\Scripts\activate

# requirements.txt로 의존성 설치
pip install -r requirements.txt
```

또는 자동 설정 스크립트 사용:
```bash
setup.bat
```

## 환경 변수 설정

**중요**: 서버를 실행하기 전에 반드시 환경 변수를 설정해야 합니다!

`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI 설정
OPENAI_API_KEY=your_openai_api_key

# Frontend URL (CORS용)
NEXT_PUBLIC_APP_URL=http://localhost:1234
```

`.env.example` 파일을 참고하세요:
```bash
cp .env.example .env
# 그 다음 .env 파일을 편집하여 실제 값으로 변경
```

## 서버 실행

**중요**: 반드시 가상환경이 활성화된 상태에서 실행해야 합니다!

### 방법 1: 가상환경 활성화 후 실행

```bash
# 가상환경 활성화
source venv/bin/activate

# 가상환경 활성화 확인 (프롬프트 앞에 (venv) 표시)
# (venv) user@computer:~/profile_project/backend$

# 서버 실행 (0.0.0.0:7001)
# 참고: 7000번 포트는 macOS ControlCenter에서 사용 중이므로 7001번 사용
uvicorn main:app --reload --host 0.0.0.0 --port 7001
```

### 방법 2: 실행 스크립트 사용 (권장)

```bash
./run.sh
```

서버는 `http://localhost:7001`에서 실행됩니다.

> **주의**: 
> - 가상환경이 활성화되지 않으면 `ModuleNotFoundError`가 발생합니다.
> - `.env` 파일이 없으면 `supabase_url is required` 오류가 발생합니다.

## 가상환경 비활성화

```bash
deactivate
```

## 의존성 업데이트

새로운 패키지를 추가한 후:

```bash
pip freeze > requirements.txt
```

## 주요 의존성

- **FastAPI**: 웹 프레임워크
- **uvicorn**: ASGI 서버
- **supabase**: Supabase 클라이언트
- **openai**: OpenAI API 클라이언트
- **pdfplumber**: PDF 텍스트 추출
- **numpy**: 수치 계산

## 문제 해결

### `ModuleNotFoundError: No module named 'supabase'`
- 가상환경이 활성화되지 않았습니다. `source venv/bin/activate` 실행

### `supabase_url is required`
- `backend/.env` 파일이 없거나 환경 변수가 설정되지 않았습니다.
- `.env.example`을 복사하여 `.env` 파일을 만들고 실제 값으로 수정하세요.
