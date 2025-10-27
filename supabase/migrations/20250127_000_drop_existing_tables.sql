-- 포항 스토리텔러 기존 테이블 삭제 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 기존 Supabase 테이블들을 안전하게 삭제
-- Supabase Migration SQL Guideline 준수
-- 주의: 이 마이그레이션은 모든 데이터를 삭제합니다!

-- =============================================
-- 1. 외래키 제약조건 삭제
-- =============================================

-- 외래키 제약조건들을 먼저 삭제
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- 모든 외래키 제약조건 조회 및 삭제
    FOR constraint_record IN 
        SELECT 
            tc.table_name, 
            tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name IN (
            'profiles', 'user_preferences', 'courses', 'locations', 'courses_locations', 
            'courses_routes', 'user_stamps', 'stamp_acquisitions', 'albums', 'album_items', 
            'media_files', 'posts', 'likes', 'comments', 'bookmarks', 'user_course_interactions', 
            'stamps', 'souvenirs', 'souvenir_templates', 'course_recommendations'
        )
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I CASCADE', 
                      constraint_record.table_name, 
                      constraint_record.constraint_name);
    END LOOP;
    
    RAISE NOTICE '외래키 제약조건들이 삭제되었습니다.';
END $$;

-- =============================================
-- 2. 트리거 삭제
-- =============================================

-- updated_at 트리거들 삭제
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
DROP TRIGGER IF EXISTS update_user_stamps_updated_at ON user_stamps;
DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
DROP TRIGGER IF EXISTS update_album_items_updated_at ON album_items;
DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_souvenirs_updated_at ON souvenirs;
DROP TRIGGER IF EXISTS update_stamps_updated_at ON stamps;

-- 자동 분류 트리거 삭제
DROP TRIGGER IF EXISTS trigger_auto_classify_media ON media_files;

-- =============================================
-- 3. 함수 삭제
-- =============================================

-- 커스텀 함수들 삭제
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS search_media_files(UUID, TEXT, TEXT, TEXT[], TIMESTAMP, TIMESTAMP) CASCADE;
DROP FUNCTION IF EXISTS get_media_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS auto_classify_media() CASCADE;
DROP FUNCTION IF EXISTS search_posts(TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_popular_posts(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_collaborative_recommendations(UUID, INTEGER) CASCADE;

-- =============================================
-- 4. 인덱스 삭제
-- =============================================

-- 기본 성능 인덱스 삭제
DROP INDEX IF EXISTS idx_courses_category;
DROP INDEX IF EXISTS idx_courses_featured;
DROP INDEX IF EXISTS idx_courses_active;
DROP INDEX IF EXISTS idx_locations_coordinates;
DROP INDEX IF EXISTS idx_locations_name;
DROP INDEX IF EXISTS idx_user_stamps_user_id;
DROP INDEX IF EXISTS idx_user_stamps_location_id;
DROP INDEX IF EXISTS idx_albums_user_id;
DROP INDEX IF EXISTS idx_posts_author;
DROP INDEX IF EXISTS idx_posts_public;
DROP INDEX IF EXISTS idx_posts_hashtags;
DROP INDEX IF EXISTS idx_likes_user_post;
DROP INDEX IF EXISTS idx_comments_post;
DROP INDEX IF EXISTS idx_bookmarks_user_post;

-- 미디어 파일 인덱스 삭제
DROP INDEX IF EXISTS idx_media_files_user;
DROP INDEX IF EXISTS idx_media_files_type;
DROP INDEX IF EXISTS idx_media_files_tags;
DROP INDEX IF EXISTS idx_media_files_location;
DROP INDEX IF EXISTS idx_media_files_created_at;
DROP INDEX IF EXISTS idx_media_files_is_public;

-- 스탬프 시스템 인덱스 삭제
DROP INDEX IF EXISTS idx_stamps_location;
DROP INDEX IF EXISTS idx_stamps_active;

-- AI 추천 시스템 인덱스 삭제
DROP INDEX IF EXISTS idx_user_course_interactions_user;
DROP INDEX IF EXISTS idx_user_course_interactions_course;
DROP INDEX IF EXISTS idx_course_recommendations_user;
DROP INDEX IF EXISTS idx_course_recommendations_course;

-- =============================================
-- 5. 테이블 삭제 (역순으로 삭제)
-- =============================================

-- 커뮤니티 시스템 테이블 삭제
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- AI 추천 시스템 테이블 삭제
DROP TABLE IF EXISTS course_recommendations CASCADE;
DROP TABLE IF EXISTS user_course_interactions CASCADE;

-- 기념품 시스템 테이블 삭제
DROP TABLE IF EXISTS souvenirs CASCADE;
DROP TABLE IF EXISTS souvenir_templates CASCADE;

-- 스탬프 시스템 테이블 삭제
DROP TABLE IF EXISTS stamp_acquisitions CASCADE;
DROP TABLE IF EXISTS user_stamps CASCADE;
DROP TABLE IF EXISTS stamps CASCADE;

-- 미디어 관리 시스템 테이블 삭제
DROP TABLE IF EXISTS media_files CASCADE;

-- 앨범 시스템 테이블 삭제
DROP TABLE IF EXISTS album_items CASCADE;
DROP TABLE IF EXISTS albums CASCADE;

-- 코스 및 스토리 관련 테이블 삭제
DROP TABLE IF EXISTS courses_routes CASCADE;
DROP TABLE IF EXISTS courses_locations CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;

-- 사용자 관련 테이블 삭제
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =============================================
-- 6. 확장 프로그램 정리 (선택사항)
-- =============================================

-- 필요시 확장 프로그램도 제거할 수 있습니다 (주석 처리)
-- DROP EXTENSION IF EXISTS "postgis" CASCADE;
-- DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- =============================================
-- 7. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE '기존 테이블 삭제 마이그레이션이 완료되었습니다!';
    RAISE NOTICE '=============================================';
    RAISE NOTICE '삭제된 항목들:';
    RAISE NOTICE '- 모든 외래키 제약조건';
    RAISE NOTICE '- 모든 트리거';
    RAISE NOTICE '- 모든 커스텀 함수';
    RAISE NOTICE '- 모든 인덱스';
    RAISE NOTICE '- 모든 테이블';
    RAISE NOTICE '=============================================';
    RAISE NOTICE '이제 새로운 스키마를 적용할 수 있습니다.';
    RAISE NOTICE '다음 마이그레이션: 20250127_001_integrated_schema.sql';
    RAISE NOTICE '=============================================';
END $$;
