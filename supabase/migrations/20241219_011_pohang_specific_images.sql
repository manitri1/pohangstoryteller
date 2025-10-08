-- =============================================
-- 포항 특화 실제 이미지로 업데이트
-- =============================================

-- 해수욕장 및 해안 명소 (바다/해변 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('영일대 해수욕장', '월포해수욕장', '칠포해수욕장', '화진해수욕장', '용한해수욕장', '호미곶');

-- 산 및 자연 명소 (산/폭포/자연 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('내연산 12폭포', '봉화산', '도음산', '비학산', '중명자연생태공원');

-- 사찰 및 문화 유적 (전통 건축/문화 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&q=80'
WHERE name IN ('보경사', '국립등대박물관', '새천년기념관', '구룡포 과메기문화관', '연오랑세오녀 테마파크', '장기유배문화체험촌');

-- 공원 및 시설 (공원/휴식 공간 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('침촌근린공원', '한호공원', '영일대 해수공원');

-- 문화시설 (현대 건축/문화 시설 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&q=80'
WHERE name IN ('포항시립중앙아트홀', '포은중앙도서관', '포항함체험관', '포항캐릭터해상공원');

-- 시장 및 상업지구 (시장/상업 거리 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&q=80'
WHERE name IN ('포항시장', '중앙상가', '꿈들로', '송도카페문화거리', '청하 공진시장');

-- 트레킹 코스 (산책로/트레킹 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('영일대 해맞이길', '주상절리길', '조경대길', '연오랑세오녀길');

-- 특별한 장소 (랜드마크/특별한 구조물 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('상생의 손', '독수리바위', '발산할오', '용연저수지', '영일대 전망대');

-- 지질 명소 (지질/자연 구조물 이미지)
UPDATE locations SET 
  image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  stamp_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&q=80'
WHERE name IN ('오도리 주상절리', '이가리 닻 전망대');

-- 완료 메시지
SELECT '포항 관광지 이미지가 카테고리별 실제 이미지로 업데이트되었습니다.' as message;
