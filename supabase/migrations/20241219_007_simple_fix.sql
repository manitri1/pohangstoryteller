-- =============================================
-- 간단한 해결 방법: category_id를 NULL로 설정
-- =============================================

-- courses 테이블의 category_id를 NULL로 설정하여 조인 문제 해결
UPDATE courses SET category_id = NULL;

-- 또는 기본 카테고리로 설정
DO $$
DECLARE
    default_category_id UUID;
BEGIN
    -- 첫 번째 카테고리를 기본값으로 사용
    SELECT id INTO default_category_id FROM course_categories LIMIT 1;
    
    -- 모든 코스에 기본 카테고리 할당
    UPDATE courses SET category_id = default_category_id WHERE category_id IS NULL;
    
    RAISE NOTICE '기본 카테고리 할당 완료: %', default_category_id;
END $$;
