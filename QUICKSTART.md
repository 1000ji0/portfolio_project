# 빠른 시작 가이드

## 1. 백엔드 가상환경 설정 및 실행

```bash
cd backend

# 가상환경 생성 및 활성화 (macOS/Linux)
python3 -m venv venv
source venv/bin/activate

# 또는 자동 스크립트 사용
chmod +x setup.sh && ./setup.sh

# requirements.txt로 의존성 설치
pip install -r requirements.txt

# 서버 실행 (0.0.0.0:7001)
uvicorn main:app --reload --host 0.0.0.0 --port 7001
```

## 2. 프론트엔드 실행

새 터미널에서:

```bash
cd frontend
npm install
npm run dev
```

## 3. 확인

- 프론트엔드: http://localhost:1234
- 백엔드 API: http://localhost:7001

## 중요 사항

- 백엔드는 **반드시 가상환경이 활성화된 상태**에서 실행해야 합니다.
- 가상환경 활성화 확인: 터미널 프롬프트 앞에 `(venv)` 표시 확인
- 모든 Python 의존성은 `backend/requirements.txt`에 정의되어 있습니다.

