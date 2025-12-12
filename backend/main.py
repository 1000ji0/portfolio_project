from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
from dotenv import load_dotenv
import pdfplumber
import openai
from supabase import create_client, Client
import json
from typing import List
import numpy as np

load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1234", os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:1234")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 클라이언트 초기화 (지연 초기화)
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
supabase: Client = None

def get_supabase_client() -> Client:
    """Supabase 클라이언트를 지연 초기화"""
    global supabase
    if supabase is None:
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.")
        try:
            supabase = create_client(supabase_url, supabase_key)
        except Exception as e:
            print(f"Supabase 클라이언트 초기화 오류: {e}")
            raise
    return supabase

openai.api_key = os.getenv("OPENAI_API_KEY")


def extract_text_from_pdf(file_path: str) -> str:
    """PDF에서 텍스트 추출"""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"PDF 추출 오류: {e}")
    return text


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """텍스트를 청크로 분할"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks


def create_embeddings(texts: List[str]) -> List[List[float]]:
    """텍스트 리스트에 대한 임베딩 생성"""
    try:
        response = openai.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"임베딩 생성 오류: {e}")
        return []


@app.post("/api/process-document")
async def process_document(
    file: UploadFile = File(...),
    description: str = "",
    source_type: str = "document",
    source_id: str = None
):
    """PDF 문서를 처리하고 임베딩 생성"""
    try:
        # Supabase 클라이언트 가져오기
        supabase_client = get_supabase_client()
        
        # 파일 저장
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # 텍스트 추출
        text = extract_text_from_pdf(file_path)

        if not text:
            raise HTTPException(status_code=400, detail="PDF에서 텍스트를 추출할 수 없습니다.")

        # 청킹
        chunks = chunk_text(text)

        # 임베딩 생성
        embeddings = create_embeddings(chunks)

        if not embeddings:
            raise HTTPException(status_code=500, detail="임베딩 생성에 실패했습니다.")

        # Supabase Storage에 파일 업로드
        bucket_name = "documents" if source_type == "document" else "paper-pdfs"
        storage_path = f"{source_id or 'temp'}/{file.filename}"

        with open(file_path, "rb") as f:
            supabase_client.storage.from_(bucket_name).upload(
                storage_path,
                f.read(),
                file_options={"content-type": "application/pdf"}
            )

        # 임베딩을 Supabase에 저장
        embedding_records = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            embedding_records.append({
                "content": chunk,
                "embedding": embedding,
                "metadata": {
                    "file_name": file.filename,
                    "description": description,
                    "chunk_index": i,
                },
                "source_type": source_type,
                "source_id": source_id or "temp",
            })

        # 배치로 삽입
        for record in embedding_records:
            supabase_client.table("embeddings").insert(record).execute()

        # 문서 레코드 생성/업데이트
        if source_type == "document":
            supabase_client.table("documents").insert({
                "file_name": file.filename,
                "file_path": storage_path,
                "description": description,
                "file_size": len(content),
            }).execute()

        # 임시 파일 삭제
        os.remove(file_path)

        return {
            "success": True,
            "message": "문서가 성공적으로 처리되었습니다.",
            "chunks": len(chunks),
        }

    except Exception as e:
        print(f"오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """헬스 체크"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7001)

