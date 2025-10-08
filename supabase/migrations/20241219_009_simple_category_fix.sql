-- =============================================
-- 간단한 course_categories 연결 해결
-- =============================================

-- 1. 모든 코스에 기본 카테고리 할당
UPDATE courses 
SET category_id = (
    SELECT id FROM course_categories LIMIT 1
)
WHERE category_id IS NULL;

-- 2. 연결 결과 확인
SELECT 
    c.title,
    cc.name as category_name,
    cc.color as category_color
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id
ORDER BY c.title;

-- 3. 카테고리별 코스 수 확인
SELECT 
    cc.name as category_name,
    COUNT(c.id) as course_count
FROM course_categories cc
LEFT JOIN courses c ON cc.id = c.category_id
GROUP BY cc.name, cc.id
ORDER BY course_count DESC;
