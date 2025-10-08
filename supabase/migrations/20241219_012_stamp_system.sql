-- 스탬프 시스템을 위한 데이터베이스 스키마
-- 포항 스토리 텔러 QR 스탬프 투어 시스템

-- 사용자 스탬프 테이블
CREATE TABLE IF NOT EXISTS user_stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points INTEGER DEFAULT 10,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_verified BOOLEAN DEFAULT false,
    verification_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 중복 스탬프 방지
    UNIQUE(user_id, location_id)
);

-- 스탬프 획득 기록 테이블
CREATE TABLE IF NOT EXISTS stamp_acquisitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_stamp_id UUID REFERENCES user_stamps(id) ON DELETE CASCADE,
    acquisition_method VARCHAR(20) DEFAULT 'qr_scan' CHECK (acquisition_method IN ('qr_scan', 'manual', 'gift')),
    qr_code_data TEXT,
    device_info JSONB,
    location_coordinates GEOMETRY(POINT, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 스탬프 컬렉션 테이블 (사용자별 컬렉션 관리)
CREATE TABLE IF NOT EXISTS stamp_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 스탬프 컬렉션 아이템 (컬렉션에 포함된 스탬프들)
CREATE TABLE IF NOT EXISTS collection_stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES stamp_collections(id) ON DELETE CASCADE,
    user_stamp_id UUID REFERENCES user_stamps(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(collection_id, user_stamp_id)
);

-- 스탬프 업적 시스템
CREATE TABLE IF NOT EXISTS stamp_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    badge_image_url TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_type)
);

-- 스탬프 공유 테이블
CREATE TABLE IF NOT EXISTS stamp_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_stamp_id UUID REFERENCES user_stamps(id) ON DELETE CASCADE,
    share_type VARCHAR(20) DEFAULT 'social' CHECK (share_type IN ('social', 'private', 'public')),
    platform VARCHAR(20),
    share_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_stamps_user_id ON user_stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stamps_location_id ON user_stamps(location_id);
CREATE INDEX IF NOT EXISTS idx_user_stamps_acquired_at ON user_stamps(acquired_at);
CREATE INDEX IF NOT EXISTS idx_user_stamps_rarity ON user_stamps(rarity);
CREATE INDEX IF NOT EXISTS idx_stamp_acquisitions_user_stamp_id ON stamp_acquisitions(user_stamp_id);
CREATE INDEX IF NOT EXISTS idx_stamp_collections_user_id ON stamp_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_stamp_achievements_user_id ON stamp_achievements(user_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_acquisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_shares ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 스탬프만 조회/수정 가능
CREATE POLICY "Users can view own stamps" ON user_stamps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps" ON user_stamps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stamps" ON user_stamps
    FOR UPDATE USING (auth.uid() = user_id);

-- 스탬프 획득 기록 정책
CREATE POLICY "Users can view own acquisitions" ON stamp_acquisitions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_stamps 
            WHERE user_stamps.id = stamp_acquisitions.user_stamp_id 
            AND user_stamps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own acquisitions" ON stamp_acquisitions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_stamps 
            WHERE user_stamps.id = stamp_acquisitions.user_stamp_id 
            AND user_stamps.user_id = auth.uid()
        )
    );

-- 컬렉션 정책
CREATE POLICY "Users can manage own collections" ON stamp_collections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collection stamps" ON collection_stamps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stamp_collections 
            WHERE stamp_collections.id = collection_stamps.collection_id 
            AND stamp_collections.user_id = auth.uid()
        )
    );

-- 업적 정책
CREATE POLICY "Users can view own achievements" ON stamp_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON stamp_achievements
    FOR INSERT WITH CHECK (true);

-- 공유 정책
CREATE POLICY "Users can manage own shares" ON stamp_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_stamps 
            WHERE user_stamps.id = stamp_shares.user_stamp_id 
            AND user_stamps.user_id = auth.uid()
        )
    );

