-- 포항 스토리텔러 기존 테이블 정리 마이그레이션
-- 생성일: 2025-01-10
-- 설명: 새로운 통합 마이그레이션 적용 전 기존 테이블들을 안전하게 삭제
-- Supabase Migration SQL Guideline 준수

-- =============================================
-- 1. 실행 전 안전 확인
-- =============================================

-- 현재 데이터베이스 상태 확인
SELECT 
    'Current Database Status' as status,
    current_database() as database_name,
    current_user as current_user,
    version() as postgres_version;

-- 기존 테이블 목록 확인
SELECT 
    'Existing Tables' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- =============================================
-- 2. 외래키 제약조건 비활성화
-- =============================================

-- 세션 복제 역할을 replica로 설정하여 외래키 제약조건 우회
SET session_replication_role = replica;

-- =============================================
-- 3. 트리거 삭제 (함수 삭제 전에 먼저 실행)
-- =============================================

-- 알려진 테이블들의 트리거를 안전하게 삭제
-- 테이블이 존재하는 경우에만 트리거 삭제
DO $$
BEGIN
    -- profiles 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
    END IF;
    
    -- user_preferences 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
    END IF;
    
    -- courses 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') THEN
        DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
    END IF;
    
    -- locations 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'locations') THEN
        DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
    END IF;
    
    -- user_stamps 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_stamps') THEN
        DROP TRIGGER IF EXISTS update_user_stamps_updated_at ON user_stamps;
    END IF;
    
    -- stamp_collections 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stamp_collections') THEN
        DROP TRIGGER IF EXISTS update_stamp_collections_updated_at ON stamp_collections;
    END IF;
    
    -- albums 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'albums') THEN
        DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
    END IF;
    
    -- media_files 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_files') THEN
        DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
    END IF;
    
    -- posts 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
    END IF;
    
    -- comments 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
        DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
    END IF;
    
    -- souvenir_orders 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'souvenir_orders') THEN
        DROP TRIGGER IF EXISTS update_souvenir_orders_updated_at ON souvenir_orders;
    END IF;
    
    -- stamps 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stamps') THEN
        DROP TRIGGER IF EXISTS update_stamps_updated_at ON stamps;
    END IF;
    
    -- souvenirs 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'souvenirs') THEN
        DROP TRIGGER IF EXISTS update_souvenirs_updated_at ON souvenirs;
    END IF;
    
    -- stamp_achievements 관련 트리거
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stamp_achievements') THEN
        DROP TRIGGER IF EXISTS update_stamp_achievements_updated_at ON stamp_achievements;
    END IF;
    
    -- chat_sessions 관련 트리거 (추가)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_sessions') THEN
        DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
    END IF;
END $$;

-- 통계 업데이트 트리거들 (강제 삭제)
-- update_post_stats 함수에 의존하는 트리거들을 먼저 삭제
DO $$
BEGIN
    -- likes 테이블의 update_like_count 트리거 삭제
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'likes') THEN
        DROP TRIGGER IF EXISTS update_like_count ON likes CASCADE;
    END IF;
    
    -- comments 테이블의 update_comment_count 트리거 삭제
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
        DROP TRIGGER IF EXISTS update_comment_count ON comments CASCADE;
    END IF;
    
    -- bookmarks 테이블의 update_bookmark_count 트리거 삭제
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookmarks') THEN
        DROP TRIGGER IF EXISTS update_bookmark_count ON bookmarks CASCADE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Specific trigger deletion error (ignored): %', SQLERRM;
END $$;

-- 모든 트리거를 강제로 삭제
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    -- 모든 트리거를 강제로 삭제 (외래키 제약조건 트리거 제외)
    FOR trigger_record IN 
        SELECT schemaname, tablename, triggername
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.tgname NOT LIKE 'RI_%'  -- 외래키 제약조건 트리거 제외
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.triggername || ' ON ' || trigger_record.tablename || ' CASCADE';
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Trigger deletion error (ignored): %', SQLERRM;
END $$;

-- 함수 삭제는 테이블 삭제 후에 실행하도록 이동

-- =============================================
-- 4. 모든 테이블 동적 삭제
-- =============================================

-- 모든 public 스키마의 테이블을 동적으로 조회하고 삭제
DO $$
DECLARE
    table_record RECORD;
    table_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 모든 테이블 조회 및 삭제 순서 결정
    FOR table_record IN 
        SELECT table_name
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        table_list := array_append(table_list, table_record.table_name);
        RAISE NOTICE 'Found table: %', table_record.table_name;
    END LOOP;
    
    -- 테이블 목록 출력
    RAISE NOTICE 'Total tables to delete: %', array_length(table_list, 1);
    
    -- 모든 테이블을 CASCADE로 삭제
    FOREACH table_record.table_name IN ARRAY table_list LOOP
        BEGIN
            EXECUTE 'DROP TABLE IF EXISTS ' || table_record.table_name || ' CASCADE';
            RAISE NOTICE 'Deleted table: %', table_record.table_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error deleting table %: %', table_record.table_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'All tables deletion completed';
END $$;

-- =============================================
-- 4.8 모든 함수 동적 삭제 (테이블 삭제 후 실행)
-- =============================================

