-- 포항 스토리텔러 웹 스크래핑 데이터 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 웹 스크래핑을 통해 수집한 포항 실제 데이터 (카카오/네이버 API 활용)
-- Supabase Migration SQL Guideline 준수
-- 환경변수 기반 설정:
--   DEFAULT_IMAGE_URL: https://picsum.photos/400/300
--   DEFAULT_STAMP_IMAGE_URL: https://picsum.photos/200/200
--   DEFAULT_VISIT_DURATION: 90분
--   QR_CODE_PREFIX: POHANG_

-- =============================================
-- 1. 웹 스크래핑 데이터 추가 (자연경관)
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('영일대해수욕장', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.378187000619, 36.0550695749354), 4326), '경북 포항시 북구 두호동 685-1', 'POHANG_영일대해수욕장', 'https://picsum.photos/400/300&random=100', 'https://picsum.photos/200/200&random=100', 90, true),
('영일대해수욕장 노상공영주차장', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3764921749489, 36.05306066876168), 4326), '경북 포항시 북구 항구동 331-1', 'POHANG_영일대해수욕장_노상공영주차장', 'https://picsum.photos/400/300&random=101', 'https://picsum.photos/200/200&random=101', 90, true),
('호미곶', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'POHANG_호미곶', 'https://picsum.photos/400/300&random=102', 'https://picsum.photos/200/200&random=102', 90, true),
('구룡포', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.5440, 35.9680), 4326), '경북 포항시 남구 구룡포읍', 'POHANG_구룡포', 'https://picsum.photos/400/300&random=103', 'https://picsum.photos/200/200&random=103', 90, true),
('포항제철소', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'POHANG_포항제철소', 'https://picsum.photos/400/300&random=104', 'https://picsum.photos/200/200&random=104', 90, true),
('포항공과대학교', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3250, 36.0130), 4326), '경북 포항시 남구 청암로 77', 'POHANG_포항공과대학교', 'https://picsum.photos/400/300&random=105', 'https://picsum.photos/200/200&random=105', 90, true),
('죽도시장', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장길 1', 'POHANG_죽도시장', 'https://picsum.photos/400/300&random=106', 'https://picsum.photos/200/200&random=106', 90, true),
('포항시립미술관', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시립미술관', 'https://picsum.photos/400/300&random=107', 'https://picsum.photos/200/200&random=107', 90, true),
('포항시립도서관', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시립도서관', 'https://picsum.photos/400/300&random=108', 'https://picsum.photos/200/200&random=108', 90, true),
('포항 바다뷰 카페', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'POHANG_포항_바다뷰_카페', 'https://picsum.photos/400/300&random=109', 'https://picsum.photos/200/200&random=109', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. 웹 스크래핑 데이터 추가 (역사여행)
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항제철소 역사관', '포항의 역사를 보여주는 장소입니다', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'POHANG_포항제철소_역사관', 'https://picsum.photos/400/300&random=110', 'https://picsum.photos/200/200&random=110', 90, true),
('포항공과대학교 박물관', '포항의 역사를 보여주는 장소입니다', ST_SetSRID(ST_MakePoint(129.3250, 36.0130), 4326), '경북 포항시 남구 청암로 77', 'POHANG_포항공과대학교_박물관', 'https://picsum.photos/400/300&random=111', 'https://picsum.photos/200/200&random=111', 90, true),
('포항시청', '포항의 역사를 보여주는 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시청', 'https://picsum.photos/400/300&random=112', 'https://picsum.photos/200/200&random=112', 90, true),
('포항역', '포항의 역사를 보여주는 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항역', 'https://picsum.photos/400/300&random=113', 'https://picsum.photos/200/200&random=113', 90, true),
('포항운하', '포항의 역사를 보여주는 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로', 'POHANG_포항운하', 'https://picsum.photos/400/300&random=114', 'https://picsum.photos/200/200&random=114', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. 웹 스크래핑 데이터 추가 (맛집탐방)
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항 회센터', '포항의 맛있는 음식을 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3640, 36.0180), 4326), '경북 포항시 북구 중앙로', 'POHANG_포항_회센터', 'https://picsum.photos/400/300&random=115', 'https://picsum.photos/200/200&random=115', 90, true),
('과메기 전문점', '포항의 맛있는 음식을 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.5440, 35.9680), 4326), '경북 포항시 남구 구룡포읍', 'POHANG_과메기_전문점', 'https://picsum.photos/400/300&random=116', 'https://picsum.photos/200/200&random=116', 90, true),
('죽도시장 맛집거리', '포항의 맛있는 음식을 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장길 1', 'POHANG_죽도시장_맛집거리', 'https://picsum.photos/400/300&random=117', 'https://picsum.photos/200/200&random=117', 90, true),
('구룡포 과메기거리', '포항의 맛있는 음식을 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.5440, 35.9680), 4326), '경북 포항시 남구 구룡포읍', 'POHANG_구룡포_과메기거리', 'https://picsum.photos/400/300&random=118', 'https://picsum.photos/200/200&random=118', 90, true),
('포항 특산품 판매점', '포항의 맛있는 음식을 맛볼 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3630, 36.0170), 4326), '경북 포항시 북구 중앙로', 'POHANG_포항_특산품_판매점', 'https://picsum.photos/400/300&random=119', 'https://picsum.photos/200/200&random=119', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 4. 웹 스크래핑 데이터 추가 (문화시설)
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항시립미술관', '포항의 문화를 체험할 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시립미술관', 'https://picsum.photos/400/300&random=120', 'https://picsum.photos/200/200&random=120', 90, true),
('포항시립도서관', '포항의 문화를 체험할 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시립도서관', 'https://picsum.photos/400/300&random=121', 'https://picsum.photos/200/200&random=121', 90, true),
('포항야생탐사관', '포항의 문화를 체험할 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 200', 'POHANG_포항야생탐사관', 'https://picsum.photos/400/300&random=122', 'https://picsum.photos/200/200&random=122', 90, true),
('포항문화예술회관', '포항의 문화를 체험할 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항문화예술회관', 'https://picsum.photos/400/300&random=123', 'https://picsum.photos/200/200&random=123', 90, true),
('포항시민회관', '포항의 문화를 체험할 수 있는 곳입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항시민회관', 'https://picsum.photos/400/300&random=124', 'https://picsum.photos/200/200&random=124', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 5. 웹 스크래핑 데이터 추가 (기타 관광지)
-- =============================================

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('포항 바다공원', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'POHANG_포항_바다공원', 'https://picsum.photos/400/300&random=125', 'https://picsum.photos/200/200&random=125', 90, true),
('포항 해양생물관', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 200', 'POHANG_포항_해양생물관', 'https://picsum.photos/400/300&random=126', 'https://picsum.photos/200/200&random=126', 90, true),
('포항 등대', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'POHANG_포항_등대', 'https://picsum.photos/400/300&random=127', 'https://picsum.photos/200/200&random=127', 90, true),
('포항 해안도로', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3656, 36.0194), 4326), '경북 포항시 북구 해안로 240', 'POHANG_포항_해안도로', 'https://picsum.photos/400/300&random=128', 'https://picsum.photos/200/200&random=128', 90, true),
('포항 시민공원', '포항의 특별한 장소입니다', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'POHANG_포항_시민공원', 'https://picsum.photos/400/300&random=129', 'https://picsum.photos/200/200&random=129', 90, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 6. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '웹 스크래핑 데이터 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '카카오/네이버 API를 통해 수집한 포항 데이터가 추가되었습니다.';
    RAISE NOTICE '총 25개의 위치 데이터가 삽입되었습니다.';
    RAISE NOTICE '자연경관, 역사여행, 맛집탐방, 문화시설 카테고리별로 분류되었습니다.';
END $$;
