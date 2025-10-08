-- 앨범 시스템을 위한 데이터베이스 스키마
-- 포항 스토리 텔러 나의 기록 앨범 시스템

-- 앨범 테이블
CREATE TABLE IF NOT EXISTS albums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    theme VARCHAR(50) DEFAULT 'general' CHECK (theme IN ('nature', 'history', 'food', 'culture', 'general')),
    is_public BOOLEAN DEFAULT false,
    is_auto_generated BOOLEAN DEFAULT true,
    generation_trigger VARCHAR(50) DEFAULT 'stamp_collection' CHECK (generation_trigger IN ('stamp_collection', 'date_based', 'location_based', 'manual')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 아이템 테이블 (스탬프, 사진, 영상, 텍스트)
CREATE TABLE IF NOT EXISTS album_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('stamp', 'photo', 'video', 'text', 'location')),
    content_id UUID, -- 참조하는 원본 데이터의 ID (user_stamps.id, media_files.id 등)
    title VARCHAR(200),
    description TEXT,
    content_url TEXT,
    thumbnail_url TEXT,
    metadata JSONB, -- 추가 메타데이터 (위치, 날짜, 태그 등)
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 미디어 파일 테이블
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB, -- EXIF 데이터, 촬영 정보 등
    location_id UUID REFERENCES locations(id),
    captured_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_processed BOOLEAN DEFAULT false
);

-- 앨범 템플릿 테이블
CREATE TABLE IF NOT EXISTS album_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_config JSONB NOT NULL, -- 레이아웃, 스타일 설정
    theme VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 공유 테이블
CREATE TABLE IF NOT EXISTS album_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    share_type VARCHAR(20) DEFAULT 'public' CHECK (share_type IN ('public', 'private', 'link')),
    share_token TEXT UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 태그 테이블
CREATE TABLE IF NOT EXISTS album_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(album_id, tag_name)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_theme ON albums(theme);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at);
CREATE INDEX IF NOT EXISTS idx_album_items_album_id ON album_items(album_id);
CREATE INDEX IF NOT EXISTS idx_album_items_type ON album_items(item_type);
CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_location_id ON media_files(location_id);
CREATE INDEX IF NOT EXISTS idx_album_shares_album_id ON album_shares(album_id);
CREATE INDEX IF NOT EXISTS idx_album_shares_token ON album_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_album_tags_album_id ON album_tags(album_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tags ENABLE ROW LEVEL SECURITY;

-- 앨범 정책
CREATE POLICY "Users can view own albums" ON albums
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public albums" ON albums
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own albums" ON albums
    FOR ALL USING (auth.uid() = user_id);

-- 앨범 아이템 정책
CREATE POLICY "Users can view album items from accessible albums" ON album_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM albums 
            WHERE albums.id = album_items.album_id 
            AND (albums.user_id = auth.uid() OR albums.is_public = true)
        )
    );

CREATE POLICY "Users can manage album items from own albums" ON album_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM albums 
            WHERE albums.id = album_items.album_id 
            AND albums.user_id = auth.uid()
        )
    );

-- 미디어 파일 정책
CREATE POLICY "Users can manage own media files" ON media_files
    FOR ALL USING (auth.uid() = user_id);

-- 앨범 공유 정책
CREATE POLICY "Users can manage shares for own albums" ON album_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM albums 
            WHERE albums.id = album_shares.album_id 
            AND albums.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view public shares" ON album_shares
    FOR SELECT USING (share_type = 'public');

-- 앨범 태그 정책
CREATE POLICY "Users can manage tags for own albums" ON album_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM albums 
            WHERE albums.id = album_tags.album_id 
            AND albums.user_id = auth.uid()
        )
    );

-- 트리거 함수: 앨범 자동 생성
CREATE OR REPLACE FUNCTION auto_generate_album()
RETURNS TRIGGER AS $$
DECLARE
    new_album_id UUID;
    album_title TEXT;
    album_description TEXT;
    album_theme VARCHAR(50);
