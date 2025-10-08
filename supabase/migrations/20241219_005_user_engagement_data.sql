-- 포항 스토리 텔러 사용자 참여 데이터
-- 생성일: 2024-12-19
-- 설명: 사용자 참여 및 상호작용을 위한 샘플 데이터
-- Supabase Migration SQL Guideline 준수
-- 
-- ⚠️ 주의: 이 파일은 다음 파일들 이후에 실행되어야 합니다:
-- 1. 20241219_001_initial_schema.sql
-- 2. 20241219_002_sample_data.sql
-- 3. 20241219_003_pohang_tourist_spots.sql
-- 
-- ⚠️ 중요: 이 파일의 사용자 관련 데이터는 auth.users 테이블에 해당 사용자가 존재할 때만 사용하세요.
-- 현재 모든 사용자 관련 데이터는 주석 처리되어 있습니다.
-- 실제 사용 시에는 auth.users 테이블에 사용자를 먼저 생성한 후 주석을 해제하세요.

-- =============================================
-- 1. 개발용 사용자 프로필 데이터
-- =============================================

-- 사용자 데이터 실행 (auth.users 테이블에 사용자가 생성된 후 실행)

-- ✅ 모든 사용자 관련 데이터가 활성화되었습니다.
-- 다음 데이터가 포함됩니다:
-- - profiles (사용자 프로필)
-- - user_preferences (사용자 선호도)
-- - stamps (스탬프)
-- - albums (앨범)
-- - album_items (앨범 아이템)
-- - posts (게시물)
-- - likes (좋아요)
-- - comments (댓글)
-- - shares (공유)
-- - orders (주문)
-- - order_items (주문 아이템)
-- - chat_sessions (채팅 세션)
-- - chat_messages (채팅 메시지)

-- 개발용 사용자 프로필 (auth.users 테이블에 사용자가 생성된 후 실행)
INSERT INTO profiles (id, email, name, avatar_url, preferences) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', '테스트 사용자', 'https://picsum.photos/100/100?random=avatar1', '{"theme": "dark", "language": "ko"}'),
('00000000-0000-0000-0000-000000000002', 'admin@example.com', '관리자', 'https://picsum.photos/100/100?random=avatar2', '{"theme": "light", "language": "ko"}'),
('00000000-0000-0000-0000-000000000003', 'user1@example.com', '김포항', 'https://picsum.photos/100/100?random=avatar3', '{"theme": "auto", "language": "ko"}'),
('00000000-0000-0000-0000-000000000004', 'user2@example.com', '이여행', 'https://picsum.photos/100/100?random=avatar4', '{"theme": "light", "language": "ko"}'),
('00000000-0000-0000-0000-000000000005', 'user3@example.com', '박스토리', 'https://picsum.photos/100/100?random=avatar5', '{"theme": "dark", "language": "ko"}')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. 사용자 선호도 데이터
-- =============================================

-- 사용자 선호도 데이터
INSERT INTO user_preferences (user_id, interests, travel_style, budget_range, language, notifications_enabled, privacy_level) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['자연경관', '맛집탐방'], 'relaxed', 'medium', 'ko', true, 'public'),
('00000000-0000-0000-0000-000000000002', ARRAY['역사여행', '문화예술'], 'cultural', 'high', 'ko', true, 'private'),
('00000000-0000-0000-0000-000000000003', ARRAY['자연경관', '골목산책'], 'active', 'low', 'ko', false, 'public'),
('00000000-0000-0000-0000-000000000004', ARRAY['맛집탐방', '자연경관'], 'relaxed', 'medium', 'ko', true, 'public'),
('00000000-0000-0000-0000-000000000005', ARRAY['역사여행', '문화예술', '골목산책'], 'cultural', 'high', 'ko', true, 'private');

-- =============================================
-- 3. 스탬프 획득 데이터
-- =============================================

-- 스탬프 데이터
-- 필수 데이터 존재 확인
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM locations WHERE name = '영일대 해수욕장') THEN
        RAISE EXCEPTION '필수 관광지 데이터가 없습니다. 이전 마이그레이션 파일들을 먼저 실행하세요.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM courses WHERE title = '포항 바다와 일몰의 만남') THEN
        RAISE EXCEPTION '필수 코스 데이터가 없습니다. 이전 마이그레이션 파일들을 먼저 실행하세요.';
    END IF;
