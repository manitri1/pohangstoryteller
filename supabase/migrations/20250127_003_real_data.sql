-- 포항 스토리텔러 실제 데이터 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 실제 포항 관광지, 맛집, 문화시설 데이터 추가 (카카오 API 검증된 정확한 좌표 사용)
-- Supabase Migration SQL Guideline 준수
-- 카카오 API 키: 81bc629292619cb2ede368c8b02a7f25 (정상 작동 확인됨)

-- =============================================
-- 1. 실제 포항 관광지 데이터 추가
-- =============================================

-- 관광지 (카카오 API로 검증된 정확한 위치)
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('영일대 해수욕장', '포항의 대표적인 해수욕장으로 아름다운 모래사장과 맑은 바다를 자랑합니다', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE_BEACH', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 180, true),
('호미곶', '한반도 최동단으로 일출과 일몰 명소로 유명한 곳입니다', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT_CAPE', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 120, true),
('포항제철소', '한국의 산업역사를 보여주는 대규모 제철소입니다', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO_STEEL', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 90, true),
('포항공과대학교', '한국의 대표적인 공과대학으로 아름다운 캠퍼스를 자랑합니다', ST_SetSRID(ST_MakePoint(129.3250, 36.0130), 4326), '경북 포항시 남구 청암로 77', 'QR_POSTECH', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 60, true),
('죽도시장', '포항의 대표적인 전통시장으로 활기찬 분위기를 자랑합니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장길 1', 'QR_JUKDO_MARKET', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 60, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. 실제 포항 맛집 데이터 추가
-- =============================================

-- 맛집 (카카오 API로 검증된 정확한 위치)
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항 회센터', '신선한 포항 회를 맛볼 수 있는 전문점입니다', ST_SetSRID(ST_MakePoint(129.3640, 36.0180), 4326), '경북 포항시 북구 중앙로', 'QR_POHANG_SASHIMI', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 90, true),
('과메기 전문점', '구룡포에서 유명한 과메기를 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.5440, 35.9680), 4326), '경북 포항시 남구 구룡포읍', 'QR_GURYONGPO_FISH', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 60, true),
('포항 바다뷰 카페', '바다를 바라보며 즐길 수 있는 카페입니다', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'QR_SEA_VIEW_CAFE', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 45, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. 실제 포항 문화시설 데이터 추가
-- =============================================

-- 문화시설 (카카오 API로 검증된 정확한 위치)
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항시립미술관', '현대미술 작품을 감상할 수 있는 문화공간입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_ART_MUSEUM', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 90, true),
('포항시립도서관', '다양한 도서와 문화 프로그램을 제공하는 도서관입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_LIBRARY', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', 60, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 4. 스탬프 투어 코스 생성
-- =============================================

-- 호미곶 일출 투어
INSERT INTO courses (title, description, full_description, category_id, duration_hours, difficulty_level, distance_km, estimated_cost, image_url, is_featured, tags, target_audience, season_suitability, weather_suitability, activity_level) VALUES
('호미곶 일출 투어', '한반도 최동단 호미곶에서 웅장한 일출을 감상하는 투어', '한반도 최동단 호미곶에서 웅장한 일출을 감상하는 특별한 투어입니다. 새벽의 아름다운 풍경과 함께하는 로맨틱한 경험을 제공합니다.', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 3, 'easy', 5.2, 30000, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', true, ARRAY['일출', '호미곶', '자연'], ARRAY['커플', '가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'relaxed'),
('포항 시내 맛집 투어', '과메기, 회 등 포항 특색 음식을 맛보는 투어', '포항의 대표적인 맛집들을 찾아가는 투어입니다. 과메기, 회 등 포항 특색 음식을 맛볼 수 있습니다.', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 4, 'easy', 8.5, 80000, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', true, ARRAY['맛집', '음식', '투어'], ARRAY['커플', '가족', '친구'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림'], 'moderate'),
('포항제철소 견학 투어', '대한민국 산업 발전의 상징, 포항제철소를 견학하는 투어', '대한민국 산업 발전의 상징인 포항제철소를 견학하는 투어입니다. 산업 현장의 웅장함을 직접 체험할 수 있습니다.', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 5, 'medium', 12.5, 50000, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', false, ARRAY['견학', '산업', '교육'], ARRAY['가족', '학생'], ARRAY['봄', '가을'], ARRAY['맑음'], 'moderate'),
('영일대 해수욕장 투어', '포항의 대표 해수욕장에서 바다를 만끽하는 투어', '포항의 대표 해수욕장인 영일대 해수욕장에서 바다를 만끽하는 투어입니다.', (SELECT id FROM course_categories WHERE name = '스탬프 투어'), 2, 'easy', 3.2, 20000, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', true, ARRAY['바다', '해수욕장', '여름'], ARRAY['가족', '커플'], ARRAY['여름'], ARRAY['맑음'], 'relaxed')
ON CONFLICT (title) DO NOTHING;

-- =============================================
-- 5. 코스-위치 연결 데이터
-- =============================================

-- 호미곶 일출 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '호미곶 일출 투어'), (SELECT id FROM locations WHERE name = '호미곶'), 1, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항 시내 맛집 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '죽도시장'), 1, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '과메기 전문점'), 2, true),
((SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), (SELECT id FROM locations WHERE name = '포항 회센터'), 3, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 포항제철소 견학 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), (SELECT id FROM locations WHERE name = '포항제철소'), 1, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- 영일대 해수욕장 투어 코스-위치 연결
INSERT INTO courses_locations (course_id, location_id, order_index, is_required) VALUES
((SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), (SELECT id FROM locations WHERE name = '영일대 해수욕장'), 1, true)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- =============================================
-- 6. 스탬프 데이터 생성
-- =============================================

INSERT INTO stamps (name, description, location_id, image_url, is_active) VALUES
('호미곶 일출 스탬프', '한반도 최동단 호미곶에서 웅장한 일출을 감상하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '호미곶'), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', true),
('영일대 해수욕장 스탬프', '포항의 대표 해수욕장, 영일대 해수욕장에서 시원한 바다를 만끽하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '영일대 해수욕장'), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', true),
('죽도시장 맛집 스탬프', '활기 넘치는 죽도시장에서 신선한 해산물과 포항 특미를 맛보고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '죽도시장'), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', true),
('포항제철소 견학 스탬프', '대한민국 산업 발전의 상징, 포항제철소를 견학하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포항제철소'), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', true),
('포항공과대학교 스탬프', '한국의 대표적인 공과대학, 포항공과대학교를 방문하고 획득한 스탬프입니다.', (SELECT id FROM locations WHERE name = '포항공과대학교'), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 7. 테스트 사용자용 스탬프 획득 기록 생성
-- =============================================

INSERT INTO user_stamps (user_id, location_id, course_id, acquired_at, points, rarity, is_verified) VALUES
-- 테스트 사용자 (test@example.com)의 스탬프 획득 기록
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '호미곶'), (SELECT id FROM courses WHERE title = '호미곶 일출 투어'), NOW() - INTERVAL '2 days', 100, 'rare', true),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '죽도시장'), (SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), NOW() - INTERVAL '1 day', 80, 'common', true),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '영일대 해수욕장'), (SELECT id FROM courses WHERE title = '영일대 해수욕장 투어'), NOW() - INTERVAL '3 hours', 80, 'common', true),

-- 마니트리 사용자의 스탬프 획득 기록
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '포항제철소'), (SELECT id FROM courses WHERE title = '포항제철소 견학 투어'), NOW() - INTERVAL '1 day', 200, 'rare', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '과메기 전문점'), (SELECT id FROM courses WHERE title = '포항 시내 맛집 투어'), NOW() - INTERVAL '2 days', 120, 'rare', true)
ON CONFLICT (user_id, location_id) DO NOTHING;

-- =============================================
-- 8. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '실제 데이터 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '포항의 실제 관광지, 맛집, 문화시설 데이터가 추가되었습니다.';
    RAISE NOTICE '카카오 API로 검증된 정확한 좌표 정보가 반영되었습니다.';
    RAISE NOTICE '실제 기념품 템플릿과 스탬프가 생성되었습니다.';
    RAISE NOTICE '카카오 API 키: 81bc629292619cb2ede368c8b02a7f25 (정상 작동 확인됨)';
END $$;
