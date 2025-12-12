#!/bin/bash

# 간단한 문서 업로드 스크립트
# API 라우트를 통해 업로드

echo "🚀 문서 업로드 시작"
echo ""

# 포트 확인 (기본값: 3001, 필요시 변경)
PORT=${PORT:-3001}

# 논문 PDF 업로드
echo "📄 논문 PDF 업로드 중... (포트: $PORT)"
curl -X POST http://localhost:$PORT/api/admin/documents/upload-direct \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "문서/(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf",
    "fileName": "(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf",
    "description": "천지영 연구자의 논문: 설계 중심의 Multi AI Agent Design Methodology(MADM) 제안",
    "fileType": "pdf"
  }' | jq '.'

echo ""
echo "📝 프로필 마크다운 업로드 중... (포트: $PORT)"
curl -X POST http://localhost:$PORT/api/admin/documents/upload-direct \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "문서/profile.md",
    "fileName": "profile.md",
    "description": "천지영 연구자의 프로필 및 이력서",
    "fileType": "markdown"
  }' | jq '.'

echo ""
echo "✅ 업로드 완료!"