END $$;

INSERT INTO stamps (user_id, location_id, course_id, acquired_at, qr_code_scanned, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '영일대 해수욕장' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 바다와 일몰의 만남' LIMIT 1), NOW() - INTERVAL '2 days', 'QR_YEONGILDAE_001', true),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM locations WHERE name = '구룡포' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 바다와 일몰의 만남' LIMIT 1), NOW() - INTERVAL '1 day', 'QR_GURYONGPO_021', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '포항시립중앙아트홀' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), NOW() - INTERVAL '3 days', 'QR_ART_HALL_044', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM locations WHERE name = '포은중앙도서관' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), NOW() - INTERVAL '2 days', 'QR_LIBRARY_045', true),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM locations WHERE name = '호미곶' LIMIT 1), (SELECT id FROM courses WHERE title = '호미곶 일출 투어' LIMIT 1), NOW() - INTERVAL '1 day', 'QR_HOMIGOT_001', true),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM locations WHERE name = '국립등대박물관' LIMIT 1), (SELECT id FROM courses WHERE title = '호미곶 일출 투어' LIMIT 1), NOW() - INTERVAL '1 day', 'QR_LIGHTHOUSE_026', true),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM locations WHERE name = '포항시장' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 맛집 탐방' LIMIT 1), NOW() - INTERVAL '4 days', 'QR_MARKET_001', true),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM locations WHERE name = '청하 공진시장' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 맛집 탐방' LIMIT 1), NOW() - INTERVAL '3 days', 'QR_GONGJIN_056', true),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM locations WHERE name = '장기유배문화체험촌' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), NOW() - INTERVAL '5 days', 'QR_EXILE_030', true),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM locations WHERE name = '포항함체험관' LIMIT 1), (SELECT id FROM courses WHERE title = '포항 문화유적 탐방' LIMIT 1), NOW() - INTERVAL '4 days', 'QR_SHIP_046', true);

-- =============================================
-- 4. 앨범 데이터
-- =============================================

INSERT INTO albums (user_id, title, description, theme, cover_image_url, is_public) VALUES
('00000000-0000-0000-0000-000000000001', '포항 바다 여행', '영일대 해수욕장과 구룡포를 둘러본 아름다운 여행', 'nature', 'https://picsum.photos/400/300?random=album1', true),
('00000000-0000-0000-0000-000000000002', '포항 문화유적 탐방', '아트홀과 문화예술회관을 둘러본 문화 예술 여행', 'culture', 'https://picsum.photos/400/300?random=album2', true),
('00000000-0000-0000-0000-000000000003', '호미곶 일출 투어', '한반도 최동단에서 맞이한 특별한 일출', 'nature', 'https://picsum.photos/400/300?random=album3', false),
('00000000-0000-0000-0000-000000000004', '포항 맛집 탐방', '포항의 다양한 맛집들을 둘러본 맛집 투어', 'food', 'https://picsum.photos/400/300?random=album4', true),
('00000000-0000-0000-0000-000000000005', '포항 문화유적 탐방', '장기유배문화체험촌과 문화예술회관을 둘러본 문화 여행', 'history', 'https://picsum.photos/400/300?random=album5', true);

-- =============================================
-- 5. 앨범 아이템 데이터
-- =============================================

