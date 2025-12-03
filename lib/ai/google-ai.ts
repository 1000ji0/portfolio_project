import { GoogleGenerativeAI } from '@google/generative-ai'

export function getGoogleAI() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set')
  }
  return new GoogleGenerativeAI(apiKey)
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = getGoogleAI()
  
  // Google Generative AI의 embedding API 사용
  const result = await genAI.embedContent({
    model: 'text-embedding-004',
    content: { parts: [{ text }] },
  })
  
  const embedding = result.embedding
  return Array.isArray(embedding) ? embedding : embedding.values || []
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const genAI = getGoogleAI()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  
  const result = await model.generateContent(fullPrompt)
  const response = await result.response
  return response.text()
}

export async function generateStream(prompt: string, systemPrompt?: string) {
  const genAI = getGoogleAI()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  
  const result = await model.generateContentStream(fullPrompt)
  
  // Convert to async iterable
  const stream = result.stream
  return {
    async *[Symbol.asyncIterator]() {
      for await (const chunk of stream) {
        yield chunk
      }
    }
  }
}

