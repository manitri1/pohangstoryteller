-- 포항 스토리 텔러 모든 테이블 삭제 스크립트
-- 생성일: 2024-12-19
-- 설명: 개발/테스트 환경에서 모든 테이블과 데이터를 완전히 삭제
-- ⚠️ 주의: 이 스크립트는 모든 데이터를 영구적으로 삭제합니다. 프로덕션 환경에서는 사용하지 마세요.

-- =============================================
-- 1. 외래키 제약조건 비활성화 (삭제 순서 문제 해결)
-- =============================================

-- 세션 설정으로 외래키 제약조건을 일시적으로 비활성화
SET session_replication_role = replica;

-- =============================================
-- 2. 사용자 관련 테이블 삭제
-- =============================================

-- 사용자 참여 데이터 테이블들 (의존성 순서대로)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shares CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS album_items CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS stamps CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =============================================
-- 3. 코스 및 스토리 관련 테이블 삭제
-- =============================================

-- 코스 관련 테이블들 (의존성 순서대로)
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS course_locations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;

-- =============================================
-- 4. 방문지 및 위치 관련 테이블 삭제
-- =============================================

-- 방문지 테이블
DROP TABLE IF EXISTS locations CASCADE;

-- =============================================
-- 5. DIY 기념품 관련 테이블 삭제
-- =============================================

-- 템플릿 관련 테이블들
DROP TABLE IF EXISTS templates CASCADE;

-- =============================================
-- 6. 함수 및 트리거 삭제
-- =============================================

-- updated_at 트리거 함수 삭제
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =============================================
-- 7. 인덱스 삭제 (테이블과 함께 자동 삭제되지만 명시적으로)
-- =============================================

-- 공간 인덱스들
DROP INDEX IF EXISTS idx_locations_coordinates;
DROP INDEX IF EXISTS idx_locations_qr_code;
DROP INDEX IF EXISTS idx_locations_name;
DROP INDEX IF EXISTS idx_locations_address;

-- 기타 인덱스들
DROP INDEX IF EXISTS idx_courses_category;
DROP INDEX IF EXISTS idx_courses_featured;
DROP INDEX IF EXISTS idx_courses_active;
DROP INDEX IF EXISTS idx_stamps_user;
DROP INDEX IF EXISTS idx_stamps_location;
DROP INDEX IF EXISTS idx_albums_user;
DROP INDEX IF EXISTS idx_posts_author;
DROP INDEX IF EXISTS idx_posts_public;
DROP INDEX IF EXISTS idx_posts_hashtags;
DROP INDEX IF EXISTS idx_likes_user_post;
DROP INDEX IF EXISTS idx_comments_post;
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_chat_messages_session;

-- =============================================
-- 8. RLS 정책 삭제 (테이블과 함께 자동 삭제되지만 명시적으로)
-- =============================================

-- 모든 RLS 정책은 테이블 삭제 시 자동으로 삭제됩니다.
-- 하지만 명시적으로 확인하기 위해 정책들을 나열합니다.

-- =============================================
-- 9. 확장 프로그램 정리 (선택사항)
-- =============================================

-- 필요에 따라 확장 프로그램도 제거할 수 있습니다.
-- 주의: 다른 프로젝트에서 사용 중일 수 있으므로 신중하게 결정하세요.
-- DROP EXTENSION IF EXISTS "postgis" CASCADE;
-- DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- =============================================
-- 10. 외래키 제약조건 재활성화
-- =============================================

-- 세션 설정을 원래대로 복원
SET session_replication_role = DEFAULT;

-- =============================================
-- 11. 삭제 확인 및 정리
-- =============================================

-- 남은 테이블이 있는지 확인
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'sql_%'
ORDER BY tablename;

-- =============================================
-- 12. 완료 메시지
-- =============================================

SELECT '포항 스토리 텔러의 모든 테이블이 성공적으로 삭제되었습니다.' as message;

-- =============================================
-- 13. 추가 정리 (필요시)
-- =============================================

-- 시퀀스 정리 (테이블과 함께 자동 삭제되지만 확인용)
-- SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public';

-- 뷰 정리 (만약 뷰가 있다면)
-- DROP VIEW IF EXISTS view_name CASCADE;

-- 도메인 정리 (만약 커스텀 도메인이 있다면)
-- DROP DOMAIN IF EXISTS domain_name CASCADE;