INSERT INTO album_items (album_id, item_type, content, media_url, metadata, order_index) VALUES
((SELECT id FROM albums WHERE title = '포항 바다 여행' LIMIT 1), 'stamp', '영일대 해수욕장 스탬프', 'https://picsum.photos/200/200?random=stamp1', '{"location": "영일대 해수욕장", "acquired_at": "2024-12-17"}', 1),
((SELECT id FROM albums WHERE title = '포항 바다 여행' LIMIT 1), 'photo', '영일대 해수욕장 사진', 'https://picsum.photos/800/600?random=photo1', '{"location": "영일대 해수욕장", "taken_at": "2024-12-17"}', 2),
((SELECT id FROM albums WHERE title = '포항 바다 여행' LIMIT 1), 'stamp', '구룡포 스탬프', 'https://picsum.photos/200/200?random=stamp2', '{"location": "구룡포", "acquired_at": "2024-12-18"}', 3),
((SELECT id FROM albums WHERE title = '포항 바다 여행' LIMIT 1), 'photo', '구룡포 사진', 'https://picsum.photos/800/600?random=photo2', '{"location": "구룡포", "taken_at": "2024-12-18"}', 4),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'stamp', '포항시립중앙아트홀 스탬프', 'https://picsum.photos/200/200?random=stamp3', '{"location": "포항시립중앙아트홀", "acquired_at": "2024-12-16"}', 1),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'photo', '포항시립중앙아트홀 사진', 'https://picsum.photos/800/600?random=photo3', '{"location": "포항시립중앙아트홀", "taken_at": "2024-12-16"}', 2),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'stamp', '포은중앙도서관 스탬프', 'https://picsum.photos/200/200?random=stamp15', '{"location": "포은중앙도서관", "acquired_at": "2024-12-17"}', 3),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'photo', '포은중앙도서관 사진', 'https://picsum.photos/800/600?random=photo4', '{"location": "포은중앙도서관", "taken_at": "2024-12-17"}', 4),
((SELECT id FROM albums WHERE title = '호미곶 일출 투어' LIMIT 1), 'stamp', '호미곶 스탬프', 'https://picsum.photos/200/200?random=stamp5', '{"location": "호미곶", "acquired_at": "2024-12-18"}', 1),
((SELECT id FROM albums WHERE title = '호미곶 일출 투어' LIMIT 1), 'photo', '호미곶 일출 사진', 'https://picsum.photos/800/600?random=photo5', '{"location": "호미곶", "taken_at": "2024-12-18"}', 2),
((SELECT id FROM albums WHERE title = '포항 맛집 탐방' LIMIT 1), 'stamp', '포항시장 스탬프', 'https://picsum.photos/200/200?random=stamp6', '{"location": "포항시장", "acquired_at": "2024-12-15"}', 1),
((SELECT id FROM albums WHERE title = '포항 맛집 탐방' LIMIT 1), 'photo', '포항시장 사진', 'https://picsum.photos/800/600?random=photo6', '{"location": "포항시장", "taken_at": "2024-12-15"}', 2),
((SELECT id FROM albums WHERE title = '포항 맛집 탐방' LIMIT 1), 'stamp', '청하 공진시장 스탬프', 'https://picsum.photos/200/200?random=stamp10', '{"location": "청하 공진시장", "acquired_at": "2024-12-16"}', 3),
((SELECT id FROM albums WHERE title = '포항 맛집 탐방' LIMIT 1), 'photo', '청하 공진시장 사진', 'https://picsum.photos/800/600?random=photo7', '{"location": "청하 공진시장", "taken_at": "2024-12-16"}', 4),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'stamp', '장기유배문화체험촌 스탬프', 'https://picsum.photos/200/200?random=stamp9', '{"location": "장기유배문화체험촌", "acquired_at": "2024-12-14"}', 1),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'photo', '장기유배문화체험촌 사진', 'https://picsum.photos/800/600?random=photo8', '{"location": "장기유배문화체험촌", "taken_at": "2024-12-14"}', 2),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'stamp', '포항함체험관 스탬프', 'https://picsum.photos/200/200?random=stamp15', '{"location": "포항함체험관", "acquired_at": "2024-12-15"}', 3),
((SELECT id FROM albums WHERE title = '포항 문화유적 탐방' LIMIT 1), 'photo', '포항함체험관 사진', 'https://picsum.photos/800/600?random=photo9', '{"location": "포항함체험관", "taken_at": "2024-12-15"}', 4);

-- =============================================
-- 6. 게시물 데이터
-- =============================================

