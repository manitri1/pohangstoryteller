-- =============================================
-- course_categories 연결 수정
-- =============================================

-- 기존 courses 테이블의 category_id 업데이트
-- 먼저 카테고리 ID를 가져와서 변수로 설정
DO $$
DECLARE
    natural_id UUID;
    history_id UUID;
    food_id UUID;
    walk_id UUID;
BEGIN
    -- 카테고리 ID 조회
    SELECT id INTO natural_id FROM course_categories WHERE name = '자연경관';
    SELECT id INTO history_id FROM course_categories WHERE name = '역사여행';
    SELECT id INTO food_id FROM course_categories WHERE name = '맛집탐방';
    SELECT id INTO walk_id FROM course_categories WHERE name = '골목산책';
    
    -- courses 테이블의 category_id 업데이트
    UPDATE courses SET category_id = natural_id WHERE title = '포항 바다와 일몰의 만남';
    UPDATE courses SET category_id = history_id WHERE title = '포항 자연과 역사 탐방';
    UPDATE courses SET category_id = natural_id WHERE title = '호미곶 일출 투어';
    UPDATE courses SET category_id = natural_id WHERE title = '포항 지질 명소 탐방';
    UPDATE courses SET category_id = natural_id WHERE title = '포항 해수욕장 완전정복';
    UPDATE courses SET category_id = natural_id WHERE title = '포항 산악 트레킹';
    UPDATE courses SET category_id = history_id WHERE title = '포항 문화유적 탐방';
    UPDATE courses SET category_id = natural_id WHERE title = '포항 공원 힐링';
    UPDATE courses SET category_id = food_id WHERE title = '포항 시장 투어';
    UPDATE courses SET category_id = walk_id WHERE title = '포항 트레킹 코스 완주';
    UPDATE courses SET category_id = natural_id WHERE title = '포항 특별 명소 탐방';
    UPDATE courses SET category_id = history_id WHERE title = '포항 문화시설 투어';
    
    RAISE NOTICE 'course_categories 연결 완료';
END $$;
