-- 포항 스토리텔러 Mockup 데이터를 Supabase로 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 기존 mockup 데이터를 실제 Supabase 테이블에 삽입

-- =============================================
-- 1. 스탬프 투어 데이터 마이그레이션
-- =============================================

-- 스탬프 투어를 위한 코스 카테고리 추가
INSERT INTO course_categories (name, description, icon_url, color) VALUES
('스탬프 투어', 'QR 스탬프를 수집하는 투어', 'https://picsum.photos/100/100?random=stamp', '#10B981')
ON CONFLICT (name) DO NOTHING;

-- 스탬프 투어 코스 생성
INSERT INTO courses (title, description, category_id, duration_minutes, difficulty, distance_km, estimated_cost, image_url, is_featured, tags, target_audience, season_suitability, weather_suitability, activity_level) VALUES
('호미곶 일출 투어', '한반도 최동단 호미곶에서 웅장한 일출을 감상하는 투어', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 180, 'easy', 5.2, 30000, 'https://picsum.photos/600/400?random=homigot', true, ARRAY['일출', '호미곶', '자연'], ARRAY['커플', '가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'relaxed'),
('포항 시내 맛집 투어', '과메기, 회 등 포항 특색 음식을 맛보는 투어', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 240, 'easy', 8.5, 80000, 'https://picsum.photos/600/400?random=food', true, ARRAY['맛집', '음식', '투어'], ARRAY['커플', '가족', '친구'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림'], 'moderate'),
('포항제철소 견학 투어', '대한민국 산업 발전의 상징, 포항제철소를 견학하는 투어', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 300, 'medium', 12.5, 50000, 'https://picsum.photos/600/400?random=posco', false, ARRAY['견학', '산업', '교육'], ARRAY['가족', '학생'], ARRAY['봄', '가을'], ARRAY['맑음'], 'moderate'),
('영일대 해수욕장 투어', '포항의 대표 해수욕장에서 바다를 만끽하는 투어', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 120, 'easy', 3.2, 20000, 'https://picsum.photos/600/400?random=beach', true, ARRAY['바다', '해수욕장', '여름'], ARRAY['가족', '커플'], ARRAY['여름'], ARRAY['맑음'], 'relaxed')
ON CONFLICT (title) DO NOTHING;

-- =============================================
-- 2. 스탬프 위치 데이터 마이그레이션
-- =============================================

-- 스탬프 위치 데이터 삽입
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
-- 호미곶 투어 위치들
('호미곶 일출 포인트', '한반도 최동단에서 일출을 감상하는 곳', ST_SetSRID(ST_MakePoint(129.5678, 36.0789), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_SUNRISE', 'https://picsum.photos/400/300?random=101', 'https://picsum.photos/200/200?random=101', 60, true),
('호미곶 등대', '호미곶의 상징인 등대', ST_SetSRID(ST_MakePoint(129.5679, 36.079), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_LIGHTHOUSE', 'https://picsum.photos/400/300?random=102', 'https://picsum.photos/200/200?random=102', 30, true),
('호미곶 기념비', '한반도 최동단 기념비', ST_SetSRID(ST_MakePoint(129.5677, 36.0788), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_MEMORIAL', 'https://picsum.photos/400/300?random=103', 'https://picsum.photos/200/200?random=103', 20, true),

-- 맛집 투어 위치들
('죽도시장', '활기 넘치는 죽도시장에서 신선한 해산물과 포항 특미를 맛보는 곳', ST_SetSRID(ST_MakePoint(129.365, 36.019), 4326), '경북 포항시 북구 죽도시장길 1', 'QR_JUKDO_MARKET', 'https://picsum.photos/400/300?random=104', 'https://picsum.photos/200/200?random=104', 90, true),
('구룡포 과메기 거리', '구룡포에서 유명한 과메기를 맛보는 곳', ST_SetSRID(ST_MakePoint(129.544, 35.968), 4326), '경북 포항시 남구 구룡포읍', 'QR_GURYONGPO_FISH', 'https://picsum.photos/400/300?random=105', 'https://picsum.photos/200/200?random=105', 60, true),
('포항 회 전문점', '신선한 포항 회를 맛보는 곳', ST_SetSRID(ST_MakePoint(129.364, 36.018), 4326), '경북 포항시 북구 중앙로', 'QR_POHANG_SASHIMI', 'https://picsum.photos/400/300?random=106', 'https://picsum.photos/200/200?random=106', 45, true),
('포항 특산품 판매점', '포항의 특산품을 구매하는 곳', ST_SetSRID(ST_MakePoint(129.363, 36.017), 4326), '경북 포항시 북구 중앙로', 'QR_POHANG_SPECIALTY', 'https://picsum.photos/400/300?random=107', 'https://picsum.photos/200/200?random=107', 30, true),

-- 포항제철소 투어 위치들
('포항제철소', '대한민국 산업 발전의 상징, 포항제철소를 견학하는 곳', ST_SetSRID(ST_MakePoint(129.4, 36.1), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_TOUR', 'https://picsum.photos/400/300?random=108', 'https://picsum.photos/200/200?random=108', 90, true),
('포스코 박물관', '포스코의 역사와 철강 산업을 배우는 곳', ST_SetSRID(ST_MakePoint(129.401, 36.101), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_MUSEUM', 'https://picsum.photos/400/300?random=109', 'https://picsum.photos/200/200?random=109', 60, true),
('포스코 혁신관', '포스코의 혁신 기술을 체험하는 곳', ST_SetSRID(ST_MakePoint(129.402, 36.102), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_INNOVATION', 'https://picsum.photos/400/300?random=110', 'https://picsum.photos/200/200?random=110', 45, true),

-- 영일대 해수욕장 투어 위치들
('영일대 해수욕장', '포항의 대표 해수욕장, 영일대 해수욕장에서 시원한 바다를 만끽하는 곳', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_BEACH', 'https://picsum.photos/400/300?random=111', 'https://picsum.photos/200/200?random=111', 120, true),
('영일대 일몰 포인트', '영일대에서 아름다운 일몰을 감상하는 곳', ST_SetSRID(ST_MakePoint(129.366, 36.02), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_SUNSET', 'https://picsum.photos/400/300?random=112', 'https://picsum.photos/200/200?random=112', 60, true),
('영일대 해양 활동장', '영일대에서 해양 활동을 체험하는 곳', ST_SetSRID(ST_MakePoint(129.3652, 36.0188), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_ACTIVITIES', 'https://picsum.photos/400/300?random=113', 'https://picsum.photos/200/200?random=113', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. 스탬프 데이터 마이그레이션
-- =============================================

-- 스탬프 데이터 삽입
INSERT INTO stamps (name, description, location_id, image_url, is_active) VALUES
-- 호미곶 투어 스탬프들
('호미곶 일출 스탬프', '한반도 최동단 호미곶에서 웅장한 일출을 감상하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '호미곶 일출 포인트'), 'https://picsum.photos/200/200?random=101', true),
('호미곶 등대 스탬프', '호미곶의 상징인 등대에서 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '호미곶 등대'), 'https://picsum.photos/200/200?random=102', true),
('호미곶 기념비 스탬프', '한반도 최동단 기념비에서 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '호미곶 기념비'), 'https://picsum.photos/200/200?random=103', true),

-- 맛집 투어 스탬프들
('죽도시장 맛집 스탬프', '활기 넘치는 죽도시장에서 신선한 해산물과 포항 특미를 맛보고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '죽도시장'), 'https://picsum.photos/200/200?random=104', true),
('구룡포 과메기 스탬프', '구룡포에서 유명한 과메기를 맛보고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '구룡포 과메기 거리'), 'https://picsum.photos/200/200?random=105', true),
('포항 회 스탬프', '신선한 포항 회를 맛보고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포항 회 전문점'), 'https://picsum.photos/200/200?random=106', true),
('포항 특산품 스탬프', '포항의 특산품을 구매하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포항 특산품 판매점'), 'https://picsum.photos/200/200?random=107', true),

-- 포항제철소 투어 스탬프들
('포항제철소 견학 스탬프', '대한민국 산업 발전의 상징, 포항제철소를 견학하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포항제철소'), 'https://picsum.photos/200/200?random=108', true),
('포스코 박물관 스탬프', '포스코의 역사와 철강 산업을 배우고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포스코 박물관'), 'https://picsum.photos/200/200?random=109', true),
('포스코 혁신관 스탬프', '포스코의 혁신 기술을 체험하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포스코 혁신관'), 'https://picsum.photos/200/200?random=110', true),

-- 영일대 해수욕장 투어 스탬프들
('영일대 해수욕장 스탬프', '포항의 대표 해수욕장, 영일대 해수욕장에서 시원한 바다를 만끽하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '영일대 해수욕장'), 'https://picsum.photos/200/200?random=111', true),
('영일대 일몰 스탬프', '영일대에서 아름다운 일몰을 감상하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '영일대 일몰 포인트'), 'https://picsum.photos/200/200?random=112', true),
('영일대 해양 활동 스탬프', '영일대에서 해양 활동을 체험하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '영일대 해양 활동장'), 'https://picsum.photos/200/200?random=113', true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 4. 코스-위치 연결 데이터 마이그레이션
-- =============================================

-- 호미곶 일출 투어 코스-위치 연결
INSERT INTO course_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶 일출 포인트'), 1, true),
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶 등대'), 2, true),
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶 기념비'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 시내 맛집 투어 코스-위치 연결
INSERT INTO course_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '죽도시장'), 1, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '구룡포 과메기 거리'), 2, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항 회 전문점'), 3, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항 특산품 판매점'), 4, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항제철소 견학 투어 코스-위치 연결
INSERT INTO course_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포항제철소'), 1, true),
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포스코 박물관'), 2, true),
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포스코 혁신관'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 영일대 해수욕장 투어 코스-위치 연결
INSERT INTO course_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대 해수욕장'), 1, true),
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대 일몰 포인트'), 2, true),
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대 해양 활동장'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- =============================================
-- 5. 테스트 사용자용 스탬프 획득 기록 생성
-- =============================================

-- 테스트 사용자가 일부 스탬프를 획득한 것으로 설정
INSERT INTO user_stamps (user_id, location_id, course_id, acquired_at, points, rarity, is_verified) VALUES
-- 테스트 사용자 (test@example.com)의 스탬프 획득 기록
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '호미곶 일출 포인트'), (SELECT id FROM courses WHERE title = '호미곶 일출 투어'), NOW() - INTERVAL '2 days', 100, 'rare', true),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '죽도시장'), (SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), NOW() - INTERVAL '1 day', 80, 'common', true),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '영일대 해수욕장'), (SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), NOW() - INTERVAL '3 hours', 80, 'common', true),

-- 마니트리 사용자의 스탬프 획득 기록
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '포항제철소'), (SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), NOW() - INTERVAL '1 day', 200, 'rare', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '구룡포 과메기 거리'), (SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), NOW() - INTERVAL '2 days', 120, 'rare', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '영일대 일몰 포인트'), (SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), NOW() - INTERVAL '4 hours', 120, 'rare', true)
ON CONFLICT (user_id, location_id) DO NOTHING;

-- =============================================
-- 6. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Mockup 데이터 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '스탬프 투어 데이터가 Supabase에 삽입되었습니다.';
    RAISE NOTICE '테스트 사용자들의 스탬프 획득 기록이 생성되었습니다.';
END $$;
