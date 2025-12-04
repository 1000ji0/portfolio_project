# SQL 실행 단계별 가이드 (초보자용)

## 🎯 목표
Supabase 데이터베이스에 테이블과 함수를 생성합니다.

## 📝 준비물
- `database/supabase/schema_safe.sql` 파일
- `database/supabase/functions_safe.sql` 파일
- Cursor IDE

## 🚀 실행 방법 (3가지)

### 방법 1: Cursor DB Explorer 사용 (권장)

#### 1단계: DB Explorer 열기
```
1. Cursor 왼쪽 사이드바에서 "DB Explorer" 아이콘 찾기
   (데이터베이스 모양 아이콘)
2. 클릭하여 열기
```

#### 2단계: Supabase 연결 확인
```
1. DB Explorer에서 "Supabase main (Production)" 찾기
2. 연결되어 있으면 ✅ 표시
3. 연결 안 되어 있으면:
   - 우클릭 → "Connect"
   - 또는 "+" 버튼 클릭하여 새 연결 추가
```

#### 3단계: SQL Editor 열기
```
1. Supabase 데이터베이스 우클릭
2. "New Query" 또는 "Open SQL Editor" 선택
3. SQL 편집기가 열립니다
```

#### 4단계: schema_safe.sql 실행
```
1. Cursor에서 database/supabase/schema_safe.sql 파일 열기
2. 전체 선택: Cmd+A (Mac) 또는 Ctrl+A (Windows)
3. 복사: Cmd+C 또는 Ctrl+C
4. SQL Editor에 붙여넣기: Cmd+V 또는 Ctrl+V
5. 실행 버튼 클릭 또는 Cmd+Enter
```

#### 5단계: functions_safe.sql 실행
```
1. database/supabase/functions_safe.sql 파일 열기
2. 전체 선택 및 복사
3. SQL Editor에 붙여넣기 (기존 내용 지우고)
4. 실행
```

---

### 방법 2: Supabase Dashboard 사용 (가장 확실함)

#### 1단계: Supabase 접속
```
1. 브라우저에서 https://app.supabase.com 접속
2. 로그인
3. 프로젝트 선택 (hhxwjrhsuxebzvzlwchj)
```

#### 2단계: SQL Editor 열기
```
1. 왼쪽 메뉴에서 "SQL Editor" 클릭
2. "New query" 버튼 클릭
```

#### 3단계: schema_safe.sql 실행
```
1. Cursor에서 database/supabase/schema_safe.sql 파일 열기
2. 전체 내용 복사
3. Supabase SQL Editor에 붙여넣기
4. "Run" 버튼 클릭
5. 성공 메시지 확인
```

#### 4단계: functions_safe.sql 실행
```
1. "New query" 버튼 다시 클릭
2. functions_safe.sql 내용 복사하여 붙여넣기
3. "Run" 버튼 클릭
```

---

### 방법 3: 파일 직접 드래그 앤 드롭

일부 DB Explorer는 파일을 직접 열 수 있습니다:

```
1. DB Explorer에서 Supabase 데이터베이스 선택
2. database/supabase/schema_safe.sql 파일을 드래그하여 SQL Editor에 드롭
3. 실행 버튼 클릭
```

## ✅ 실행 확인

### 확인 쿼리 1: 테이블 목록
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**예상 결과**:
- admin_users
- contact
- documents
- embeddings
- papers
- profiles
- projects

### 확인 쿼리 2: 함수 목록
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

**예상 결과**:
- insert_embedding
- match_embeddings

## 🐛 자주 발생하는 문제

### 문제 1: "relation does not exist"
**원인**: 테이블이 아직 생성되지 않음
**해결**: schema_safe.sql을 먼저 실행하세요

### 문제 2: "permission denied"
**원인**: 권한 부족
**해결**: Supabase Dashboard에서 실행하거나, Service Role Key 사용

### 문제 3: "extension vector does not exist"
**원인**: pgvector 확장이 설치되지 않음
**해결**: Supabase Dashboard → Database → Extensions에서 "vector" 활성화

### 문제 4: SQL이 실행되지 않음
**확인 사항**:
1. SQL이 선택되어 있는지 확인
2. 실행 버튼을 클릭했는지 확인
3. 에러 메시지가 있는지 확인

## 📸 스크린샷 가이드

### Cursor DB Explorer 위치
```
Cursor IDE
├── 왼쪽 사이드바
│   ├── 파일 탐색기 (Explorer)
│   ├── 검색 (Search)
│   ├── 🔍 DB Explorer ← 여기!
│   └── ...
```

### SQL Editor 위치
```
DB Explorer
└── Supabase
    └── [우클릭]
        └── "New Query" 또는 "SQL Editor"
```

## 💡 팁

1. **작은 단위로 실행**: 전체 SQL이 너무 길면 에러 발생 시 찾기 어렵습니다.
   - Extensions 먼저 실행
   - Tables 실행
   - Policies 실행

2. **에러 메시지 읽기**: 에러 메시지에 어떤 라인에서 문제가 발생했는지 표시됩니다.

3. **백업**: 중요한 데이터가 있다면 먼저 백업하세요.

## 🎉 성공 확인

모든 SQL이 성공적으로 실행되면:
- ✅ 7개 테이블 생성됨
- ✅ 2개 함수 생성됨
- ✅ RLS 정책 설정됨

이제 개발 서버를 재시작하고 프로필 데이터를 입력할 수 있습니다!

