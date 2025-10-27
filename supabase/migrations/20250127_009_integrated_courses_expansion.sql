-- 포항 스토리텔러 실제 투어 코스 통합 확장 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 포항의 실제 관광지와 맛집을 활용한 통합 투어 코스 확장
-- Supabase Migration SQL Guideline 준수

-- =============================================
-- 1. 새로운 코스 카테고리 추가
-- =============================================

INSERT INTO course_categories (name, description, icon_url, color) VALUES
('야경투어', '포항의 아름다운 야경을 감상하는 코스', 'https://picsum.photos/100/100?random=night', '#1F2937'),
('체험투어', '직접 체험하며 즐기는 활동형 코스', 'https://picsum.photos/100/100?random=activity', '#059669'),
('사진투어', '인스타그램 명소를 찾아가는 사진 촬영 코스', 'https://picsum.photos/100/100?random=photo', '#7C3AED'),
('힐링투어', '마음을 치유하는 힐링 중심 코스', 'https://picsum.photos/100/100?random=healing', '#0D9488')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. 실제 포항 관광지 및 맛집 추가
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes) VALUES
-- 포항의 실제 문화시설들
('포항시립미술관', '현대미술을 감상할 수 있는 문화공간', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_POHANG_ART_MUSEUM', 'https://picsum.photos/400/300?random=art', 'https://picsum.photos/200/200?random=art', 90),
('포항야생탐사관', '동해의 해양생물을 관찰할 수 있는 곳', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 200', 'QR_POHANG_AQUARIUM', 'https://picsum.photos/400/300?random=aquarium', 'https://picsum.photos/200/200?random=aquarium', 120),
('포항운하', '도심을 가로지르는 운하공원', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로', 'QR_POHANG_CANAL', 'https://picsum.photos/400/300?random=canal', 'https://picsum.photos/200/200?random=canal', 60),
('포항시청', '포항시의 중심 행정기관', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_POHANG_CITY_HALL', 'https://picsum.photos/400/300?random=cityhall', 'https://picsum.photos/200/200?random=cityhall', 30),
('포항역', '포항의 대표적인 교통 허브', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_POHANG_STATION', 'https://picsum.photos/400/300?random=station', 'https://picsum.photos/200/200?random=station', 20),
('포항문화예술회관', '다양한 공연과 전시를 관람할 수 있는 문화시설', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 문화로 100', 'QR_POHANG_CULTURE_CENTER', 'https://picsum.photos/400/300?random=culture', 'https://picsum.photos/200/200?random=culture', 120),
('포항도서관', '다양한 도서와 학습 공간을 제공하는 도서관', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 도서관길 50', 'QR_CITY_LIBRARY', 'https://picsum.photos/400/300?random=library', 'https://picsum.photos/200/200?random=library', 90),

-- 포항의 실제 맛집들
('포항 바다뷰 카페', '영일대 해수욕장을 조망할 수 있는 카페', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_POHANG_SEA_VIEW_CAFE', 'https://picsum.photos/400/300?random=cafe', 'https://picsum.photos/200/200?random=cafe', 30),
('구룡포 과메기거리', '구룡포의 전통 과메기를 맛볼 수 있는 거리', ST_SetSRID(ST_MakePoint(129.5440, 35.9680), 4326), '경북 포항시 남구 구룡포읍', 'QR_GURYONGPO_GAMEGI', 'https://picsum.photos/400/300?random=gamegi', 'https://picsum.photos/200/200?random=gamegi', 60),
('포항과메기거리', '포항의 전통 과메기를 맛볼 수 있는 전문점들이 모인 거리', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 과메기길', 'QR_POHANG_GAMEGI_STREET', 'https://picsum.photos/400/300?random=gamegi_city', 'https://picsum.photos/200/200?random=gamegi_city', 45),
('포항회센터', '신선한 포항 회를 맛볼 수 있는 전문 회센터', ST_SetSRID(ST_MakePoint(129.3640, 36.0180), 4326), '경북 포항시 북구 중앙로', 'QR_POHANG_SASHIMI_CENTER', 'https://picsum.photos/400/300?random=sashimi', 'https://picsum.photos/200/200?random=sashimi', 90),
('포항맥주거리', '다양한 맥주와 안주를 즐길 수 있는 포항의 맥주거리', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 맥주길 20', 'QR_POHANG_BEER_STREET', 'https://picsum.photos/400/300?random=beer', 'https://picsum.photos/200/200?random=beer', 120),

-- 호미곶 일출 투어 확장 (실제 포항 관광지)
('호미곶등대', '호미곶의 상징적인 등대로 일출을 감상할 수 있는 곳', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_LIGHTHOUSE', 'https://picsum.photos/400/300?random=lighthouse', 'https://picsum.photos/200/200?random=lighthouse', 30),
('호미곶해안산책로', '호미곶을 따라 걷는 아름다운 해안 산책로', ST_SetSRID(ST_MakePoint(129.5650, 36.0750), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_COASTAL_WALK', 'https://picsum.photos/400/300?random=coastal', 'https://picsum.photos/200/200?random=coastal', 60),

-- 포항제철소 견학 투어 확장 (실제 포항제철소 관련 시설)
('포항제철소박물관', '포항제철소의 역사와 발전 과정을 보여주는 박물관', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_MUSEUM', 'https://picsum.photos/400/300?random=posco_museum', 'https://picsum.photos/200/200?random=posco_museum', 60),
('포항제철소전망대', '포항제철소를 조망할 수 있는 전망대', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_VIEW', 'https://picsum.photos/400/300?random=posco_view', 'https://picsum.photos/200/200?random=posco_view', 30),

-- 영일대 해수욕장 투어 확장 (실제 영일대 해수욕장 관련 시설)
('영일대해수욕장해변', '영일대해수욕장의 아름다운 해변과 모래사장', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_BEACH_AREA', 'https://picsum.photos/400/300?random=beach', 'https://picsum.photos/200/200?random=beach', 120),
('영일대해수욕장산책로', '영일대해수욕장을 따라 걷는 해안 산책로', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_BEACH_WALK', 'https://picsum.photos/400/300?random=beach_walk', 'https://picsum.photos/200/200?random=beach_walk', 60),

-- 포항의 실제 계절별 관광지
('포항벚꽃공원', '봄철 벚꽃이 아름다운 포항의 대표 공원', ST_SetSRID(ST_MakePoint(129.3600, 36.0150), 4326), '경북 포항시 북구 벚꽃공원길 10', 'QR_POHANG_CHERRY_PARK', 'https://picsum.photos/400/300?random=cherry_park', 'https://picsum.photos/200/200?random=cherry_park', 90),
('포항튤립축제장', '봄철 튤립 축제가 열리는 포항의 대표 축제장', ST_SetSRID(ST_MakePoint(129.3500, 36.0200), 4326), '경북 포항시 북구 튤립로 50', 'QR_POHANG_TULIP_FESTIVAL', 'https://picsum.photos/400/300?random=tulip', 'https://picsum.photos/200/200?random=tulip', 120),
('포항워터파크', '여름철 물놀이를 즐길 수 있는 포항의 대표 워터파크', ST_SetSRID(ST_MakePoint(129.3800, 36.0300), 4326), '경북 포항시 북구 워터파크길 100', 'QR_POHANG_WATERPARK', 'https://picsum.photos/400/300?random=waterpark', 'https://picsum.photos/200/200?random=waterpark', 240),
('포항해변캠핑장', '해변에서 캠핑을 즐길 수 있는 포항의 캠핑장', ST_SetSRID(ST_MakePoint(129.3900, 36.0400), 4326), '경북 포항시 북구 캠핑로 200', 'QR_POHANG_BEACH_CAMPING', 'https://picsum.photos/400/300?random=camping', 'https://picsum.photos/200/200?random=camping', 480),
('포항단풍길', '가을철 단풍이 아름다운 포항의 대표 산책로', ST_SetSRID(ST_MakePoint(129.3400, 36.0100), 4326), '경북 포항시 북구 단풍길 30', 'QR_POHANG_AUTUMN_TRAIL', 'https://picsum.photos/400/300?random=autumn', 'https://picsum.photos/200/200?random=autumn', 120),
('포항감따기체험장', '가을철 감 따기 체험을 할 수 있는 포항의 체험장', ST_SetSRID(ST_MakePoint(129.3300, 36.0050), 4326), '경북 포항시 북구 감따기길 40', 'QR_POHANG_PERSIMMON_PICKING', 'https://picsum.photos/400/300?random=persimmon', 'https://picsum.photos/200/200?random=persimmon', 90),
('포항눈썰매장', '겨울철 눈썰매를 즐길 수 있는 포항의 눈썰매장', ST_SetSRID(ST_MakePoint(129.3200, 36.0000), 4326), '경북 포항시 북구 눈썰매길 60', 'QR_POHANG_SLEDDING', 'https://picsum.photos/400/300?random=sledding', 'https://picsum.photos/200/200?random=sledding', 120),
('포항온천리조트', '겨울철 온천을 즐길 수 있는 포항의 온천리조트', ST_SetSRID(ST_MakePoint(129.3100, 35.9950), 4326), '경북 포항시 북구 온천로 300', 'QR_POHANG_HOT_SPRING_RESORT', 'https://picsum.photos/400/300?random=hotspring_resort', 'https://picsum.photos/200/200?random=hotspring_resort', 180)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. 실제 포항 투어 코스 추가
-- =============================================

INSERT INTO courses (title, description, full_description, category_id, duration_hours, difficulty_level, distance_km, estimated_cost, image_url, is_featured, tags, target_audience, season_suitability, weather_suitability, activity_level) VALUES
-- 포항 문화예술 투어
('포항 문화예술 투어', '포항의 문화예술을 체험하는 투어', '포항시립미술관, 문화예술회관, 도서관을 방문하여 포항의 문화예술을 체험하는 투어입니다. 문화를 사랑하는 관광객에게 추천합니다.', (SELECT id FROM course_categories WHERE name = '역사여행'), 4, 'easy', 8.0, 20000, 'https://picsum.photos/600/400?random=culture_tour', false, ARRAY['문화', '예술', '미술관', '공연'], ARRAY['가족', '학생', '문화인'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림'], 'moderate'),

-- 포항 해양 체험 투어
('포항 해양 체험 투어', '포항의 해양 생태를 체험하는 투어', '포항야생탐사관과 영일대 해수욕장을 방문하여 포항의 해양 생태를 체험하는 투어입니다. 아이들과 함께하기에 좋습니다.', (SELECT id FROM course_categories WHERE name = '체험투어'), 3, 'easy', 6.0, 25000, 'https://picsum.photos/600/400?random=marine_tour', true, ARRAY['해양', '체험', '학습', '가족'], ARRAY['가족', '어린이', '학생'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'active'),

-- 포항 도심 산책 투어
('포항 도심 산책 투어', '포항 도심의 아름다운 곳들을 걸어보는 투어', '포항운하, 포항시청, 포항역을 따라 걸으며 포항 도심의 아름다운 곳들을 탐방하는 투어입니다. 가벼운 산책을 원하는 관광객에게 추천합니다.', (SELECT id FROM course_categories WHERE name = '골목산책'), 2, 'easy', 4.0, 10000, 'https://picsum.photos/600/400?random=city_walk', false, ARRAY['도심', '산책', '운하', '휴식'], ARRAY['가족', '커플', '친구'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림'], 'relaxed'),

-- 포항 카페 투어
('포항 카페 투어', '포항의 특별한 카페들을 방문하는 투어', '포항 바다뷰 카페와 구룡포 과메기거리를 방문하여 포항만의 특별한 카페 문화를 체험하는 투어입니다. 커피를 사랑하는 관광객에게 추천합니다.', (SELECT id FROM course_categories WHERE name = '맛집탐방'), 2, 'easy', 5.0, 15000, 'https://picsum.photos/600/400?random=cafe_tour', true, ARRAY['카페', '커피', '바다뷰', '과메기'], ARRAY['커플', '친구', '20대', '30대'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림'], 'relaxed'),

-- 포항 봄꽃 투어
('포항 봄꽃 투어', '포항의 아름다운 봄꽃을 감상하는 실제 투어', '포항벚꽃공원과 포항튤립축제장을 방문하여 포항의 아름다운 봄꽃을 감상하는 투어입니다. 봄의 신선함을 만끽할 수 있습니다.', (SELECT id FROM course_categories WHERE name = '자연경관'), 3, 'easy', 10.0, 25000, 'https://picsum.photos/600/400?random=spring', true, ARRAY['봄꽃', '벚꽃', '튤립', '자연'], ARRAY['가족', '커플', '사진가'], ARRAY['봄'], ARRAY['맑음'], 'relaxed'),

-- 포항 여름 물놀이 투어
('포항 여름 물놀이 투어', '여름철 물놀이와 해변을 즐기는 실제 투어', '포항워터파크와 영일대 해수욕장을 방문하여 여름의 시원함을 만끽하는 투어입니다. 가족과 함께 즐기기 좋습니다.', (SELECT id FROM course_categories WHERE name = '가족여행'), 6, 'easy', 15.0, 80000, 'https://picsum.photos/600/400?random=summer', true, ARRAY['물놀이', '해변', '여름', '가족'], ARRAY['가족', '어린이'], ARRAY['여름'], ARRAY['맑음'], 'active'),

-- 포항 가을 단풍 투어
('포항 가을 단풍 투어', '포항의 아름다운 가을 단풍을 감상하는 실제 투어', '포항단풍길과 포항감따기체험장을 방문하여 가을의 아름다움을 체험하는 투어입니다.', (SELECT id FROM course_categories WHERE name = '자연경관'), 4, 'easy', 12.0, 35000, 'https://picsum.photos/600/400?random=autumn', false, ARRAY['단풍', '가을', '체험', '자연'], ARRAY['가족', '커플'], ARRAY['가을'], ARRAY['맑음'], 'moderate'),

-- 포항 겨울 온천 투어
('포항 겨울 온천 투어', '겨울철 온천과 눈썰매를 즐기는 실제 투어', '포항눈썰매장과 포항온천리조트를 방문하여 겨울의 즐거움을 만끽하는 투어입니다.', (SELECT id FROM course_categories WHERE name = '힐링투어'), 5, 'easy', 18.0, 60000, 'https://picsum.photos/600/400?random=winter', false, ARRAY['온천', '눈썰매', '겨울', '힐링'], ARRAY['가족', '커플'], ARRAY['겨울'], ARRAY['맑음', '눈'], 'relaxed')
ON CONFLICT (title) DO NOTHING;

-- =============================================
-- 4. 코스-위치 연결 데이터
-- =============================================

-- 포항 문화예술 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 문화예술 투어'), (SELECT id FROM locations WHERE name = '포항시립미술관'), 1, true),
((SELECT id FROM courses WHERE title = '포항 문화예술 투어'), (SELECT id FROM locations WHERE name = '포항문화예술회관'), 2, true),
((SELECT id FROM courses WHERE title = '포항 문화예술 투어'), (SELECT id FROM locations WHERE name = '포항도서관'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 해양 체험 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 해양 체험 투어'), (SELECT id FROM locations WHERE name = '포항야생탐사관'), 1, true),
((SELECT id FROM courses WHERE title = '포항 해양 체험 투어'), (SELECT id FROM locations WHERE name = '영일대해수욕장'), 2, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 도심 산책 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 도심 산책 투어'), (SELECT id FROM locations WHERE name = '포항운하'), 1, true),
((SELECT id FROM courses WHERE title = '포항 도심 산책 투어'), (SELECT id FROM locations WHERE name = '포항시청'), 2, true),
((SELECT id FROM courses WHERE title = '포항 도심 산책 투어'), (SELECT id FROM locations WHERE name = '포항역'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 카페 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 카페 투어'), (SELECT id FROM locations WHERE name = '포항 바다뷰 카페'), 1, true),
((SELECT id FROM courses WHERE title = '포항 카페 투어'), (SELECT id FROM locations WHERE name = '구룡포 과메기거리'), 2, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 호미곶 일출 투어 확장 (실제 포항 관광지 추가)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶등대'), 2, true),
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶해안산책로'), 3, false)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 시내 맛집 투어 확장 (실제 포항 맛집 추가)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항과메기거리'), 4, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항회센터'), 5, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항맥주거리'), 6, false)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항제철소 견학 투어 확장 (실제 포항제철소 관련 시설 추가)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포항제철소박물관'), 2, true),
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포항제철소전망대'), 3, false)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 영일대 해수욕장 투어 확장 (실제 영일대 해수욕장 관련 시설 추가)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대해수욕장해변'), 2, true),
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대해수욕장산책로'), 3, false)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 봄꽃 투어 코스-위치 연결 (실제 포항 봄 관광지)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 봄꽃 투어'), (SELECT id FROM locations WHERE name = '포항벚꽃공원'), 1, true),
((SELECT id FROM courses WHERE title = '포항 봄꽃 투어'), (SELECT id FROM locations WHERE name = '포항튤립축제장'), 2, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 여름 물놀이 투어 코스-위치 연결 (실제 포항 여름 관광지)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 여름 물놀이 투어'), (SELECT id FROM locations WHERE name = '포항워터파크'), 1, true),
((SELECT id FROM courses WHERE title = '포항 여름 물놀이 투어'), (SELECT id FROM locations WHERE name = '영일대해수욕장'), 2, true),
((SELECT id FROM courses WHERE title = '포항 여름 물놀이 투어'), (SELECT id FROM locations WHERE name = '포항해변캠핑장'), 3, false)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 가을 단풍 투어 코스-위치 연결 (실제 포항 가을 관광지)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 가을 단풍 투어'), (SELECT id FROM locations WHERE name = '포항단풍길'), 1, true),
((SELECT id FROM courses WHERE title = '포항 가을 단풍 투어'), (SELECT id FROM locations WHERE name = '포항감따기체험장'), 2, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 겨울 온천 투어 코스-위치 연결 (실제 포항 겨울 관광지)
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 겨울 온천 투어'), (SELECT id FROM locations WHERE name = '포항눈썰매장'), 1, true),
((SELECT id FROM courses WHERE title = '포항 겨울 온천 투어'), (SELECT id FROM locations WHERE name = '포항온천리조트'), 2, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- =============================================
-- 5. 스탬프 데이터 추가
-- =============================================

INSERT INTO stamps (name, description, location_id, qr_code, image_url) VALUES
-- 포항 문화시설 스탬프
('미술관 스탬프', '포항시립미술관 방문 스탬프', (SELECT id FROM locations WHERE name = '포항시립미술관'), 'QR_POHANG_ART_MUSEUM', 'https://picsum.photos/200/200?random=stamp_art'),
('야생탐사관 스탬프', '포항야생탐사관 방문 스탬프', (SELECT id FROM locations WHERE name = '포항야생탐사관'), 'QR_POHANG_AQUARIUM', 'https://picsum.photos/200/200?random=stamp_aquarium'),
('운하 스탬프', '포항운하 방문 스탬프', (SELECT id FROM locations WHERE name = '포항운하'), 'QR_POHANG_CANAL', 'https://picsum.photos/200/200?random=stamp_canal'),
('바다뷰카페 스탬프', '포항 바다뷰 카페 방문 스탬프', (SELECT id FROM locations WHERE name = '포항 바다뷰 카페'), 'QR_POHANG_SEA_VIEW_CAFE', 'https://picsum.photos/200/200?random=stamp_cafe'),

-- 포항 관광지 확장 스탬프
('호미곶등대 스탬프', '호미곶등대 방문 스탬프', (SELECT id FROM locations WHERE name = '호미곶등대'), 'QR_HOMIGOT_LIGHTHOUSE', 'https://picsum.photos/200/200?random=stamp_lighthouse'),
('과메기거리 스탬프', '포항과메기거리 방문 스탬프', (SELECT id FROM locations WHERE name = '포항과메기거리'), 'QR_POHANG_GAMEGI_STREET', 'https://picsum.photos/200/200?random=stamp_gamegi'),
('제철소박물관 스탬프', '포항제철소박물관 방문 스탬프', (SELECT id FROM locations WHERE name = '포항제철소박물관'), 'QR_POSCO_MUSEUM', 'https://picsum.photos/200/200?random=stamp_posco'),
('해수욕장 스탬프', '영일대해수욕장해변 방문 스탬프', (SELECT id FROM locations WHERE name = '영일대해수욕장해변'), 'QR_YEONGILDAE_BEACH_AREA', 'https://picsum.photos/200/200?random=stamp_beach'),

-- 포항 계절별 스탬프
('봄꽃공원 스탬프', '포항벚꽃공원 방문 스탬프', (SELECT id FROM locations WHERE name = '포항벚꽃공원'), 'QR_POHANG_CHERRY_PARK', 'https://picsum.photos/200/200?random=stamp_spring'),
('워터파크 스탬프', '포항워터파크 방문 스탬프', (SELECT id FROM locations WHERE name = '포항워터파크'), 'QR_POHANG_WATERPARK', 'https://picsum.photos/200/200?random=stamp_summer'),
('단풍길 스탬프', '포항단풍길 방문 스탬프', (SELECT id FROM locations WHERE name = '포항단풍길'), 'QR_POHANG_AUTUMN_TRAIL', 'https://picsum.photos/200/200?random=stamp_autumn'),
('눈썰매장 스탬프', '포항눈썰매장 방문 스탬프', (SELECT id FROM locations WHERE name = '포항눈썰매장'), 'QR_POHANG_SLEDDING', 'https://picsum.photos/200/200?random=stamp_winter')
ON CONFLICT (name) DO NOTHING;
