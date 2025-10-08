-- =============================================
-- course_categories 데이터 생성 및 연결
-- =============================================

-- 1. course_categories 테이블에 데이터 삽입 (이미 존재하는 경우 무시)
INSERT INTO course_categories (name, description, icon_url, color) VALUES
('자연경관', '포항의 아름다운 자연을 만끽하는 여행', '/icons/nature.svg', '#10B981'),
('역사여행', '포항의 역사와 문화를 탐험하는 여행', '/icons/history.svg', '#8B5CF6'),
('맛집탐방', '포항의 맛있는 음식과 카페를 찾아 떠나는 여행', '/icons/food.svg', '#F59E0B'),
('골목산책', '포항의 숨겨진 골목과 지역 문화를 발견하는 여행', '/icons/walk.svg', '#3B82F6')
ON CONFLICT (name) DO NOTHING;

-- 2. courses 테이블의 category_id 업데이트
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
    RAISE NOTICE '자연경관: %, 역사여행: %, 맛집탐방: %, 골목산책: %', natural_id, history_id, food_id, walk_id;
END $$;

-- 3. 연결 결과 확인
SELECT 
    c.title,
    cc.name as category_name,
    cc.color as category_color
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id
ORDER BY c.title;
