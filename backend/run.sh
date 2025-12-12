#!/bin/bash

# 백엔드 서버 실행 스크립트

# 가상환경 활성화
source venv/bin/activate

# 서버 실행 (0.0.0.0:7001 - 모든 네트워크 인터페이스에서 접근 가능)
# 참고: 7000번 포트는 macOS ControlCenter에서 사용 중이므로 7001번 사용
uvicorn main:app --reload --host 0.0.0.0 --port 7001

