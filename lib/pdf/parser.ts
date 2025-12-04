export interface PDFChunk {
  content: string
  page: number
  chunkIndex: number
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // pdf-parse는 PDFParse 클래스를 export함
  // Node.js 환경에서는 require 사용
  if (typeof require !== 'undefined') {
    const pdfParseModule = require('pdf-parse')
    // PDFParse 클래스 사용
    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer })
      const result = await parser.getText()
      return result.text
    }
    // fallback: 직접 함수가 있는 경우
    if (typeof pdfParseModule === 'function') {
      const data = await pdfParseModule(buffer)
      return data.text
    }
  }
  
  // ESM 환경에서는 동적 import
  const pdfModule = await import('pdf-parse')
  if (pdfModule.PDFParse) {
    const parser = new pdfModule.PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text
  }
  
  // 최종 fallback
  const pdf = pdfModule.default || pdfModule
  if (typeof pdf === 'function') {
    const data = await pdf(buffer)
    return data.text
  }
  
  throw new Error('pdf-parse를 올바르게 로드할 수 없습니다.')
}

export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): PDFChunk[] {
  const chunks: PDFChunk[] = []
  let startIndex = 0
  let chunkIndex = 0

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length)
    const chunk = text.slice(startIndex, endIndex).trim()

    if (chunk.length > 0) {
      chunks.push({
        content: chunk,
        page: 1, // PDF parser doesn't provide page info easily
        chunkIndex: chunkIndex++,
      })
    }

    startIndex = endIndex - overlap
    if (startIndex >= text.length) break
  }

  return chunks
}

