-- 포항 스토리텔러 통합 스키마 마이그레이션
-- 생성일: 2025-01-27
-- 설명: 모든 기능을 포함한 통합 데이터베이스 스키마
-- Supabase Migration SQL Guideline 준수

-- =============================================
-- 1. 확장 프로그램 활성화
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- 2. 사용자 관련 테이블
-- =============================================

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 선호도 테이블
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    interests TEXT[] DEFAULT '{}',
    travel_style TEXT CHECK (travel_style IN ('relaxed', 'active', 'cultural')),
    budget_range TEXT CHECK (budget_range IN ('low', 'medium', 'high')),
    language TEXT DEFAULT 'ko',
    notifications_enabled BOOLEAN DEFAULT true,
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. 코스 및 스토리 관련 테이블
-- =============================================

-- 코스 카테고리 테이블
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코스 테이블
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    full_description TEXT,
    category_id UUID REFERENCES course_categories(id),
    duration_hours INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    distance_km DECIMAL(5,2),
    estimated_cost INTEGER,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    tags TEXT[],
    target_audience TEXT[],
    season_suitability TEXT[],
    weather_suitability TEXT[],
    activity_level TEXT,
    popularity_score DECIMAL(3,2) DEFAULT 0.0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 방문지 테이블
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    coordinates GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    qr_code TEXT UNIQUE,
    image_url TEXT,
    stamp_image_url TEXT,
    visit_duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코스-방문지 연결 테이블
CREATE TABLE IF NOT EXISTS courses_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, location_id),
    UNIQUE(course_id, order_index)
);

-- 경로 테이블
CREATE TABLE IF NOT EXISTS courses_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    stroke_weight INTEGER DEFAULT 3,
    stroke_opacity DECIMAL(3,2) DEFAULT 0.8,
    is_main_route BOOLEAN DEFAULT false,
    coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. 스탬프 시스템 테이블
-- =============================================

-- 스탬프 기본 정보 테이블
CREATE TABLE IF NOT EXISTS stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    qr_code TEXT UNIQUE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 스탬프 테이블
CREATE TABLE IF NOT EXISTS user_stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points INTEGER DEFAULT 10,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_verified BOOLEAN DEFAULT false,
    verification_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- =============================================
-- 5. 앨범 시스템 테이블
-- =============================================

-- 앨범 테이블
CREATE TABLE IF NOT EXISTS albums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    template_type VARCHAR(50) DEFAULT 'grid' CHECK (template_type IN ('grid', 'timeline', 'travel')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 아이템 테이블
CREATE TABLE IF NOT EXISTS album_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    media_file_id UUID,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('image', 'video', 'stamp', 'text', 'location')),
    content TEXT,
    media_url TEXT,
    metadata JSONB,
    position INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. 미디어 관리 시스템 테이블
-- =============================================

-- 미디어 파일 테이블
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'audio')),
    file_size BIGINT NOT NULL,
    file_path TEXT NOT NULL,
    storage_url TEXT,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    location_data JSONB,
    tags TEXT[],
    metadata JSONB,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. 기념품 시스템 테이블
-- =============================================

-- 기념품 템플릿 테이블
CREATE TABLE IF NOT EXISTS souvenir_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    template_type TEXT NOT NULL,
    category TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    dimensions JSONB,
    materials JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 테이블
CREATE TABLE IF NOT EXISTS souvenirs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES souvenir_templates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    image_url TEXT,
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'completed' CHECK (status IN ('draft', 'pending', 'completed', 'cancelled')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. 커뮤니티 시스템 테이블
-- =============================================

-- 게시물 테이블
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    location_data JSONB,
    location TEXT,
    mood TEXT,
    post_type TEXT DEFAULT 'general' CHECK (post_type IN ('general', 'review', 'question', 'announcement')),
    is_public BOOLEAN DEFAULT true,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 북마크 테이블
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- =============================================
-- 9. AI 추천 시스템 테이블
-- =============================================

-- 사용자 코스 상호작용 테이블
CREATE TABLE IF NOT EXISTS user_course_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'bookmark', 'start', 'complete')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코스 추천 테이블
CREATE TABLE IF NOT EXISTS course_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    recommendation_score DECIMAL(5,2) NOT NULL,
    recommendation_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 10. 인덱스 생성
-- =============================================

-- 기본 성능 인덱스
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_user_stamps_user_id ON user_stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stamps_location_id ON user_stamps(location_id);
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_public ON posts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING gin(hashtags);
CREATE INDEX IF NOT EXISTS idx_likes_user_post ON likes(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_post ON bookmarks(user_id, post_id);

-- 미디어 파일 인덱스
CREATE INDEX IF NOT EXISTS idx_media_files_user ON media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_tags ON media_files USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_media_files_location ON media_files USING gin(location_data);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);
CREATE INDEX IF NOT EXISTS idx_media_files_is_public ON media_files(is_public);

-- 스탬프 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_stamps_location ON stamps(location_id);
CREATE INDEX IF NOT EXISTS idx_stamps_active ON stamps(is_active) WHERE is_active = true;

-- AI 추천 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_user_course_interactions_user ON user_course_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_interactions_course ON user_course_interactions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_user ON course_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_course ON course_recommendations(course_id);

-- =============================================
-- 11. RLS (Row Level Security) 정책 설정
-- =============================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;

-- 개발용 간단한 RLS 정책 (모든 작업 허용)
CREATE POLICY "Allow all operations for development" ON profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON user_preferences
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON courses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON locations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON courses_locations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON courses_routes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON user_stamps
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON albums
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON album_items
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON media_files
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON posts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON likes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON comments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON bookmarks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON user_course_interactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON stamps
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON souvenirs
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON course_recommendations
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 12. 함수 및 트리거 생성
-- =============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stamps_updated_at BEFORE UPDATE ON user_stamps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_album_items_updated_at BEFORE UPDATE ON album_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_souvenirs_updated_at BEFORE UPDATE ON souvenirs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stamps_updated_at BEFORE UPDATE ON stamps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 13. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '통합 스키마 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '포항 스토리텔러 시스템이 준비되었습니다.';
END $$;
