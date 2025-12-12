@echo off
REM 백엔드 서버 실행 스크립트 (Windows)

REM 가상환경 활성화
call venv\Scripts\activate.bat

REM 서버 실행 (0.0.0.0:7001 - 모든 네트워크 인터페이스에서 접근 가능)
uvicorn main:app --reload --host 0.0.0.0 --port 7001

