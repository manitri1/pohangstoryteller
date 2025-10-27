-- 미디어 통계 함수 생성
-- 포항 스토리텔러 미디어 관리 시스템

-- =============================================
-- 미디어 통계 함수
-- =============================================

-- 기본 미디어 통계 조회 함수
CREATE OR REPLACE FUNCTION get_media_stats(p_user_id UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  image_count BIGINT,
  image_size BIGINT,
  video_count BIGINT,
  video_size BIGINT,
  audio_count BIGINT,
  audio_size BIGINT,
  public_files BIGINT,
  private_files BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM(file_size), 0) as total_size,
    COUNT(*) FILTER (WHERE file_type = 'image') as image_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'image'), 0) as image_size,
    COUNT(*) FILTER (WHERE file_type = 'video') as video_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'video'), 0) as video_size,
    COUNT(*) FILTER (WHERE file_type = 'audio') as audio_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'audio'), 0) as audio_size,
    COUNT(*) FILTER (WHERE is_public = true) as public_files,
    COUNT(*) FILTER (WHERE is_public = false) as private_files
  FROM media_files
  WHERE user_id = p_user_id;
END;
$$;

-- 고급 미디어 통계 조회 함수
CREATE OR REPLACE FUNCTION get_advanced_media_stats(p_user_id UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  image_count BIGINT,
  image_size BIGINT,
  video_count BIGINT,
  video_size BIGINT,
  audio_count BIGINT,
  audio_size BIGINT,
  public_files BIGINT,
  private_files BIGINT,
  recent_uploads BIGINT,
  popular_tags TEXT[],
  storage_usage_percentage BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_storage_limit BIGINT := 1073741824; -- 1GB 기본 제한
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM(file_size), 0) as total_size,
    COUNT(*) FILTER (WHERE file_type = 'image') as image_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'image'), 0) as image_size,
    COUNT(*) FILTER (WHERE file_type = 'video') as video_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'video'), 0) as video_size,
    COUNT(*) FILTER (WHERE file_type = 'audio') as audio_count,
    COALESCE(SUM(file_size) FILTER (WHERE file_type = 'audio'), 0) as audio_size,
    COUNT(*) FILTER (WHERE is_public = true) as public_files,
    COUNT(*) FILTER (WHERE is_public = false) as private_files,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_uploads,
    ARRAY(
      SELECT DISTINCT unnest(tags) 
      FROM media_files 
      WHERE user_id = p_user_id 
      AND tags IS NOT NULL
      LIMIT 10
    ) as popular_tags,
    ROUND(
      (COALESCE(SUM(file_size), 0)::NUMERIC / total_storage_limit::NUMERIC) * 100
    )::BIGINT as storage_usage_percentage
  FROM media_files
  WHERE user_id = p_user_id;
END;
$$;

-- 함수 권한 설정
GRANT EXECUTE ON FUNCTION get_media_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_advanced_media_stats(UUID) TO authenticated;

-- 함수 설명 추가
COMMENT ON FUNCTION get_media_stats(UUID) IS '사용자의 미디어 파일 기본 통계를 조회합니다';
COMMENT ON FUNCTION get_advanced_media_stats(UUID) IS '사용자의 미디어 파일 고급 통계를 조회합니다 (최근 업로드, 인기 태그, 저장소 사용률 포함)';