-- 모든 public 스키마의 함수를 동적으로 조회하고 삭제
DO $$
DECLARE
    func_record RECORD;
    func_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 모든 함수 조회
    FOR func_record IN 
        SELECT routine_name, routine_type
        FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_type = 'FUNCTION'
        ORDER BY routine_name
    LOOP
        func_list := array_append(func_list, func_record.routine_name);
        RAISE NOTICE 'Found function: %', func_record.routine_name;
    END LOOP;
    
    -- 함수 목록 출력
    RAISE NOTICE 'Total functions to delete: %', array_length(func_list, 1);
    
    -- 모든 함수를 CASCADE로 삭제
    FOREACH func_record.routine_name IN ARRAY func_list LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || '() CASCADE';
            RAISE NOTICE 'Deleted function: %', func_record.routine_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error deleting function %: %', func_record.routine_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'All functions deletion completed';
END $$;

-- =============================================
-- 5. 모든 인덱스 동적 삭제
-- =============================================

-- 모든 public 스키마의 인덱스를 동적으로 조회하고 삭제
DO $$
DECLARE
    idx_record RECORD;
    idx_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 모든 인덱스 조회 (시스템 인덱스 제외)
    FOR idx_record IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
        AND indexname NOT LIKE 'pg_%'
        AND indexname NOT LIKE '%_pkey'
        ORDER BY indexname
    LOOP
        idx_list := array_append(idx_list, idx_record.indexname);
        RAISE NOTICE 'Found index: %', idx_record.indexname;
    END LOOP;
    
    -- 인덱스 목록 출력
    RAISE NOTICE 'Total indexes to delete: %', array_length(idx_list, 1);
    
    -- 모든 인덱스를 CASCADE로 삭제
    FOREACH idx_record.indexname IN ARRAY idx_list LOOP
        BEGIN
            EXECUTE 'DROP INDEX IF EXISTS ' || idx_record.indexname || ' CASCADE';
            RAISE NOTICE 'Deleted index: %', idx_record.indexname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error deleting index %: %', idx_record.indexname, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'All indexes deletion completed';
END $$;

-- =============================================
-- 6. 모든 RLS 정책 동적 삭제
-- =============================================

-- 모든 public 스키마의 RLS 정책을 동적으로 조회하고 삭제
DO $$
DECLARE
    policy_record RECORD;
    policy_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 모든 RLS 정책 조회
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname
    LOOP
        policy_list := array_append(policy_list, policy_record.tablename || '.' || policy_record.policyname);
        RAISE NOTICE 'Found policy: % on table %', policy_record.policyname, policy_record.tablename;
    END LOOP;
    
    -- 정책 목록 출력
    RAISE NOTICE 'Total policies to delete: %', array_length(policy_list, 1);
    
    -- 모든 RLS 정책을 삭제
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.tablename;
            RAISE NOTICE 'Deleted policy: % on table %', policy_record.policyname, policy_record.tablename;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error deleting policy % on table %: %', policy_record.policyname, policy_record.tablename, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'All RLS policies deletion completed';
END $$;

-- =============================================
-- 7. 모든 시퀀스 동적 삭제
-- =============================================

-- 모든 public 스키마의 시퀀스를 동적으로 조회하고 삭제
DO $$
DECLARE
    seq_record RECORD;
    seq_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 모든 시퀀스 조회
    FOR seq_record IN 
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
        ORDER BY sequence_name
    LOOP
        seq_list := array_append(seq_list, seq_record.sequence_name);
        RAISE NOTICE 'Found sequence: %', seq_record.sequence_name;
    END LOOP;
    
    -- 시퀀스 목록 출력
    RAISE NOTICE 'Total sequences to delete: %', array_length(seq_list, 1);
    
    -- 모든 시퀀스를 CASCADE로 삭제
    FOREACH seq_record.sequence_name IN ARRAY seq_list LOOP
        BEGIN
            EXECUTE 'DROP SEQUENCE IF EXISTS ' || seq_record.sequence_name || ' CASCADE';
            RAISE NOTICE 'Deleted sequence: %', seq_record.sequence_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error deleting sequence %: %', seq_record.sequence_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'All sequences deletion completed';
END $$;

-- =============================================
-- 8. 외래키 제약조건 재활성화
-- =============================================

-- 세션 복제 역할을 기본값으로 복원
SET session_replication_role = DEFAULT;

-- =============================================
-- 9. 정리 완료 확인
-- =============================================

-- 남아있는 테이블 확인
SELECT 
    'Remaining Tables' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 남아있는 함수 확인
SELECT 
    'Remaining Functions' as status,
    COUNT(*) as function_count
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- 남아있는 인덱스 확인
SELECT 
    'Remaining Indexes' as status,
    COUNT(*) as index_count
FROM pg_indexes 
WHERE schemaname = 'public';

-- =============================================
-- 10. 완료 메시지
-- =============================================

SELECT '포항 스토리텔러 기존 테이블 정리가 완료되었습니다. 새로운 마이그레이션을 적용할 준비가 되었습니다.' as message;

-- =============================================
-- 11. 다음 단계 안내
-- =============================================

SELECT 
    'Next Steps' as step,
    'Execute the following migrations in order:' as instruction
UNION ALL
SELECT '1', '20250110_001_initial_schema.sql - Create new integrated schema (25 tables, indexes, RLS policies)'
UNION ALL
SELECT '2', '20250110_002_sample_data.sql - Insert sample data (categories, locations, courses, templates)'
UNION ALL
SELECT '3', '20250110_003_community_functions.sql - Create community functions (search, popular posts, user stats)'
UNION ALL
SELECT '4', '20250110_004_ai_recommendation_system.sql - Create AI recommendation system (collaborative, content-based, hybrid)'
UNION ALL
SELECT '5', '20250110_005_execution_guide.sql - Verification and monitoring (data integrity, performance)';
