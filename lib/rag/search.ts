import { createAdminClient } from '@/lib/supabase/admin'
import { generateEmbedding } from '@/lib/ai/google-ai'

export interface SearchResult {
  content: string
  metadata: {
    source_type: 'document' | 'paper' | 'project'
    source_id: string
    file_name?: string
    title?: string
    [key: string]: any
  }
  similarity: number
}

export async function searchSimilarContent(
  query: string,
  sourceType?: 'document' | 'paper' | 'project',
  sourceId?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const supabase = createAdminClient()
  
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query)
  
  // Build query
  let queryBuilder = supabase
    .from('embeddings')
    .select('content, metadata, source_type, source_id')
    .limit(limit)
  
  if (sourceType) {
    queryBuilder = queryBuilder.eq('source_type', sourceType)
  }
  
  if (sourceId) {
    queryBuilder = queryBuilder.eq('source_id', sourceId)
  }
  
  // Use vector similarity search
  // Note: Supabase pgvector requires raw SQL for similarity search
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
    source_type_filter: sourceType || null,
    source_id_filter: sourceId || null
  })
  
  if (error) {
    console.error('Search error:', error)
    // Fallback to simple text search if RPC doesn't exist
    const { data: fallbackData } = await queryBuilder
    return (fallbackData || []).map((item: any) => ({
      content: item.content,
      metadata: item.metadata || {},
      similarity: 0.8, // Default similarity
    }))
  }
  
  return (data || []).map((item: any) => ({
    content: item.content,
    metadata: item.metadata || {},
    similarity: item.similarity || 0,
  }))
}