BEGIN
    -- 스탬프 획득 시 자동 앨범 생성 로직
    IF TG_TABLE_NAME = 'user_stamps' AND TG_OP = 'INSERT' THEN
        -- 날짜별 앨범 생성 (오늘 날짜 기준)
        SELECT 
            '포항 여행 기록 - ' || TO_CHAR(NOW(), 'YYYY년 MM월 DD일'),
            '오늘 포항에서의 소중한 여행 기록들',
            CASE 
                WHEN EXTRACT(HOUR FROM NOW()) BETWEEN 6 AND 11 THEN 'morning'
                WHEN EXTRACT(HOUR FROM NOW()) BETWEEN 12 AND 17 THEN 'afternoon'
                WHEN EXTRACT(HOUR FROM NOW()) BETWEEN 18 AND 23 THEN 'evening'
                ELSE 'night'
            END
        INTO album_title, album_description, album_theme;

        -- 오늘 날짜의 앨범이 있는지 확인
        SELECT id INTO new_album_id
        FROM albums
        WHERE user_id = NEW.user_id
        AND DATE(created_at) = CURRENT_DATE
        AND generation_trigger = 'stamp_collection'
        LIMIT 1;

        -- 앨범이 없으면 새로 생성
        IF new_album_id IS NULL THEN
            INSERT INTO albums (user_id, title, description, theme, is_auto_generated, generation_trigger)
            VALUES (NEW.user_id, album_title, album_description, album_theme, true, 'stamp_collection')
            RETURNING id INTO new_album_id;
        END IF;

        -- 스탬프를 앨범에 추가
        INSERT INTO album_items (album_id, item_type, content_id, title, description, content_url, metadata)
        VALUES (
            new_album_id,
            'stamp',
            NEW.id,
            (SELECT name FROM locations WHERE id = NEW.location_id),
            (SELECT description FROM locations WHERE id = NEW.location_id),
            (SELECT image_url FROM locations WHERE id = NEW.location_id),
            jsonb_build_object(
                'location_id', NEW.location_id,
                'acquired_at', NEW.acquired_at,
                'points', NEW.points,
                'rarity', NEW.rarity
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_auto_generate_album
    AFTER INSERT ON user_stamps
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_album();

-- 뷰 생성: 사용자 앨범 통계
CREATE OR REPLACE VIEW user_album_stats AS
SELECT 
    a.user_id,
    COUNT(*) as total_albums,
    COUNT(CASE WHEN a.is_auto_generated = true THEN 1 END) as auto_albums,
    COUNT(CASE WHEN a.is_public = true THEN 1 END) as public_albums,
    COUNT(ai.id) as total_items,
    COUNT(CASE WHEN ai.item_type = 'stamp' THEN 1 END) as stamp_items,
    COUNT(CASE WHEN ai.item_type = 'photo' THEN 1 END) as photo_items,
    COUNT(CASE WHEN ai.item_type = 'video' THEN 1 END) as video_items,
    MAX(a.created_at) as last_album_created
FROM albums a
LEFT JOIN album_items ai ON a.id = ai.album_id
GROUP BY a.user_id;

-- 뷰 생성: 인기 앨범 (공개 앨범 중 조회수 기준)
CREATE OR REPLACE VIEW popular_albums AS
SELECT 
    a.id,
    a.title,
    a.description,
    a.cover_image_url,
    a.theme,
    a.created_at,
    COUNT(ai.id) as item_count,
    COALESCE(SUM(ash.view_count), 0) as total_views
FROM albums a
LEFT JOIN album_items ai ON a.id = ai.album_id
LEFT JOIN album_shares ash ON a.id = ash.album_id
WHERE a.is_public = true
GROUP BY a.id, a.title, a.description, a.cover_image_url, a.theme, a.created_at
ORDER BY total_views DESC, item_count DESC;

-- 샘플 앨범 템플릿 데이터
INSERT INTO album_templates (name, description, template_config, theme) VALUES
('기본 레이아웃', '간단하고 깔끔한 기본 레이아웃', '{"layout": "grid", "columns": 2, "spacing": "medium"}', 'general'),
('타임라인', '시간순으로 정렬된 타임라인 레이아웃', '{"layout": "timeline", "orientation": "vertical", "show_dates": true}', 'general'),
('갤러리', '이미지 중심의 갤러리 레이아웃', '{"layout": "masonry", "image_focus": true, "show_captions": true}', 'general'),
('스토리북', '스토리텔링 중심의 레이아웃', '{"layout": "story", "text_heavy": true, "show_progress": true}', 'general');
