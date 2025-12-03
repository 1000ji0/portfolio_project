import pdf from 'pdf-parse'

export interface PDFChunk {
  content: string
  page: number
  chunkIndex: number
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer)
  return data.text
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

