-- 포항 스토리텔러 기본 데이터 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 기본 카테고리, 테스트 계정, 샘플 데이터 삽입
-- Supabase Migration SQL Guideline 준수

-- =============================================
-- 1. 코스 카테고리 데이터
-- =============================================

INSERT INTO course_categories (name, description, icon_url, color) VALUES
('자연경관', '포항의 아름다운 자연을 만날 수 있는 코스', 'https://picsum.photos/100/100?random=1', '#10B981'),
('역사여행', '포항의 역사와 문화를 탐방하는 코스', 'https://picsum.photos/100/100?random=2', '#8B5CF6'),
('골목산책', '포항의 숨겨진 골목길을 걸어보는 코스', 'https://picsum.photos/100/100?random=3', '#F59E0B'),
('맛집탐방', '포항의 맛있는 음식을 찾아가는 코스', 'https://picsum.photos/100/100?random=4', '#EF4444'),
('가족여행', '가족과 함께 즐길 수 있는 코스', 'https://picsum.photos/100/100?random=5', '#3B82F6'),
('커플여행', '연인과 함께하는 로맨틱한 코스', 'https://picsum.photos/100/100?random=6', '#EC4899'),
('스탬프 투어', 'QR 스탬프를 수집하는 투어', 'https://picsum.photos/100/100?random=stamp', '#10B981')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. 테스트 계정 생성
-- =============================================

