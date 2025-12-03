-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  source_type_filter text DEFAULT NULL,
  source_id_filter uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  source_type text,
  source_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    embeddings.source_type,
    embeddings.source_id,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  FROM embeddings
  WHERE
    (source_type_filter IS NULL OR embeddings.source_type = source_type_filter)
    AND (source_id_filter IS NULL OR embeddings.source_id = source_id_filter)
    AND (1 - (embeddings.embedding <=> query_embedding)) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Insert embedding function (for proper vector type handling)
CREATE OR REPLACE FUNCTION insert_embedding(
  p_content text,
  p_embedding float[],
  p_metadata jsonb,
  p_source_type text,
  p_source_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO embeddings (content, embedding, metadata, source_type, source_id)
  VALUES (p_content, p_embedding::vector, p_metadata, p_source_type, p_source_id)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

