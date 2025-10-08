-- 포항 스토리 텔러 샘플 데이터 (복구된 버전)
-- 생성일: 2024-12-19
-- 설명: PostGIS 좌표 타입 오류를 수정하고 원래 데이터를 복구한 샘플 데이터

-- =============================================
-- 1. 샘플 방문지 데이터 (PostGIS 함수 사용)
-- =============================================



-- =============================================
-- 3. 코스-위치 연결 데이터
-- =============================================

INSERT INTO course_locations (course_id, location_id, order_index) VALUES
-- 포항 바다와 일몰의 만남 코스
((SELECT id FROM courses WHERE title = '포항 바다와 일몰의 만남' LIMIT 1), (SELECT id FROM locations WHERE name = '영일대 해수욕장' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 바다와 일몰의 만남' LIMIT 1), (SELECT id FROM locations WHERE name = '구룡포' LIMIT 1), 2),

-- 포항 자연과 역사 탐방 코스
((SELECT id FROM courses WHERE title = '포항 자연과 역사 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '내연산 12폭포' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 자연과 역사 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '보경사' LIMIT 1), 2),

-- 호미곶 일출 투어 코스
((SELECT id FROM courses WHERE title = '호미곶 일출 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '호미곶' LIMIT 1), 1),

-- 포항 지질 명소 탐방 코스
((SELECT id FROM courses WHERE title = '포항 지질 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '오도리 주상절리' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 지질 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '이가리 닻 전망대' LIMIT 1), 2),

-- 포항 해수욕장 완전정복 코스
((SELECT id FROM courses WHERE title = '포항 해수욕장 완전정복' LIMIT 1), (SELECT id FROM locations WHERE name = '월포해수욕장' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 해수욕장 완전정복' LIMIT 1), (SELECT id FROM locations WHERE name = '칠포해수욕장' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 해수욕장 완전정복' LIMIT 1), (SELECT id FROM locations WHERE name = '화진해수욕장' LIMIT 1), 3),
((SELECT id FROM courses WHERE title = '포항 해수욕장 완전정복' LIMIT 1), (SELECT id FROM locations WHERE name = '용한해수욕장' LIMIT 1), 4),

-- 포항 산악 트레킹 코스
((SELECT id FROM courses WHERE title = '포항 산악 트레킹' LIMIT 1), (SELECT id FROM locations WHERE name = '봉화산' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 산악 트레킹' LIMIT 1), (SELECT id FROM locations WHERE name = '도음산' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 산악 트레킹' LIMIT 1), (SELECT id FROM locations WHERE name = '비학산' LIMIT 1), 3),

-- 포항 문화유적 탐방 코스
((SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '국립등대박물관' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '구룡포 과메기문화관' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '연오랑세오녀 테마파크' LIMIT 1), 3),

-- 포항 공원 힐링 코스
((SELECT id FROM courses WHERE title = '포항 공원 힐링' LIMIT 1), (SELECT id FROM locations WHERE name = '침촌근린공원' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 공원 힐링' LIMIT 1), (SELECT id FROM locations WHERE name = '한호공원' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 공원 힐링' LIMIT 1), (SELECT id FROM locations WHERE name = '영일대 해수공원' LIMIT 1), 3),
((SELECT id FROM courses WHERE title = '포항 공원 힐링' LIMIT 1), (SELECT id FROM locations WHERE name = '중명자연생태공원' LIMIT 1), 4),

-- 포항 시장 투어 코스
((SELECT id FROM courses WHERE title = '포항 시장 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '청하 공진시장' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 시장 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '중앙상가' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 시장 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '꿈들로' LIMIT 1), 3),

-- 포항 트레킹 코스 완주
((SELECT id FROM courses WHERE title = '포항 트레킹 코스 완주' LIMIT 1), (SELECT id FROM locations WHERE name = '영일대 해맞이길' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 트레킹 코스 완주' LIMIT 1), (SELECT id FROM locations WHERE name = '주상절리길' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 트레킹 코스 완주' LIMIT 1), (SELECT id FROM locations WHERE name = '조경대길' LIMIT 1), 3),
((SELECT id FROM courses WHERE title = '포항 트레킹 코스 완주' LIMIT 1), (SELECT id FROM locations WHERE name = '연오랑세오녀길' LIMIT 1), 4),

-- 포항 특별 명소 탐방 코스
((SELECT id FROM courses WHERE title = '포항 특별 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '상생의 손' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 특별 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '독수리바위' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 특별 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '발산할오' LIMIT 1), 3),
((SELECT id FROM courses WHERE title = '포항 특별 명소 탐방' LIMIT 1), (SELECT id FROM locations WHERE name = '용연저수지' LIMIT 1), 4),

-- 포항 문화시설 투어 코스
((SELECT id FROM courses WHERE title = '포항 문화시설 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '포항시립중앙아트홀' LIMIT 1), 1),
((SELECT id FROM courses WHERE title = '포항 문화시설 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '포은중앙도서관' LIMIT 1), 2),
((SELECT id FROM courses WHERE title = '포항 문화시설 투어' LIMIT 1), (SELECT id FROM locations WHERE name = '포항함체험관' LIMIT 1), 3)
ON CONFLICT (course_id, location_id) DO NOTHING;

-- =============================================
-- 4. 경로 데이터 (description 포함)
-- =============================================

INSERT INTO routes (course_id, name, waypoints, color, description, stroke_weight, stroke_opacity, is_main_route) VALUES
-- 포항 바다와 일몰의 만남 코스 경로
((SELECT id FROM courses WHERE title = '포항 바다와 일몰의 만남' LIMIT 1), '영일대-구룡포 경로', 
 '[{"lat": 36.0194, "lng": 129.3656}, {"lat": 35.9680, "lng": 129.5440}]', '#3B82F6', 
 '영일대 해수욕장에서 시작하여 구룡포까지 이어지는 아름다운 해안 경로입니다. 동해의 푸른 바다를 따라 걷는 로맨틱한 산책로로, 특히 일몰 시간에 아름다운 풍경을 감상할 수 있습니다.', 3, 0.8, true),

-- 포항 자연과 역사 탐방 코스 경로
((SELECT id FROM courses WHERE title = '포항 자연과 역사 탐방' LIMIT 1), '내연산-보경사 경로', 
 '[{"lat": 36.1956, "lng": 129.3789}, {"lat": 36.1915, "lng": 129.3820}]', '#8B5CF6', 
 '내연산 12폭포에서 시작하여 보경사까지 이어지는 자연과 역사가 어우러진 경로입니다. 울창한 숲과 계곡을 따라 걷다가 천년 고찰의 고즈넉한 분위기를 만끽할 수 있습니다.', 3, 0.8, true),

-- 호미곶 일출 투어 코스 경로
((SELECT id FROM courses WHERE title = '호미곶 일출 투어' LIMIT 1), '호미곶 일출 경로', 
 '[{"lat": 36.0761, "lng": 129.5678}]', '#10B981', 
 '한반도 최동단 호미곶에서 감상하는 웅장한 일출 경로입니다. 상생의 손 조형물을 중심으로 동해의 끝없는 바다를 바라보며 새해 소망을 기원할 수 있는 특별한 경험을 제공합니다.', 3, 0.8, true),

-- 포항 지질 명소 탐방 코스 경로
((SELECT id FROM courses WHERE title = '포항 지질 명소 탐방' LIMIT 1), '지질 명소 경로', 
 '[{"lat": 36.1683, "lng": 129.4087}, {"lat": 36.1764, "lng": 129.4172}]', '#F59E0B', 
 '오도리 주상절리에서 이가리 닻 전망대까지 이어지는 지질 명소 탐방 경로입니다. 자연이 만들어낸 신비로운 지형을 감상하며 포항의 지질학적 가치를 배울 수 있습니다.', 3, 0.8, true),

-- 포항 해수욕장 완전정복 코스 경로
((SELECT id FROM courses WHERE title = '포항 해수욕장 완전정복' LIMIT 1), '해수욕장 투어 경로', 
 '[{"lat": 36.1820, "lng": 129.4005}, {"lat": 36.1580, "lng": 129.3850}, {"lat": 36.2350, "lng": 129.4301}, {"lat": 36.0350, "lng": 129.3705}]', '#3B82F6', 
 '포항의 대표적인 해수욕장들을 모두 방문하는 완전정복 경로입니다. 월포, 칠포, 화진, 용한 해수욕장을 차례로 둘러보며 포항의 다양한 해안 매력을 만끽할 수 있습니다.', 3, 0.8, true),

-- 포항 산악 트레킹 코스 경로
((SELECT id FROM courses WHERE title = '포항 산악 트레킹' LIMIT 1), '산악 트레킹 경로', 
 '[{"lat": 36.1042, "lng": 129.3582}, {"lat": 36.0791, "lng": 129.3178}, {"lat": 36.0250, "lng": 129.3250}]', '#10B981', 
 '봉화산, 도음산, 비학산을 연결하는 산악 트레킹 경로입니다. 포항의 대표적인 산들을 모두 정복하며 자연의 웅장함과 아름다움을 만끽할 수 있는 도전적인 코스입니다.', 3, 0.8, true),

-- 포항 문화유적 탐방 코스 경로
((SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), '문화유적 탐방 경로', 
 '[{"lat": 36.0097, "lng": 129.5694}, {"lat": 35.9680, "lng": 129.5440}, {"lat": 36.0000, "lng": 129.5500}]', '#8B5CF6', 
 '국립등대박물관, 구룡포 과메기문화관, 연오랑세오녀 테마파크를 연결하는 문화유적 탐방 경로입니다. 포항의 역사와 문화를 깊이 있게 체험할 수 있는 교육적인 코스입니다.', 3, 0.8, true),

-- 포항 공원 힐링 코스 경로
((SELECT id FROM courses WHERE title = '포항 공원 힐링' LIMIT 1), '공원 힐링 경로', 
 '[{"lat": 36.0200, "lng": 129.3800}, {"lat": 36.0250, "lng": 129.3750}, {"lat": 36.0180, "lng": 129.3645}, {"lat": 36.1500, "lng": 129.4500}]', '#F59E0B', 
 '침촌근린공원, 한호공원, 영일대 해수공원, 중명자연생태공원을 연결하는 힐링 경로입니다. 도심 속 휴식 공간들을 둘러보며 마음의 평화를 찾을 수 있는 여유로운 코스입니다.', 3, 0.8, true),

-- 포항 시장 투어 코스 경로
((SELECT id FROM courses WHERE title = '포항 시장 투어' LIMIT 1), '시장 투어 경로', 
 '[{"lat": 36.1620, "lng": 129.3885}, {"lat": 36.0050, "lng": 129.3400}, {"lat": 36.0000, "lng": 129.3450}]', '#EF4444', 
 '청하 공진시장, 중앙상가, 꿈들로를 연결하는 전통 시장 투어 경로입니다. 포항의 다양한 시장 문화와 지역 특산물을 만나볼 수 있는 맛있는 여행 코스입니다.', 3, 0.8, true),

-- 포항 트레킹 코스 완주 경로
((SELECT id FROM courses WHERE title = '포항 트레킹 코스 완주' LIMIT 1), '트레킹 코스 완주 경로', 
 '[{"lat": 36.0150, "lng": 129.3650}, {"lat": 36.1695, "lng": 129.4075}, {"lat": 36.1820, "lng": 129.4205}, {"lat": 36.0000, "lng": 129.5500}]', '#10B981', 
 '영일대 해맞이길, 주상절리길, 조경대길, 연오랑세오녀길을 연결하는 트레킹 코스 완주 경로입니다. 포항의 대표적인 트레킹 코스들을 모두 경험하며 자연과 역사를 동시에 만끽할 수 있습니다.', 3, 0.8, true),

-- 포항 특별 명소 탐방 경로
((SELECT id FROM courses WHERE title = '포항 특별 명소 탐방' LIMIT 1), '특별 명소 탐방 경로', 
 '[{"lat": 36.0097, "lng": 129.5694}, {"lat": 36.1500, "lng": 129.4000}, {"lat": 36.1000, "lng": 129.4500}, {"lat": 36.1000, "lng": 129.4000}]', '#8B5CF6', 
 '상생의 손, 독수리바위, 발산할오, 용연저수지를 연결하는 특별 명소 탐방 경로입니다. 포항만의 독특하고 특별한 장소들을 둘러보며 잊지 못할 추억을 만들 수 있습니다.', 3, 0.8, true),

-- 포항 문화시설 투어 경로
((SELECT id FROM courses WHERE title = '포항 문화시설 투어' LIMIT 1), '문화시설 투어 경로', 
 '[{"lat": 36.0150, "lng": 129.3600}, {"lat": 36.0100, "lng": 129.3650}, {"lat": 36.0050, "lng": 129.3700}]', '#8B5CF6', 
 '포항시립중앙아트홀, 포은중앙도서관, 포항함체험관을 연결하는 문화시설 투어 경로입니다. 포항의 문화 예술과 교육 시설들을 둘러보며 문화적 소양을 쌓을 수 있는 교육적인 코스입니다.', 3, 0.8, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. 완료 메시지
-- =============================================

SELECT '포항 스토리 텔러 샘플 데이터가 성공적으로 복구되었습니다.' as message;
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes) VALUES
-- 기본 관광지들
('영일대 해수욕장', '포항의 대표적인 해수욕장으로 아름다운 일몰을 감상할 수 있는 곳', ST_GeomFromText('POINT(129.3656 36.0194)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_YEONGILDAE_001', 'https://picsum.photos/800/600?random=1', 'https://picsum.photos/200/200?random=stamp1', 60),
('구룡포', '근대 문화 역사 거리가 유명하며, 일본식 가옥과 아기자기한 상점들을 볼 수 있는 드라마 촬영지입니다. 신선한 해산물도 맛볼 수 있습니다.', ST_GeomFromText('POINT(129.5440 35.9680)', 4326), '경상북도 포항시 남구 구룡포읍', 'QR_GURYONGPO_021', 'https://picsum.photos/800/600?random=21', 'https://picsum.photos/200/200?random=stamp21', 90),
('내연산 12폭포', '포항 북구에 위치한 산으로, 숲길과 등산로가 잘 정비되어 트레킹을 즐기기에 좋습니다. 울창한 숲과 맑은 공기 속에서 아름다운 폭포를 만끽할 수 있습니다.', ST_GeomFromText('POINT(129.3789 36.1956)', 4326), '경상북도 포항시 북구 송라면', 'QR_NAEYEONSAN_004', 'https://picsum.photos/800/600?random=4', 'https://picsum.photos/200/200?random=stamp4', 150),
('보경사', '내연산의 웅장한 자연 속에 자리 잡은 천년 고찰입니다. 12폭포로 향하는 길목에 있으며, 고즈넉한 분위기를 느낄 수 있습니다.', ST_GeomFromText('POINT(129.3820 36.1915)', 4326), '경상북도 포항시 북구 송라면', 'QR_BOGYEONGSA_019', 'https://picsum.photos/800/600?random=19', 'https://picsum.photos/200/200?random=stamp19', 90),
('호미곶', '한반도 최동단으로 일출을 감상할 수 있는 곳', ST_GeomFromText('POINT(129.5678 36.0761)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_HOMIGOT_001', 'https://picsum.photos/800/600?random=5', 'https://picsum.photos/200/200?random=stamp5', 120),
('포항시장', '포항의 전통 시장으로 다양한 먹거리를 만날 수 있는 곳', ST_GeomFromText('POINT(129.3400 36.0050)', 4326), '경상북도 포항시 남구', 'QR_MARKET_001', 'https://picsum.photos/800/600?random=6', 'https://picsum.photos/200/200?random=stamp6', 60),
('오도리 주상절리', '바닷가 절벽에 형성된 육각형 모양의 주상절리를 볼 수 있는 자연 지질 명소입니다. 파도와 어우러진 독특한 해안 절경이 인상적입니다.', ST_GeomFromText('POINT(129.4087 36.1683)', 4326), '경상북도 포항시 북구 청하면', 'QR_ODORI_009', 'https://picsum.photos/800/600?random=9', 'https://picsum.photos/200/200?random=stamp9', 60),
('이가리 닻 전망대', '바다를 향해 뻗어 나간 거대한 닻 모양의 독특한 구조물로, 포항의 새로운 랜드마크입니다. 시원한 바다를 배경으로 사진을 찍기 좋습니다.', ST_GeomFromText('POINT(129.4172 36.1764)', 4326), '경상북도 포항시 북구 청하면', 'QR_IGARI_014', 'https://picsum.photos/800/600?random=14', 'https://picsum.photos/200/200?random=stamp14', 40),

-- 해수욕장 및 해안 명소
('월포해수욕장', '넓은 백사장과 얕은 수심으로 가족 단위 피서객에게 인기 있는 해수욕장입니다. 주차장과 샤워시설이 잘 갖춰져 있습니다.', ST_GeomFromText('POINT(129.4005 36.1820)', 4326), '경상북도 포항시 북구 청하면', 'QR_WOLPO_015', 'https://picsum.photos/800/600?random=15', 'https://picsum.photos/200/200?random=stamp15', 60),
('칠포해수욕장', '깨끗한 수질과 주변의 기암괴석이 아름다운 조화를 이루는 해수욕장입니다. 자연 그대로의 해안을 즐길 수 있습니다.', ST_GeomFromText('POINT(129.3850 36.1580)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_CHILPO_016', 'https://picsum.photos/800/600?random=16', 'https://picsum.photos/200/200?random=stamp16', 60),
('화진해수욕장', '울창한 송림과 깨끗한 백사장이 어우러진 해수욕장으로, 캠핑장도 인접해 있어 편의성이 높습니다. 가족 단위 피서지로 인기입니다.', ST_GeomFromText('POINT(129.4301 36.2350)', 4326), '경상북도 포항시 북구 송라면', 'QR_HWAJIN_017', 'https://picsum.photos/800/600?random=17', 'https://picsum.photos/200/200?random=stamp17', 60),
('용한해수욕장', '조용하고 한적한 분위기에서 휴식을 취할 수 있는 작은 해수욕장입니다. 인근에 맛집과 카페가 있어 편리합니다.', ST_GeomFromText('POINT(129.3705 36.0350)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_YONGHAN_018', 'https://picsum.photos/800/600?random=18', 'https://picsum.photos/200/200?random=stamp18', 60),

-- 산 및 자연 명소
('봉화산', '흥해읍 이팝나무군락지. 아름다운 자연경관과 함께 등산객들에게 사랑받는 곳입니다. 정상에서는 탁 트인 전망을 감상할 수 있습니다.', ST_GeomFromText('POINT(129.3582 36.1042)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_BONGHWASAN_021', 'https://picsum.photos/800/600?random=21', 'https://picsum.photos/200/200?random=stamp21', 90),
('도음산', '만인당 수목원, 야외 정글숲, 경상북도 수목원. 아름다운 자연과 맑은 공기를 느낄 수 있으며, 완만한 등산로가 조성되어 있어 힐링하기 좋은 곳입니다.', ST_GeomFromText('POINT(129.3178 36.0791)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_DOEUMSAN_022', 'https://picsum.photos/800/600?random=22', 'https://picsum.photos/200/200?random=stamp22', 120),
('비학산', '포항시에 위치한 산으로, 비교적 짧은 시간에 오를 수 있는 등산로가 특징입니다. 정상에서는 아름다운 포항 시내 전망을 감상할 수 있습니다.', ST_GeomFromText('POINT(129.3250 36.0250)', 4326), '경상북도 포항시 북구 흥해읍', 'QR_BIHAKSAN_023', 'https://picsum.photos/800/600?random=23', 'https://picsum.photos/200/200?random=stamp23', 90),

-- 문화 및 역사 유적
('국립등대박물관', '호미곶에 위치한 등대 관련 전시관으로, 등대의 역사와 문화를 배울 수 있습니다.', ST_GeomFromText('POINT(129.5694 36.0097)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_LIGHTHOUSE_026', 'https://picsum.photos/800/600?random=26', 'https://picsum.photos/200/200?random=stamp26', 60),
('새천년기념관', '새천년을 기념하는 기념관으로, 포항의 역사와 문화를 엿볼 수 있습니다.', ST_GeomFromText('POINT(129.5700 36.0100)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_MILLENNIUM_027', 'https://picsum.photos/800/600?random=27', 'https://picsum.photos/200/200?random=stamp27', 45),
('구룡포 과메기문화관', '구룡포의 전통 과메기 문화를 체험할 수 있는 문화관입니다.', ST_GeomFromText('POINT(129.5440 35.9680)', 4326), '경상북도 포항시 남구 구룡포읍', 'QR_GWAMEGI_028', 'https://picsum.photos/800/600?random=28', 'https://picsum.photos/200/200?random=stamp28', 60),
('연오랑세오녀 테마파크', '연오랑과 세오녀의 전설을 테마로 한 공원입니다. 가족 단위 관광객에게 인기입니다.', ST_GeomFromText('POINT(129.5500 36.0000)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_YEONORANG_029', 'https://picsum.photos/800/600?random=29', 'https://picsum.photos/200/200?random=stamp29', 90),
('장기유배문화체험촌', '조선시대 유배 문화를 체험할 수 있는 문화촌입니다. 역사와 문화를 배울 수 있습니다.', ST_GeomFromText('POINT(129.4800 35.9000)', 4326), '경상북도 포항시 남구 장기면', 'QR_EXILE_030', 'https://picsum.photos/800/600?random=30', 'https://picsum.photos/200/200?random=stamp30', 120),

-- 공원 및 시설
('침촌근린공원', '풍차와 놀이터가 있는 가족 친화적인 공원입니다. 아이들과 함께 즐기기 좋습니다.', ST_GeomFromText('POINT(129.3800 36.0200)', 4326), '경상북도 포항시 북구', 'QR_CHIMCHON_035', 'https://picsum.photos/800/600?random=35', 'https://picsum.photos/200/200?random=stamp35', 60),
('한호공원', '아름다운 호수와 함께 휴식을 취할 수 있는 공원입니다.', ST_GeomFromText('POINT(129.3750 36.0250)', 4326), '경상북도 포항시 북구', 'QR_HANHO_036', 'https://picsum.photos/800/600?random=36', 'https://picsum.photos/200/200?random=stamp36', 45),
('영일대 해수공원', '영일대 해수욕장과 이어져 있는 해변 공원으로, 다양한 휴식 시설과 운동 시설이 갖춰져 있습니다.', ST_GeomFromText('POINT(129.3645 36.0180)', 4326), '경상북도 포항시 북구 두호동', 'QR_LAKE_PARK_037', 'https://picsum.photos/800/600?random=37', 'https://picsum.photos/200/200?random=stamp37', 60),
('중명자연생태공원', '다양한 동식물을 관찰하고 생태 학습을 할 수 있는 공원입니다. 잘 조성된 산책로와 습지가 특징입니다.', ST_GeomFromText('POINT(129.4500 36.1500)', 4326), '경상북도 포항시 북구 송라면', 'QR_JUNGMYEONG_038', 'https://picsum.photos/800/600?random=38', 'https://picsum.photos/200/200?random=stamp38', 90),

-- 문화시설
('포항시립중앙아트홀', '포항의 문화 예술을 감상할 수 있는 아트홀입니다.', ST_GeomFromText('POINT(129.3600 36.0150)', 4326), '경상북도 포항시 북구', 'QR_ART_HALL_044', 'https://picsum.photos/800/600?random=44', 'https://picsum.photos/200/200?random=stamp44', 90),
('포은중앙도서관', '포항의 중앙 도서관으로, 다양한 도서와 자료를 이용할 수 있습니다.', ST_GeomFromText('POINT(129.3650 36.0100)', 4326), '경상북도 포항시 북구', 'QR_LIBRARY_045', 'https://picsum.photos/800/600?random=45', 'https://picsum.photos/200/200?random=stamp45', 60),
('포항함체험관', '포항의 해양 문화를 체험할 수 있는 체험관입니다.', ST_GeomFromText('POINT(129.3700 36.0050)', 4326), '경상북도 포항시 북구', 'QR_SHIP_046', 'https://picsum.photos/800/600?random=46', 'https://picsum.photos/200/200?random=stamp46', 75),
('포항캐릭터해상공원', '포항의 캐릭터를 테마로 한 해상공원입니다.', ST_GeomFromText('POINT(129.3750 36.0000)', 4326), '경상북도 포항시 북구', 'QR_CHARACTER_047', 'https://picsum.photos/800/600?random=47', 'https://picsum.photos/200/200?random=stamp47', 60),

-- 시장 및 상업지구
('중앙상가', '포항의 중앙 상가로, 다양한 쇼핑을 즐길 수 있습니다.', ST_GeomFromText('POINT(129.3400 36.0050)', 4326), '경상북도 포항시 남구', 'QR_CENTER_053', 'https://picsum.photos/800/600?random=53', 'https://picsum.photos/200/200?random=stamp53', 60),
('꿈들로', '포항의 꿈이 가득한 거리로, 다양한 문화를 체험할 수 있습니다.', ST_GeomFromText('POINT(129.3450 36.0000)', 4326), '경상북도 포항시 남구', 'QR_DREAM_054', 'https://picsum.photos/800/600?random=54', 'https://picsum.photos/200/200?random=stamp54', 45),
('송도카페문화거리', '송도 지역의 카페 문화를 즐길 수 있는 거리입니다.', ST_GeomFromText('POINT(129.3500 35.9950)', 4326), '경상북도 포항시 남구', 'QR_CAFE_055', 'https://picsum.photos/800/600?random=55', 'https://picsum.photos/200/200?random=stamp55', 60),
('청하 공진시장', '드라마 촬영지로 유명해진 전통 시장입니다. 정감 있는 시장 풍경과 지역 먹거리를 경험할 수 있습니다.', ST_GeomFromText('POINT(129.3885 36.1620)', 4326), '경상북도 포항시 북구 청하면', 'QR_GONGJIN_056', 'https://picsum.photos/800/600?random=56', 'https://picsum.photos/200/200?random=stamp56', 60),

-- 트레킹 코스
('영일대 해맞이길', '영일대 해수욕장 주변의 아름다운 해안 산책로입니다. 동해의 푸른 바다를 바라보며 걷기 좋으며, 특히 일출 시간에 인기가 많습니다.', ST_GeomFromText('POINT(129.3650 36.0150)', 4326), '경상북도 포항시 북구 두호동', 'QR_HAEJAE_062', 'https://picsum.photos/800/600?random=62', 'https://picsum.photos/200/200?random=stamp62', 90),
('주상절리길', '주상절리를 가까이에서 관찰하며 걸을 수 있도록 조성된 트레킹 코스입니다. 자연의 신비로움을 느끼며 힐링할 수 있는 길입니다.', ST_GeomFromText('POINT(129.4075 36.1695)', 4326), '경상북도 포항시 북구 청하면', 'QR_JUSANG_063', 'https://picsum.photos/800/600?random=63', 'https://picsum.photos/200/200?random=stamp63', 90),
('조경대길', '포항의 아름다운 해안선을 따라 조성된 길 중 하나로, 멋진 경치를 조망할 수 있는 전망대가 있습니다.', ST_GeomFromText('POINT(129.4205 36.1820)', 4326), '경상북도 포항시 북구 송라면', 'QR_JOGYUNG_064', 'https://picsum.photos/800/600?random=64', 'https://picsum.photos/200/200?random=stamp64', 60),
('연오랑세오녀길', '연오랑과 세오녀의 전설을 따라 걷는 트레킹 코스입니다.', ST_GeomFromText('POINT(129.5500 36.0000)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_YEONORANG_GIL_065', 'https://picsum.photos/800/600?random=65', 'https://picsum.photos/200/200?random=stamp65', 120),

-- 기타 특별한 장소
('상생의 손', '호미곶에 위치한 상생의 손 조형물로, 포항의 상징적인 랜드마크입니다.', ST_GeomFromText('POINT(129.5694 36.0097)', 4326), '경상북도 포항시 남구 호미곶면', 'QR_HANDS_070', 'https://picsum.photos/800/600?random=70', 'https://picsum.photos/200/200?random=stamp70', 30),
('독수리바위', '독수리 모양의 바위로, 포항의 자연 명소입니다.', ST_GeomFromText('POINT(129.4000 36.1500)', 4326), '경상북도 포항시 북구 청하면', 'QR_EAGLE_071', 'https://picsum.photos/800/600?random=71', 'https://picsum.photos/200/200?random=stamp71', 30),
('발산할오', '포항의 자연 명소로, 아름다운 경치를 감상할 수 있습니다.', ST_GeomFromText('POINT(129.4500 36.1000)', 4326), '경상북도 포항시 북구 동해면', 'QR_BALSAN_072', 'https://picsum.photos/800/600?random=72', 'https://picsum.photos/200/200?random=stamp72', 45),
('용연저수지', '아름다운 저수지로, 주변에 맛집들이 많아 인기가 높습니다.', ST_GeomFromText('POINT(129.4000 36.1000)', 4326), '경상북도 포항시 북구 신광면', 'QR_YONGYEON_073', 'https://picsum.photos/800/600?random=73', 'https://picsum.photos/200/200?random=stamp73', 60),
('영일대 전망대', '영일대 해수욕장 해상에 위치한 누각으로, 포항 시내와 동해 바다를 360도로 조망할 수 있는 곳입니다.', ST_GeomFromText('POINT(129.3665 36.0175)', 4326), '경상북도 포항시 북구 두호동', 'QR_OBSERVATORY_078', 'https://picsum.photos/800/600?random=78', 'https://picsum.photos/200/200?random=stamp78', 40)
ON CONFLICT (qr_code) DO NOTHING;

-- =============================================
-- 2. 샘플 코스 데이터
-- =============================================

INSERT INTO courses (title, description, duration_minutes, difficulty, distance_km, estimated_cost, image_url, is_featured) VALUES
-- 기본 코스들
('포항 바다와 일몰의 만남', '영일대 해수욕장에서 구룡포까지 이어지는 아름다운 해안 경로로, 동해의 푸른 바다를 따라 걷는 로맨틱한 산책로입니다.', 180, 'easy', 15.5, 50000, 'https://picsum.photos/800/600?random=course1', true),
('포항 자연과 역사 탐방', '내연산 12폭포와 보경사를 중심으로 한 자연과 역사가 어우러진 경로입니다.', 240, 'medium', 8.2, 30000, 'https://picsum.photos/800/600?random=course2', true),
('호미곶 일출 투어', '한반도 최동단 호미곶에서 감상하는 웅장한 일출 경로입니다.', 120, 'easy', 5.0, 20000, 'https://picsum.photos/800/600?random=course3', false),
('포항 지질 명소 탐방', '오도리 주상절리와 이가리 닻 전망대를 중심으로 한 지질 명소 코스', 120, 'easy', 2.5, 15000, 'https://picsum.photos/800/600?random=course4', false),

-- 포항 관광 지도에서 추출한 새로운 코스들
('포항 해수욕장 완전정복', '월포, 칠포, 화진, 용한 해수욕장을 모두 방문하는 해수욕장 투어', 360, 'medium', 15.0, 45000, 'https://picsum.photos/800/600?random=course8', true),
('포항 산악 트레킹', '봉화산, 도음산, 비학산을 연결하는 산악 트레킹 코스', 480, 'hard', 25.0, 60000, 'https://picsum.photos/800/600?random=course9', true),
('포항 문화유적 탐방', '국립등대박물관, 구룡포 과메기문화관, 연오랑세오녀 테마파크를 연결하는 문화 코스', 300, 'easy', 12.0, 35000, 'https://picsum.photos/800/600?random=course10', false),
('포항 공원 힐링', '침촌근린공원, 한호공원, 영일대 해수공원, 중명자연생태공원을 연결하는 힐링 코스', 240, 'easy', 8.0, 25000, 'https://picsum.photos/800/600?random=course11', false),
('포항 시장 투어', '청하 공진시장, 중앙상가, 꿈들로를 연결하는 전통 시장 투어', 300, 'easy', 20.0, 40000, 'https://picsum.photos/800/600?random=course12', false),
('포항 트레킹 코스 완주', '영일대 해맞이길, 주상절리길, 조경대길, 연오랑세오녀길을 연결하는 트레킹 코스', 420, 'medium', 18.0, 50000, 'https://picsum.photos/800/600?random=course13', true),
('포항 특별 명소 탐방', '상생의 손, 독수리바위, 발산할오, 용연저수지를 연결하는 특별 명소 코스', 180, 'easy', 10.0, 30000, 'https://picsum.photos/800/600?random=course14', false),
('포항 문화시설 투어', '포항시립중앙아트홀, 포은중앙도서관, 포항함체험관을 연결하는 문화시설 투어', 180, 'easy', 8.0, 25000, 'https://picsum.photos/800/600?random=course15', false)
ON CONFLICT DO NOTHING;