INSERT INTO posts (author_id, content, media_urls, hashtags, location_data, mood, is_public, like_count, comment_count, share_count) VALUES
('00000000-0000-0000-0000-000000000001', '포항 영일대에서 찍은 아름다운 일몰 사진입니다! 🌅', 
 ARRAY['https://picsum.photos/800/600?random=post1'], 
 ARRAY['포항', '영일대', '일몰', '여행'], 
 '{"name": "영일대 해수욕장", "coordinates": [129.3656, 36.0194]}', 
 'happy', true, 15, 3, 2),
('00000000-0000-0000-0000-000000000001', '구룡포 산책길이 정말 좋네요! 🚶‍♀️', 
 ARRAY['https://picsum.photos/800/600?random=post2'], 
 ARRAY['포항', '구룡포', '산책', '자연'], 
 '{"name": "구룡포", "coordinates": [129.5440, 35.9680]}', 
 'peaceful', true, 8, 1, 0),
('00000000-0000-0000-0000-000000000002', '포항시립중앙아트홀에서 본 전시회가 정말 인상적이었어요! 🎨', 
 ARRAY['https://picsum.photos/800/600?random=post3'], 
 ARRAY['포항', '아트홀', '전시회', '문화'], 
 '{"name": "포항시립중앙아트홀", "coordinates": [129.3600, 36.0150]}', 
 'inspired', true, 12, 5, 1),
('00000000-0000-0000-0000-000000000003', '호미곶에서 맞이한 일출이 정말 장관이었습니다! 🌅', 
 ARRAY['https://picsum.photos/800/600?random=post4'], 
 ARRAY['포항', '호미곶', '일출', '자연'], 
 '{"name": "호미곶", "coordinates": [129.5678, 36.0761]}', 
 'amazed', true, 25, 8, 3),
('00000000-0000-0000-0000-000000000004', '포항시장에서 맛본 해산물이 정말 신선했어요! 🦐', 
 ARRAY['https://picsum.photos/800/600?random=post5'], 
 ARRAY['포항', '시장', '해산물', '맛집'], 
 '{"name": "포항시장", "coordinates": [129.3400, 36.0050]}', 
 'satisfied', true, 18, 6, 2),
('00000000-0000-0000-0000-000000000005', '장기유배문화체험촌에서 포항의 역사를 배웠습니다! 📚', 
 ARRAY['https://picsum.photos/800/600?random=post6'], 
 ARRAY['포항', '유배문화체험촌', '역사', '문화'], 
 '{"name": "장기유배문화체험촌", "coordinates": [129.3550, 36.0120]}', 
 'educated', true, 9, 2, 1),
('00000000-0000-0000-0000-000000000001', '송도카페문화거리의 카페들이 정말 독특해요! ☕', 
 ARRAY['https://picsum.photos/800/600?random=post7'], 
 ARRAY['포항', '카페', '송도카페문화거리', '여행'], 
 '{"name": "송도카페문화거리", "coordinates": [129.3500, 35.9950]}', 
 'relaxed', true, 7, 1, 0),
('00000000-0000-0000-0000-000000000002', '침촌근린공원에서 가족과 함께 즐거운 시간을 보냈어요! 👨‍👩‍👧‍👦', 
 ARRAY['https://picsum.photos/800/600?random=post8'], 
 ARRAY['포항', '공원', '침촌근린공원', '가족'], 
 '{"name": "침촌근린공원", "coordinates": [129.3800, 36.0200]}', 
 'happy', true, 14, 4, 1),
('00000000-0000-0000-0000-000000000003', '한호공원에서 운동을 했는데 정말 좋았어요! 🏃‍♂️', 
 ARRAY['https://picsum.photos/800/600?random=post9'], 
 ARRAY['포항', '공원', '운동', '건강'], 
 '{"name": "한호공원", "coordinates": [129.3750, 36.0250]}', 
 'energetic', true, 6, 1, 0),
('00000000-0000-0000-0000-000000000004', '포은중앙도서관에서 조용한 독서 시간을 가졌어요! 📖', 
 ARRAY['https://picsum.photos/800/600?random=post10'], 
 ARRAY['포항', '도서관', '독서', '문화'], 
 '{"name": "포은중앙도서관", "coordinates": [129.3650, 36.0100]}', 
 'peaceful', true, 11, 3, 1);

