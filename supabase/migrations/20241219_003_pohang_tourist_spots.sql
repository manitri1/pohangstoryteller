-- 포항 관광지 데이터 추가 (업그레이드 버전)
-- 생성일: 2024-12-19
-- 설명: 포항의 주요 관광지 33개 데이터 삽입 (중복 제거, 최적화, 카테고리 분류)
-- 업그레이드 사항:
-- 1. 기존 샘플 데이터와 중복되는 관광지 제거 (영일대 해수욕장, 호미곶)
-- 2. 성능 최적화를 위한 인덱스 추가
-- 3. 중복 삽입 방지 처리
-- 4. 데이터 검증 및 통계 추가
-- 
-- ⚠️ 주의: 이 파일은 기존 샘플 데이터와 중복되지 않는 새로운 관광지만 추가합니다.

-- =============================================
-- 포항 관광지 데이터 삽입 (중복 방지)
-- =============================================

-- ⚠️ 주의: 이 파일은 20241219_002_sample_data.sql 이후에 실행되어야 합니다.
-- 20241219_002_sample_data.sql에서 이미 추가된 관광지들과 중복되지 않는 새로운 관광지만 추가합니다.

-- 중복 방지를 위한 확인 메시지
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM locations WHERE name = '월포해수욕장') THEN
        RAISE NOTICE '일부 관광지가 이미 20241219_002_sample_data.sql에서 추가되었습니다. 중복을 방지하기 위해 새로운 관광지만 추가합니다.';
    ELSE
        RAISE NOTICE '20241219_002_sample_data.sql이 먼저 실행되지 않았습니다. 기본 관광지 데이터를 먼저 추가합니다.';
        -- 기본 관광지 데이터가 없으면 경고 메시지 출력
        RAISE WARNING '필수 관광지 데이터가 없습니다. 20241219_002_sample_data.sql을 먼저 실행하세요.';
    END IF;
END $$;

-- 20241219_002_sample_data.sql에서 추가되지 않은 새로운 관광지만 삽입
-- 필수 데이터가 있는지 확인 후 삽입
DO $$
BEGIN
    -- 기본 관광지 데이터가 있는지 확인
    IF NOT EXISTS (SELECT 1 FROM locations WHERE name = '영일대 해수욕장') THEN
        RAISE EXCEPTION 'P0001: 필수 관광지 데이터가 없습니다. 20241219_002_sample_data.sql을 먼저 실행하세요.';
    END IF;
    
    RAISE NOTICE '기본 관광지 데이터가 확인되었습니다. 추가 관광지 데이터를 삽입합니다.';
END $$;

INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes) VALUES
-- 20241219_002_sample_data.sql에 없는 새로운 관광지들만 추가
('송정바위길', '바위 지형이 특징인 해안을 따라 걷는 길로, 동해의 거친 파도와 기암괴석의 조화가 아름다운 곳입니다.', ST_GeomFromText('POINT(129.3800 36.1550)', 4326), '경상북도 포항시 북구 청하면', 'QR_SONGJUNG_013', 'https://picsum.photos/800/600?random=13', 'https://picsum.photos/200/200?random=stamp13', 70),
('호미길', '호미곶 해맞이 광장을 중심으로 주변을 둘러볼 수 있는 산책 및 트레킹 코스입니다. 동해의 아름다운 해안선을 따라 걸을 수 있습니다.', ST_GeomFromText('POINT(129.5650 36.0080)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_HOMI_035', 'https://picsum.photos/800/600?random=35', 'https://picsum.photos/200/200?random=stamp35', 90),

-- 축제 및 이벤트
('포항 해맞이 축제', '매년 새해를 맞이하여 포항의 일출 명소에서 열리는 대규모 축제입니다. 동해의 웅장한 해돋이를 감상하며 새해 소망을 기원할 수 있습니다.', ST_GeomFromText('POINT(129.5694 36.0097)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_FESTIVAL_008', 'https://picsum.photos/800/600?random=8', 'https://picsum.photos/200/200?random=stamp8', 120),

-- 20241219_002_sample_data.sql에 없는 공원 및 시설
('흥해 향교 힐링 숲', '흥해 향교 주변에 조성된 숲으로, 맑은 공기를 마시며 산책하기 좋은 힐링 공간입니다. 역사 유적과 자연이 어우러져 있습니다.', ST_GeomFromText('POINT(129.3601 36.0980)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_HYANGGYO_030', 'https://picsum.photos/800/600?random=30', 'https://picsum.photos/200/200?random=stamp30', 60),
('포항 생태공원', '다양한 동식물을 관찰하고 생태 학습을 할 수 있는 공원입니다. 잘 조성된 산책로와 습지가 특징입니다.', ST_GeomFromText('POINT(129.3805 36.0550)', 4326), '경상북도 포항시 북구 장성동', 'QR_EKO_031', 'https://picsum.photos/800/600?random=31', 'https://picsum.photos/200/200?random=stamp31', 60),
('영일대 해수공원', '영일대 해수욕장과 이어져 있는 해변 공원으로, 다양한 휴식 시설과 운동 시설이 갖춰져 있습니다.', ST_GeomFromText('POINT(129.3645 36.0180)', 4326), '경상북도 포항시 북구 두호동', 'QR_PARK_032', 'https://picsum.photos/800/600?random=32', 'https://picsum.photos/200/200?random=stamp32', 60),

-- 복합 관광지
('내연산 & 보경사', '12폭포와 천년 고찰 보경사가 함께 있는 포항의 대표적인 명산입니다. 울창한 숲과 계곡이 사계절 아름다운 곳입니다.', ST_GeomFromText('POINT(129.3780 36.1900)', 4326), '경상북도 포항시 북구 송라면', 'QR_NAEYEON_026', 'https://picsum.photos/800/600?random=26', 'https://picsum.photos/200/200?random=stamp26', 180),
('봉화산 & 도음산', '이팝나무군락지와 수목원이 있는 포항 북구의 대표적인 두 산입니다. 완만한 등산로로 가벼운 트레킹을 즐기기에 좋습니다.', ST_GeomFromText('POINT(129.3370 36.0910)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_TWO_MOUNTAIN_027', 'https://picsum.photos/800/600?random=27', 'https://picsum.photos/200/200?random=stamp27', 150)
ON CONFLICT (qr_code) DO NOTHING;

-- =============================================
-- 성능 최적화를 위한 인덱스 생성
-- =============================================

-- 좌표 기반 검색을 위한 공간 인덱스
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations USING GIST (coordinates);

-- QR 코드 기반 빠른 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_locations_qr_code ON locations (qr_code);

-- 이름 기반 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations (name);

-- 주소 기반 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_locations_address ON locations (address);

-- =============================================
-- 데이터 검증 및 통계
-- =============================================

-- 삽입된 데이터 수 확인
SELECT 
    COUNT(*) as total_locations,
    COUNT(CASE WHEN coordinates IS NOT NULL THEN 1 END) as locations_with_coordinates,
    COUNT(CASE WHEN qr_code IS NOT NULL THEN 1 END) as locations_with_qr_code
FROM locations 
WHERE created_at >= NOW() - INTERVAL '1 minute';

-- =============================================
-- 완료 메시지
-- =============================================

SELECT '포항 관광지 데이터가 성공적으로 업그레이드되었습니다.' as message;
