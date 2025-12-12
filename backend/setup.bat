@echo off
REM 백엔드 가상환경 설정 스크립트 (Windows)

echo 백엔드 가상환경 설정을 시작합니다...

REM 가상환경 생성
python -m venv venv

REM 가상환경 활성화
call venv\Scripts\activate.bat

REM pip 업그레이드
python -m pip install --upgrade pip

REM requirements.txt로 의존성 설치
pip install -r requirements.txt

echo 설정이 완료되었습니다!
echo.
echo 가상환경을 활성화하려면 다음 명령을 실행하세요:
echo   venv\Scripts\activate
echo.
echo 가상환경을 비활성화하려면:
echo   deactivate

pause