-- 테스트 사용자 생성
INSERT INTO profiles (id, email, name, username, avatar_url, is_verified, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', '테스트 사용자', 'testuser', 'https://picsum.photos/100/100?random=999', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'manitri@naver.com', '마니트리', 'manitri', 'https://picsum.photos/100/100?random=998', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 테스트 사용자 선호도 설정
INSERT INTO user_preferences (user_id, interests, travel_style, budget_range, language, notifications_enabled, privacy_level, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['자연', '역사', '맛집', '사진'], 'relaxed', 'medium', 'ko', true, 'public', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', ARRAY['여행', '사진', '음식', '문화'], 'active', 'high', 'ko', true, 'public', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- 3. 기본 방문지 데이터
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes) VALUES
('죽도시장', '포항의 대표적인 전통시장', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장길 1', 'QR_DEATH_ISLAND_MARKET', 'https://picsum.photos/400/300?random=10', 'https://picsum.photos/200/200?random=110', 60),
('호미곶', '한반도 최동단의 아름다운 해안', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT', 'https://picsum.photos/400/300?random=11', 'https://picsum.photos/200/200?random=111', 120),
('포항제철소', '한국의 산업역사를 보여주는 대규모 제철소', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO', 'https://picsum.photos/400/300?random=12', 'https://picsum.photos/200/200?random=112', 90),
('포항공과대학교', '한국의 대표적인 공과대학', ST_SetSRID(ST_MakePoint(129.3250, 36.0130), 4326), '경북 포항시 남구 청암로 77', 'QR_POSTECH', 'https://picsum.photos/400/300?random=13', 'https://picsum.photos/200/200?random=113', 60),
('포항시립미술관', '현대미술을 감상할 수 있는 문화공간', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_ART_MUSEUM', 'https://picsum.photos/400/300?random=14', 'https://picsum.photos/200/200?random=114', 90),
('영일대해수욕장', '포항의 대표적인 해수욕장', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE', 'https://picsum.photos/400/300?random=15', 'https://picsum.photos/200/200?random=115', 180),
('포항야생탐사관', '동해의 해양생물을 관찰할 수 있는 곳', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 200', 'QR_AQUARIUM', 'https://picsum.photos/400/300?random=16', 'https://picsum.photos/200/200?random=116', 120),
('포항운하', '도심을 가로지르는 운하공원', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로', 'QR_CANAL', 'https://picsum.photos/400/300?random=17', 'https://picsum.photos/200/200?random=117', 60),
('포항시청', '포항시의 중심 행정기관', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_CITY_HALL', 'https://picsum.photos/400/300?random=18', 'https://picsum.photos/200/200?random=118', 30),
('포항역', '포항의 대표적인 교통 허브', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_STATION', 'https://picsum.photos/400/300?random=19', 'https://picsum.photos/200/200?random=119', 20)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 4. 기본 코스 데이터
-- =============================================

INSERT INTO courses (title, description, full_description, category_id, duration_hours, difficulty_level, distance_km, estimated_cost, image_url, is_featured, tags, target_audience, season_suitability, weather_suitability, activity_level) VALUES
('포항 해안선 드라이브', '동해의 아름다운 해안선을 따라가는 드라이브 코스', '포항의 아름다운 바다를 따라 걷는 특별한 여행입니다. 영일대 해수욕장의 모래사장에서 시작하여 구룡포의 운치 있는 풍경을 감상하고, 마지막으로 호미곶에서 일몰을 감상하는 로맨틱한 코스입니다.', (SELECT id FROM course_categories WHERE name = '자연경관'), 3, 'easy', 45.2, 50000, 'https://picsum.photos/600/400?random=20', true, ARRAY['드라이브', '해안', '자연'], ARRAY['커플', '가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음', '흐림'], 'relaxed'),
('포항 역사 탐방', '포항의 역사적 의미를 찾아가는 탐방 코스', '포항의 산업 발전과 교육의 역사를 체험할 수 있는 특별한 코스입니다. 포항제철소의 웅장한 규모를 감상하고, 포항공과대학교의 아름다운 캠퍼스를 둘러보며 포항의 발전 과정을 이해할 수 있습니다.', (SELECT id FROM course_categories WHERE name = '역사여행'), 4, 'medium', 8.5, 30000, 'https://picsum.photos/600/400?random=21', true, ARRAY['역사', '문화', '교육'], ARRAY['가족', '학생'], ARRAY['봄', '가을'], ARRAY['맑음'], 'moderate'),
('포항 골목길 산책', '포항의 숨겨진 골목길을 걸어보는 산책 코스', '포항의 숨겨진 골목길을 걸어보는 산책 코스입니다. 로컬의 정서를 느낄 수 있는 특별한 경험을 제공합니다.', (SELECT id FROM course_categories WHERE name = '골목산책'), 2, 'easy', 3.2, 15000, 'https://picsum.photos/600/400?random=22', false, ARRAY['산책', '골목', '로컬'], ARRAY['커플', '혼자'], ARRAY['봄', '가을'], ARRAY['맑음', '흐림'], 'relaxed'),
('포항 맛집 투어', '포항의 대표적인 맛집들을 찾아가는 투어', '포항의 맛있는 음식들을 찾아다니며 즐거운 시간을 보낼 수 있는 투어입니다.', (SELECT id FROM course_categories WHERE name = '맛집탐방'), 3, 'easy', 5.8, 80000, 'https://picsum.photos/600/400?random=23', true, ARRAY['맛집', '음식', '투어'], ARRAY['커플', '가족', '친구'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림', '비'], 'moderate'),
('포항 가족 체험', '가족과 함께 즐길 수 있는 체험형 코스', '가족과 함께 즐길 수 있는 체험형 코스입니다.', (SELECT id FROM course_categories WHERE name = '가족여행'), 5, 'easy', 12.5, 100000, 'https://picsum.photos/600/400?random=24', false, ARRAY['체험', '가족', '교육'], ARRAY['가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'moderate'),
('포항 로맨틱 데이트', '연인과 함께하는 로맨틱한 데이트 코스', '연인과 함께하는 로맨틱한 데이트 코스입니다.', (SELECT id FROM course_categories WHERE name = '커플여행'), 4, 'easy', 6.8, 120000, 'https://picsum.photos/600/400?random=25', true, ARRAY['데이트', '로맨틱', '커플'], ARRAY['커플'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'relaxed')
ON CONFLICT (title) DO NOTHING;

-- =============================================
-- 5. 기념품 템플릿 데이터
-- =============================================

INSERT INTO souvenir_templates (name, description, template_type, category, base_price, dimensions, materials, is_available) VALUES
('포항 스탬프 앨범', '포항 여행의 추억을 담는 스탬프 앨범', 'album', '기념품', 15000.00, '{"width": 20, "height": 25, "depth": 2}', '{"cover": "가죽", "pages": "종이"}', true),
('호미곶 엽서 세트', '호미곶의 아름다운 풍경이 담긴 엽서 세트', 'postcard', '기념품', 8000.00, '{"width": 15, "height": 10}', '{"paper": "아트지", "finish": "매트"}', true),
('포항 맛집 가이드북', '포항의 맛집 정보가 담긴 가이드북', 'book', '도서', 12000.00, '{"width": 14, "height": 20, "pages": 100}', '{"paper": "코팅지", "binding": "스프링"}', true),
('포항 야생탐사관 스티커팩', '해양생물이 그려진 스티커팩', 'sticker', '기념품', 5000.00, '{"width": 10, "height": 15}', '{"material": "PVC", "finish": "글로시"}', true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 6. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '기본 데이터 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '테스트 계정과 기본 데이터가 생성되었습니다.';
END $$;
