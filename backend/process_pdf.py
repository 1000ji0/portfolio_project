"""
PDF 처리 스크립트 - 초기 문서 업로드용
"""
import os
import sys
from dotenv import load_dotenv
import pdfplumber
import openai
from supabase import create_client, Client

load_dotenv()

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


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
    """텍스트를 청크로 분할"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks


def create_embeddings(texts: list) -> list:
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


def process_pdf(file_path: str, supabase: Client, source_type: str = "document", source_id: str = None):
    """PDF 파일 처리 및 임베딩 저장"""
    print(f"처리 중: {file_path}")
    
    # 텍스트 추출
    text = extract_text_from_pdf(file_path)
    if not text:
        print("텍스트를 추출할 수 없습니다.")
        return
    
    # 청킹
    chunks = chunk_text(text)
    print(f"청크 수: {len(chunks)}")
    
    # 임베딩 생성
    embeddings = create_embeddings(chunks)
    if not embeddings:
        print("임베딩 생성 실패")
        return
    
    # Supabase에 저장
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        record = {
            "content": chunk,
            "embedding": embedding,
            "metadata": {
                "file_name": os.path.basename(file_path),
                "chunk_index": i,
            },
            "source_type": source_type,
            "source_id": source_id or "temp",
        }
        supabase.table("embeddings").insert(record).execute()
        print(f"청크 {i+1}/{len(chunks)} 저장 완료")
    
    print("처리 완료!")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python process_pdf.py <pdf_file_path> [source_type] [source_id]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    source_type = sys.argv[2] if len(sys.argv) > 2 else "document"
    source_id = sys.argv[3] if len(sys.argv) > 3 else None
    
    supabase = create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    )
    
    process_pdf(file_path, supabase, source_type, source_id)