-- =============================================
-- 7. 좋아요 데이터
-- =============================================

INSERT INTO likes (user_id, post_id) VALUES
('00000000-0000-0000-0000-000000000002', (SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1)),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1)),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1)),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1)),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1)),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1)),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1)),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1)),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1)),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1)),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1)),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1))
ON CONFLICT (user_id, post_id) DO NOTHING;

-- =============================================
-- 8. 댓글 데이터
-- =============================================

INSERT INTO comments (post_id, author_id, content, like_count) VALUES
((SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1), '00000000-0000-0000-0000-000000000002', '정말 아름다운 일몰이네요! 저도 가보고 싶어요.', 2),
((SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1), '00000000-0000-0000-0000-000000000003', '포항의 일몰은 정말 최고예요!', 1),
((SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1), '00000000-0000-0000-0000-000000000001', '전시회가 정말 좋았나보네요. 다음에 가보겠습니다.', 0),
((SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1), '00000000-0000-0000-0000-000000000004', '문화 예술을 즐기시는 모습이 좋네요!', 1),
((SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1), '00000000-0000-0000-0000-000000000001', '일출을 보시는 모습이 정말 멋져요!', 3),
((SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1), '00000000-0000-0000-0000-000000000002', '호미곶의 일출은 정말 장관이죠!', 2);

-- =============================================
-- 9. 공유 데이터
-- =============================================

INSERT INTO shares (post_id, user_id, platform, share_url) VALUES
((SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1), '00000000-0000-0000-0000-000000000002', 'instagram', 'https://instagram.com/p/example1'),
((SELECT id FROM posts WHERE content LIKE '%영일대%' LIMIT 1), '00000000-0000-0000-0000-000000000003', 'facebook', 'https://facebook.com/posts/example1'),
((SELECT id FROM posts WHERE content LIKE '%아트홀%' LIMIT 1), '00000000-0000-0000-0000-000000000001', 'instagram', 'https://instagram.com/p/example2'),
((SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1), '00000000-0000-0000-0000-000000000001', 'kakao', 'https://story.kakao.com/example1'),
((SELECT id FROM posts WHERE content LIKE '%호미곶%' LIMIT 1), '00000000-0000-0000-0000-000000000002', 'twitter', 'https://twitter.com/status/example1');

-- =============================================
-- 10. 주문 데이터
-- =============================================

INSERT INTO orders (user_id, total_amount, status, payment_method, payment_id, shipping_address) VALUES
('00000000-0000-0000-0000-000000000001', 5000, 'delivered', 'card', 'pay_123456789', '{"name": "김포항", "address": "경상북도 포항시 북구", "phone": "010-1234-5678"}'),
('00000000-0000-0000-0000-000000000002', 3000, 'shipped', 'card', 'pay_123456790', '{"name": "이여행", "address": "경상북도 포항시 남구", "phone": "010-2345-6789"}'),
('00000000-0000-0000-0000-000000000003', 15000, 'processing', 'card', 'pay_123456791', '{"name": "박스토리", "address": "경상북도 포항시 북구", "phone": "010-3456-7890"}'),
('00000000-0000-0000-0000-000000000004', 5000, 'paid', 'card', 'pay_123456792', '{"name": "최여행", "address": "경상북도 포항시 남구", "phone": "010-4567-8901"}'),
('00000000-0000-0000-0000-000000000005', 3000, 'pending', 'card', 'pay_123456793', '{"name": "정포항", "address": "경상북도 포항시 북구", "phone": "010-5678-9012"}');

-- =============================================
-- 11. 주문 아이템 데이터
-- =============================================

