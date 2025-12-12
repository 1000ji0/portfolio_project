# 데이터베이스 디렉토리

데이터베이스 스키마 및 마이그레이션 파일을 포함합니다.

## 디렉토리 구조

### `/supabase` - Supabase SQL 스크립트
- `schema.sql` - 기본 스키마
- `schema_safe.sql` - 안전한 스키마 (충돌 방지)
- `functions.sql` - 데이터베이스 함수
- `functions_safe.sql` - 안전한 함수 (충돌 방지)
- `create_tables.sql` - 테이블 생성 스크립트
- `create_tables_simple.sql` - 간단한 테이블 생성 스크립트
- `create_functions.sql` - 함수 생성 스크립트
- `create_messages_table.sql` - 메시지 테이블 생성 스크립트

## 사용 방법

1. **초기 설정**: `schema_safe.sql`과 `functions_safe.sql` 실행
2. **메시지 테이블**: `create_messages_table.sql` 실행
3. **개별 테이블/함수**: 필요한 파일만 선택적으로 실행

## 주의사항

- `_safe` 접미사가 있는 파일은 여러 번 실행해도 안전합니다 (IF NOT EXISTS, CREATE OR REPLACE 사용)
- 프로덕션 환경에서는 마이그레이션 전에 백업을 권장합니다

