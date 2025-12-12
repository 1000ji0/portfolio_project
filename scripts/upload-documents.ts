/**
 * 논문과 프로필 문서를 직접 업로드하고 임베딩 생성하는 스크립트
 * 관리자 로그인 없이 실행 가능
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { generateEmbedding } from '../lib/ai/google-ai'
import { chunkText, extractTextFromPDF } from '../lib/pdf/parser'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function uploadDocument(filePath: string, fileName: string, description?: string) {
  console.log(`\n📄 문서 업로드 시작: ${fileName}`)
  
  try {
    // 1. PDF 텍스트 추출
    console.log('  - 텍스트 추출 중...')
    const pdfBuffer = readFileSync(filePath)
    const text = await extractTextFromPDF(pdfBuffer)
    
    if (!text || text.trim().length === 0) {
      throw new Error('PDF에서 텍스트를 추출할 수 없습니다.')
    }
    
    console.log(`  - 추출된 텍스트 길이: ${text.length}자`)
    
    // 2. 텍스트 청킹
    console.log('  - 텍스트 청킹 중...')
    const chunkObjects = chunkText(text, 1000, 200)
    const chunks = chunkObjects.map(chunk => chunk.content)
    console.log(`  - 생성된 청크 수: ${chunks.length}개`)
    
    // 3. documents 테이블에 문서 정보 저장
    console.log('  - 문서 정보 저장 중...')
    const { data: documentData, error: docError } = await supabase
      .from('documents')
      .insert({
        file_name: fileName,
        file_path: filePath,
        description: description || `Uploaded: ${fileName}`,
        file_size: pdfBuffer.length,
      })
      .select()
      .single()
    
    if (docError) {
      throw new Error(`문서 저장 실패: ${docError.message}`)
    }
    
    console.log(`  - 문서 ID: ${documentData.id}`)
    
    // 4. 각 청크에 대해 임베딩 생성 및 저장
    console.log('  - 임베딩 생성 및 저장 중...')
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      try {
        // 임베딩 생성
        const embedding = await generateEmbedding(chunk)
        
        if (!embedding || embedding.length === 0) {
          console.warn(`    ⚠️ 청크 ${i + 1}/${chunks.length}: 임베딩 생성 실패`)
          errorCount++
          continue
        }
        
        // embeddings 테이블에 저장 (PostgreSQL vector 형식으로 변환)
        const { error: embedError } = await supabase.rpc('insert_embedding', {
          p_content: chunk,
          p_embedding: embedding,
          p_metadata: {
            file_name: fileName,
            chunk_index: i,
            total_chunks: chunks.length,
          },
          p_source_type: 'document',
          p_source_id: documentData.id,
        })
        
        if (embedError) {
          console.error(`    ❌ 청크 ${i + 1}/${chunks.length}: ${embedError.message}`)
          errorCount++
        } else {
          successCount++
          if ((i + 1) % 10 === 0) {
            console.log(`    ✅ ${i + 1}/${chunks.length} 청크 완료...`)
          }
        }
      } catch (error: any) {
        console.error(`    ❌ 청크 ${i + 1}/${chunks.length}: ${error.message}`)
        errorCount++
      }
    }
    
    console.log(`\n✅ 문서 업로드 완료: ${fileName}`)
    console.log(`   - 성공: ${successCount}개 청크`)
    console.log(`   - 실패: ${errorCount}개 청크`)
    
    return documentData.id
  } catch (error: any) {
    console.error(`\n❌ 문서 업로드 실패: ${fileName}`)
    console.error(`   에러: ${error.message}`)
    throw error
  }
}

async function uploadMarkdown(filePath: string, fileName: string, description?: string) {
  console.log(`\n📝 마크다운 문서 업로드 시작: ${fileName}`)
  
  try {
    // 1. 마크다운 파일 읽기
    console.log('  - 파일 읽기 중...')
    const text = readFileSync(filePath, 'utf-8')
    
    if (!text || text.trim().length === 0) {
      throw new Error('파일이 비어있습니다.')
    }
    
    console.log(`  - 파일 길이: ${text.length}자`)
    
    // 2. 텍스트 청킹
    console.log('  - 텍스트 청킹 중...')
    const chunkObjects = chunkText(text, 1000, 200)
    const chunks = chunkObjects.map(chunk => chunk.content)
    console.log(`  - 생성된 청크 수: ${chunks.length}개`)
    
    // 3. documents 테이블에 문서 정보 저장
    console.log('  - 문서 정보 저장 중...')
    const { data: documentData, error: docError } = await supabase
      .from('documents')
      .insert({
        file_name: fileName,
        file_path: filePath,
        description: description || `Uploaded: ${fileName}`,
        file_size: Buffer.byteLength(text, 'utf-8'),
      })
      .select()
      .single()
    
    if (docError) {
      throw new Error(`문서 저장 실패: ${docError.message}`)
    }
    
    console.log(`  - 문서 ID: ${documentData.id}`)
    
    // 4. 각 청크에 대해 임베딩 생성 및 저장
    console.log('  - 임베딩 생성 및 저장 중...')
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      try {
        // 임베딩 생성
        const embedding = await generateEmbedding(chunk)
        
        if (!embedding || embedding.length === 0) {
          console.warn(`    ⚠️ 청크 ${i + 1}/${chunks.length}: 임베딩 생성 실패`)
          errorCount++
          continue
        }
        
        // embeddings 테이블에 저장 (PostgreSQL vector 형식으로 변환)
        const { error: embedError } = await supabase.rpc('insert_embedding', {
          p_content: chunk,
          p_embedding: embedding,
          p_metadata: {
            file_name: fileName,
            chunk_index: i,
            total_chunks: chunks.length,
          },
          p_source_type: 'document',
          p_source_id: documentData.id,
        })
        
        if (embedError) {
          console.error(`    ❌ 청크 ${i + 1}/${chunks.length}: ${embedError.message}`)
          errorCount++
        } else {
          successCount++
          if ((i + 1) % 5 === 0 || i === chunks.length - 1) {
            console.log(`    ✅ ${i + 1}/${chunks.length} 청크 완료...`)
          }
        }
      } catch (error: any) {
        console.error(`    ❌ 청크 ${i + 1}/${chunks.length}: ${error.message}`)
        errorCount++
      }
    }
    
    console.log(`\n✅ 문서 업로드 완료: ${fileName}`)
    console.log(`   - 성공: ${successCount}개 청크`)
    console.log(`   - 실패: ${errorCount}개 청크`)
    
    return documentData.id
  } catch (error: any) {
    console.error(`\n❌ 문서 업로드 실패: ${fileName}`)
    console.error(`   에러: ${error.message}`)
    throw error
  }
}

async function main() {
  console.log('🚀 문서 업로드 스크립트 시작\n')
  console.log('=' .repeat(50))
  
  try {
    // 1. 논문 PDF 업로드
    const paperPath = join(process.cwd(), '문서', '(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf')
    await uploadDocument(
      paperPath,
      '(JDCS)설계 중심의 Multi Agent Design Methodology 제안.pdf',
      '천지영 연구자의 논문: 설계 중심의 Multi AI Agent Design Methodology(MADM) 제안'
    )
    
    // 2. 프로필 마크다운 업로드
    const profilePath = join(process.cwd(), '문서', 'profile.md')
    await uploadMarkdown(
      profilePath,
      'profile.md',
      '천지영 연구자의 프로필 및 이력서'
    )
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ 모든 문서 업로드 완료!')
    console.log('\n이제 홈페이지의 챗봇에서 이 문서들을 참조하여 답변할 수 있습니다.')
  } catch (error: any) {
    console.error('\n' + '='.repeat(50))
    console.error('❌ 스크립트 실행 실패')
    console.error(`에러: ${error.message}`)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  main()
}

export { uploadDocument, uploadMarkdown }