INSERT INTO order_items (order_id, template_id, quantity, customization_data, price) VALUES
((SELECT id FROM orders WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), (SELECT id FROM templates WHERE name = '포항4컷 기본' LIMIT 1), 1, '{"photos": ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]}', 5000),
((SELECT id FROM orders WHERE user_id = '00000000-0000-0000-0000-000000000002' LIMIT 1), (SELECT id FROM templates WHERE name = '롤링페이퍼 기본' LIMIT 1), 1, '{"text": "포항 여행의 추억을 담은 롤링페이퍼"}', 3000),
((SELECT id FROM orders WHERE user_id = '00000000-0000-0000-0000-000000000003' LIMIT 1), (SELECT id FROM templates WHERE name = '포토북 기본' LIMIT 1), 1, '{"photos": ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]}', 15000),
((SELECT id FROM orders WHERE user_id = '00000000-0000-0000-0000-000000000004' LIMIT 1), (SELECT id FROM templates WHERE name = '포항4컷 기본' LIMIT 1), 1, '{"photos": ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]}', 5000),
((SELECT id FROM orders WHERE user_id = '00000000-0000-0000-0000-000000000005' LIMIT 1), (SELECT id FROM templates WHERE name = '롤링페이퍼 기본' LIMIT 1), 1, '{"text": "포항의 아름다운 추억"}', 3000);

-- =============================================
-- 12. 채팅 세션 데이터
-- =============================================

INSERT INTO chat_sessions (user_id, session_name) VALUES
('00000000-0000-0000-0000-000000000001', '포항 여행 상담'),
('00000000-0000-0000-0000-000000000002', '포항 문화 예술 문의'),
('00000000-0000-0000-0000-000000000003', '호미곶 일출 투어 문의'),
('00000000-0000-0000-0000-000000000004', '포항 맛집 추천'),
('00000000-0000-0000-0000-000000000005', '포항 역사 문화 문의');

-- =============================================
-- 13. 채팅 메시지 데이터
-- =============================================

INSERT INTO chat_messages (session_id, role, content, metadata) VALUES
((SELECT id FROM chat_sessions WHERE session_name = '포항 여행 상담' LIMIT 1), 'user', '포항에서 1박 2일 여행을 계획하고 있는데 추천해주세요.', '{"intent": "travel_planning"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 여행 상담' LIMIT 1), 'assistant', '포항 1박 2일 여행으로는 영일대 해수욕장과 구룡포를 둘러보는 "포항 바다와 일몰의 만남" 코스를 추천드립니다.', '{"recommendation": "course"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 문화 예술 문의' LIMIT 1), 'user', '포항에서 문화 예술을 즐길 수 있는 곳이 있나요?', '{"intent": "cultural_inquiry"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 문화 예술 문의' LIMIT 1), 'assistant', '포항시립중앙아트홀과 포항문화예술회관에서 다양한 문화 예술 활동을 즐기실 수 있습니다. "포항 문화유적 탐방" 코스를 추천드립니다.', '{"recommendation": "course"}'),
((SELECT id FROM chat_sessions WHERE session_name = '호미곶 일출 투어 문의' LIMIT 1), 'user', '호미곶에서 일출을 보려면 언제 가야 하나요?', '{"intent": "sunrise_inquiry"}'),
((SELECT id FROM chat_sessions WHERE session_name = '호미곶 일출 투어 문의' LIMIT 1), 'assistant', '호미곶에서 일출을 보시려면 새벽 5-6시경에 도착하시는 것을 추천드립니다. "호미곶 일출 투어" 코스가 있습니다.', '{"recommendation": "course"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 맛집 추천' LIMIT 1), 'user', '포항에서 맛있는 해산물을 먹을 수 있는 곳이 있나요?', '{"intent": "food_recommendation"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 맛집 추천' LIMIT 1), 'assistant', '포항시장과 청하 공진시장에서 신선한 해산물을 맛보실 수 있습니다. "포항 맛집 탐방" 코스를 추천드립니다.', '{"recommendation": "course"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 역사 문화 문의' LIMIT 1), 'user', '포항의 역사를 배울 수 있는 곳이 있나요?', '{"intent": "history_inquiry"}'),
((SELECT id FROM chat_sessions WHERE session_name = '포항 역사 문화 문의' LIMIT 1), 'assistant', '장기유배문화체험촌에서 포항의 역사를 배우실 수 있습니다. "포항 문화유적 탐방" 코스를 추천드립니다.', '{"recommendation": "course"}');

-- =============================================
-- 14. 완료 메시지
-- =============================================

SELECT '포항 스토리 텔러 사용자 참여 데이터가 성공적으로 삽입되었습니다.' as message;
