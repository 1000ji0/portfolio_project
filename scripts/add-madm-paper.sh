#!/bin/bash

# MADM 논문을 papers 테이블에 추가하는 스크립트

echo "📄 MADM 논문 추가 중..."

curl -X POST http://localhost:3001/api/admin/papers/add-madm \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "✅ 완료!"