-- 트리거 함수: 스탬프 획득 시 자동 업적 체크
CREATE OR REPLACE FUNCTION check_stamp_achievements()
RETURNS TRIGGER AS $$
DECLARE
    user_stamp_count INTEGER;
    rare_stamp_count INTEGER;
    epic_stamp_count INTEGER;
    legendary_stamp_count INTEGER;
BEGIN
    -- 사용자의 총 스탬프 수
    SELECT COUNT(*) INTO user_stamp_count
    FROM user_stamps
    WHERE user_id = NEW.user_id;

    -- 희귀 스탬프 수
    SELECT COUNT(*) INTO rare_stamp_count
    FROM user_stamps
    WHERE user_id = NEW.user_id AND rarity = 'rare';

    SELECT COUNT(*) INTO epic_stamp_count
    FROM user_stamps
    WHERE user_id = NEW.user_id AND rarity = 'epic';

    SELECT COUNT(*) INTO legendary_stamp_count
    FROM user_stamps
    WHERE user_id = NEW.user_id AND rarity = 'legendary';

    -- 업적 체크 및 부여
    -- 첫 스탬프
    IF user_stamp_count = 1 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'first_stamp', '첫 스탬프', '첫 번째 스탬프를 획득했습니다!', 50)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    -- 10개 스탬프
    IF user_stamp_count = 10 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'stamp_collector', '스탬프 수집가', '10개의 스탬프를 획득했습니다!', 100)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    -- 50개 스탬프
    IF user_stamp_count = 50 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'stamp_master', '스탬프 마스터', '50개의 스탬프를 획득했습니다!', 500)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    -- 레어 스탬프 5개
    IF rare_stamp_count = 5 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'rare_collector', '레어 수집가', '5개의 레어 스탬프를 획득했습니다!', 200)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    -- 에픽 스탬프 3개
    IF epic_stamp_count = 3 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'epic_collector', '에픽 수집가', '3개의 에픽 스탬프를 획득했습니다!', 300)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    -- 레전더리 스탬프 1개
    IF legendary_stamp_count = 1 THEN
        INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded)
        VALUES (NEW.user_id, 'legendary_collector', '레전더리 수집가', '레전더리 스탬프를 획득했습니다!', 1000)
        ON CONFLICT (user_id, achievement_type) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_check_stamp_achievements
    AFTER INSERT ON user_stamps
    FOR EACH ROW
    EXECUTE FUNCTION check_stamp_achievements();

-- 샘플 데이터 삽입 (개발용)
INSERT INTO stamp_collections (user_id, name, description, is_public) VALUES
    (auth.uid(), '포항 여행 기록', '포항에서의 소중한 여행 기록들', true),
    (auth.uid(), '맛집 투어', '포항의 맛있는 곳들', false),
    (auth.uid(), '역사 탐방', '포항의 역사적 장소들', true);

-- 뷰 생성: 사용자 스탬프 통계
CREATE OR REPLACE VIEW user_stamp_stats AS
SELECT 
    us.user_id,
    COUNT(*) as total_stamps,
    SUM(us.points) as total_points,
    COUNT(CASE WHEN us.rarity = 'rare' THEN 1 END) as rare_count,
    COUNT(CASE WHEN us.rarity = 'epic' THEN 1 END) as epic_count,
    COUNT(CASE WHEN us.rarity = 'legendary' THEN 1 END) as legendary_count,
    ROUND(
        (COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM locations WHERE is_active = true)) * 100, 
        2
    ) as completion_rate
FROM user_stamps us
GROUP BY us.user_id;

-- 뷰 생성: 인기 스탬프 (획득자 수 기준)
CREATE OR REPLACE VIEW popular_stamps AS
SELECT 
    l.id as location_id,
    l.name as location_name,
    l.image_url,
    COUNT(us.id) as acquisition_count,
    AVG(us.points) as avg_points
FROM locations l
LEFT JOIN user_stamps us ON l.id = us.location_id
WHERE l.is_active = true
GROUP BY l.id, l.name, l.image_url
ORDER BY acquisition_count DESC, avg_points DESC;
