-- 포항 스토리텔러 통합 스키마 마이그레이션
-- 생성일: 2025-01-10
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
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
    category_id UUID REFERENCES course_categories(id),
    duration_minutes INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
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
CREATE TABLE IF NOT EXISTS course_locations (
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
CREATE TABLE IF NOT EXISTS routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    waypoints JSONB NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    description TEXT,
    stroke_weight INTEGER DEFAULT 3,
    stroke_opacity DECIMAL(3,2) DEFAULT 0.8,
    is_main_route BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. 스탬프 시스템 테이블
-- =============================================

-- 스탬프 기본 정보 테이블
CREATE TABLE IF NOT EXISTS stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
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

-- 스탬프 컬렉션 테이블
CREATE TABLE IF NOT EXISTS stamp_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 스탬프 컬렉션 아이템 테이블
CREATE TABLE IF NOT EXISTS collection_stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES stamp_collections(id) ON DELETE CASCADE,
    user_stamp_id UUID REFERENCES user_stamps(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, user_stamp_id)
);

-- 스탬프 업적 테이블
CREATE TABLE IF NOT EXISTS stamp_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    badge_image_url TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
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
    media_file_id UUID, -- 외래키는 나중에 추가
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

-- 앨범 템플릿 테이블
CREATE TABLE IF NOT EXISTS album_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('grid', 'timeline', 'travel')),
    layout_config JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 공유 테이블
CREATE TABLE IF NOT EXISTS album_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    shared_with UUID REFERENCES profiles(id) ON DELETE CASCADE,
    share_token VARCHAR(255) UNIQUE,
    permissions VARCHAR(50) DEFAULT 'view' CHECK (permissions IN ('view', 'edit')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    storage_url TEXT, -- Base64 인코딩된 파일 데이터 또는 Storage URL
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- 영상/오디오 길이 (초)
    location_data JSONB, -- GPS 좌표 및 위치 정보
    tags TEXT[],
    metadata JSONB, -- 촬영 기기, 설정 등
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. 기념품 시스템 테이블
-- =============================================

-- 기념품 테이블
CREATE TABLE IF NOT EXISTS souvenirs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID, -- 외래키는 나중에 추가
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

-- 기념품 템플릿 테이블
CREATE TABLE IF NOT EXISTS souvenir_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL,
    category TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    dimensions JSONB,
    materials JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 프로젝트 테이블
CREATE TABLE IF NOT EXISTS souvenir_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES souvenir_templates(id),
    title TEXT NOT NULL,
    description TEXT,
    design_data JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'production', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 주문 테이블
CREATE TABLE IF NOT EXISTS souvenir_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES souvenir_projects(id),
    order_number TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    payment_info JSONB,
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

-- 댓글 좋아요 테이블
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
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
-- 10. 외래키 제약조건 추가
-- =============================================

-- album_items 테이블의 media_file_id 외래키 추가
ALTER TABLE album_items 
ADD CONSTRAINT fk_album_items_media_file_id 
FOREIGN KEY (media_file_id) REFERENCES media_files(id) ON DELETE CASCADE;

-- souvenirs 테이블의 template_id 외래키 추가
ALTER TABLE souvenirs 
ADD CONSTRAINT fk_souvenirs_template_id 
FOREIGN KEY (template_id) REFERENCES souvenir_templates(id) ON DELETE SET NULL;

-- =============================================
-- 11. 인덱스 생성
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

-- 앨범 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_albums_template_type ON albums(template_type);
CREATE INDEX IF NOT EXISTS idx_album_items_album ON album_items(album_id);
CREATE INDEX IF NOT EXISTS idx_album_items_type ON album_items(item_type);
CREATE INDEX IF NOT EXISTS idx_album_items_position ON album_items(album_id, position);
CREATE INDEX IF NOT EXISTS idx_album_shares_album_id ON album_shares(album_id);
CREATE INDEX IF NOT EXISTS idx_album_shares_shared_with ON album_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_album_shares_token ON album_shares(share_token);

-- 스탬프 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_stamps_location ON stamps(location_id);
CREATE INDEX IF NOT EXISTS idx_stamps_active ON stamps(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stamp_collections_user ON stamp_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_stamps_collection ON collection_stamps(collection_id);
CREATE INDEX IF NOT EXISTS idx_stamp_achievements_user ON stamp_achievements(user_id);

-- 기념품 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_souvenirs_category ON souvenirs(category);
CREATE INDEX IF NOT EXISTS idx_souvenirs_available ON souvenirs(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_souvenir_orders_user ON souvenir_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_orders_status ON souvenir_orders(status);

-- AI 추천 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_user_course_interactions_user ON user_course_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_interactions_course ON user_course_interactions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_user ON course_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_course ON course_recommendations(course_id);

-- =============================================
-- 12. RLS (Row Level Security) 정책 설정
-- =============================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamp_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;

-- 기존 RLS 정책 삭제 후 개발용 간단한 RLS 정책 생성
DO $$
DECLARE
    table_name TEXT;
    policy_name TEXT;
    tables TEXT[] := ARRAY[
        'profiles', 'user_preferences', 'courses', 'locations', 'course_locations', 
        'routes', 'user_stamps', 'stamp_collections', 'albums', 'album_items', 
        'album_templates', 'album_shares', 'media_files', 'posts', 'likes', 
        'comments', 'bookmarks', 'user_course_interactions', 'stamps', 'souvenirs', 
        'souvenir_orders', 'stamp_achievements', 'collection_stamps', 'course_recommendations'
    ];
BEGIN
    -- 각 테이블의 기존 정책 삭제
    FOREACH table_name IN ARRAY tables LOOP
        FOR policy_name IN 
            SELECT policyname FROM pg_policies WHERE tablename = table_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
        END LOOP;
    END LOOP;
END $$;

-- 개발용 간단한 RLS 정책 (모든 작업 허용)
CREATE POLICY "Allow all operations for development" ON profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON user_preferences
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON courses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON locations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON course_locations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON routes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON user_stamps
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON stamp_collections
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON albums
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON album_items
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON album_templates
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON album_shares
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

CREATE POLICY "Allow all operations for development" ON souvenir_orders
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON stamp_achievements
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON collection_stamps
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for development" ON course_recommendations
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 13. 함수 및 트리거 생성
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

CREATE TRIGGER update_stamp_collections_updated_at BEFORE UPDATE ON stamp_collections
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

CREATE TRIGGER update_souvenir_orders_updated_at BEFORE UPDATE ON souvenir_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stamps_updated_at BEFORE UPDATE ON stamps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_souvenirs_updated_at BEFORE UPDATE ON souvenirs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stamp_achievements_updated_at BEFORE UPDATE ON stamp_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 14. 미디어 관리 함수들
-- =============================================

-- 미디어 검색 함수
CREATE OR REPLACE FUNCTION search_media_files(
  p_user_id UUID,
  p_search_term TEXT DEFAULT NULL,
  p_file_type TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_date_from TIMESTAMP DEFAULT NULL,
  p_date_to TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  file_path TEXT,
  storage_url TEXT,
  tags TEXT[],
  location_data JSONB,
  metadata JSONB,
  is_public BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mf.id, 
    mf.file_name, 
    mf.file_type, 
    mf.file_size,
    mf.file_path,
    mf.storage_url,
    mf.tags, 
    mf.location_data,
    mf.metadata,
    mf.is_public,
    mf.created_at,
    mf.updated_at
  FROM media_files mf
  WHERE mf.user_id = p_user_id
    AND (p_search_term IS NULL OR mf.file_name ILIKE '%' || p_search_term || '%')
    AND (p_file_type IS NULL OR mf.file_type = p_file_type)
    AND (p_tags IS NULL OR mf.tags && p_tags)
    AND (p_date_from IS NULL OR mf.created_at >= p_date_from)
    AND (p_date_to IS NULL OR mf.created_at <= p_date_to)
  ORDER BY mf.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 미디어 통계 함수
CREATE OR REPLACE FUNCTION get_media_stats(p_user_id UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  image_count BIGINT,
  image_size BIGINT,
  video_count BIGINT,
  video_size BIGINT,
  audio_count BIGINT,
  audio_size BIGINT,
  public_files BIGINT,
  private_files BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(mf.id)::BIGINT AS total_files,
    COALESCE(SUM(mf.file_size), 0)::BIGINT AS total_size,
    COUNT(CASE WHEN mf.file_type = 'image' THEN 1 END)::BIGINT AS image_count,
    COALESCE(SUM(CASE WHEN mf.file_type = 'image' THEN mf.file_size ELSE 0 END), 0)::BIGINT AS image_size,
    COUNT(CASE WHEN mf.file_type = 'video' THEN 1 END)::BIGINT AS video_count,
    COALESCE(SUM(CASE WHEN mf.file_type = 'video' THEN mf.file_size ELSE 0 END), 0)::BIGINT AS video_size,
    COUNT(CASE WHEN mf.file_type = 'audio' THEN 1 END)::BIGINT AS audio_count,
    COALESCE(SUM(CASE WHEN mf.file_type = 'audio' THEN mf.file_size ELSE 0 END), 0)::BIGINT AS audio_size,
    COUNT(CASE WHEN mf.is_public = TRUE THEN 1 END)::BIGINT AS public_files,
    COUNT(CASE WHEN mf.is_public = FALSE THEN 1 END)::BIGINT AS private_files
  FROM media_files mf
  WHERE mf.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 자동 분류 함수
CREATE OR REPLACE FUNCTION auto_classify_media()
RETURNS TRIGGER AS $$
BEGIN
  -- 파일 타입별 자동 태그 추가
  IF NEW.file_type = 'image' THEN
    NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY['사진'];
  ELSIF NEW.file_type = 'video' THEN
    NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY['영상'];
  ELSIF NEW.file_type = 'audio' THEN
    NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY['오디오'];
  END IF;

  -- 위치 정보 기반 태그 추가
  IF NEW.location_data IS NOT NULL THEN
    NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY[NEW.location_data->>'location_name'];
  END IF;

  -- 날짜 기반 태그 추가
  NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY[TO_CHAR(NEW.created_at, 'YYYY년'), TO_CHAR(NEW.created_at, 'MM월')];

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 자동 분류 트리거
CREATE TRIGGER trigger_auto_classify_media
  BEFORE INSERT ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION auto_classify_media();

-- =============================================
-- 15. 커뮤니티 함수들
-- =============================================

-- 게시물 검색 함수
CREATE OR REPLACE FUNCTION search_posts(
    search_query TEXT DEFAULT '',
    category_filter TEXT DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    date_from TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    date_to TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    author_id UUID,
    content TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    location_data JSONB,
    mood TEXT,
    post_type TEXT,
    is_public BOOLEAN,
    like_count INTEGER,
    comment_count INTEGER,
    share_count INTEGER,
    bookmark_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    author_name TEXT,
    author_avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.author_id,
        p.content,
        p.media_urls,
        p.hashtags,
        p.location_data,
        p.mood,
        p.post_type,
        p.is_public,
        p.like_count,
        p.comment_count,
        p.share_count,
        p.bookmark_count,
        p.created_at,
        p.updated_at,
        pr.name as author_name,
        pr.avatar_url as author_avatar_url
    FROM posts p
    JOIN profiles pr ON p.author_id = pr.id
    WHERE 
        p.is_public = true
        AND (search_query = '' OR p.content ILIKE '%' || search_query || '%')
        AND (category_filter IS NULL OR p.post_type = category_filter)
        AND (location_filter IS NULL OR p.location_data::text ILIKE '%' || location_filter || '%')
        AND (date_from IS NULL OR p.created_at >= date_from)
        AND (date_to IS NULL OR p.created_at <= date_to)
    ORDER BY p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 인기 게시물 조회 함수
CREATE OR REPLACE FUNCTION get_popular_posts(
    time_period TEXT DEFAULT 'week',
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    author_id UUID,
    content TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    location_data JSONB,
    mood TEXT,
    post_type TEXT,
    is_public BOOLEAN,
    like_count INTEGER,
    comment_count INTEGER,
    share_count INTEGER,
    bookmark_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    author_name TEXT,
    author_avatar_url TEXT,
    popularity_score DECIMAL
) AS $$
DECLARE
    time_filter TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 시간 필터 설정
    IF time_period = 'day' THEN
        time_filter := NOW() - INTERVAL '1 day';
    ELSIF time_period = 'week' THEN
        time_filter := NOW() - INTERVAL '7 days';
    ELSIF time_period = 'month' THEN
        time_filter := NOW() - INTERVAL '1 month';
    ELSIF time_period = 'year' THEN
        time_filter := NOW() - INTERVAL '1 year';
    ELSE
        time_filter := NOW() - INTERVAL '7 days';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.author_id,
        p.content,
        p.media_urls,
        p.hashtags,
        p.location_data,
        p.mood,
        p.post_type,
        p.is_public,
        p.like_count,
        p.comment_count,
        p.share_count,
        p.bookmark_count,
        p.created_at,
        p.updated_at,
        pr.name as author_name,
        pr.avatar_url as author_avatar_url,
        (p.like_count * 1.0 + p.comment_count * 2.0 + p.share_count * 3.0 + p.bookmark_count * 1.5) as popularity_score
    FROM posts p
    JOIN profiles pr ON p.author_id = pr.id
    WHERE 
        p.is_public = true
        AND p.created_at >= time_filter
    ORDER BY popularity_score DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 16. AI 추천 시스템 함수들
-- =============================================

-- 협업 필터링 추천 함수
CREATE OR REPLACE FUNCTION get_collaborative_recommendations(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    course_id UUID,
    title TEXT,
    description TEXT,
    category_name TEXT,
    duration_minutes INTEGER,
    difficulty TEXT,
    distance_km DECIMAL,
    estimated_cost INTEGER,
    image_url TEXT,
    rating DECIMAL,
    recommendation_score DECIMAL,
    recommendation_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_interactions AS (
        SELECT 
            course_id,
            interaction_type,
            created_at,
            CASE 
                WHEN interaction_type = 'view' THEN 1.0
                WHEN interaction_type = 'like' THEN 3.0
                WHEN interaction_type = 'bookmark' THEN 2.0
                WHEN interaction_type = 'start' THEN 4.0
                WHEN interaction_type = 'complete' THEN 5.0
                ELSE 1.0
            END as weight
        FROM user_course_interactions
        WHERE user_id = user_uuid
    ),
    similar_users AS (
        SELECT 
            uci2.user_id,
            SUM(uci1.weight * uci2.weight) as similarity_score
        FROM user_interactions uci1
        JOIN user_course_interactions uci2 ON uci1.course_id = uci2.course_id
        WHERE uci2.user_id != user_uuid
        GROUP BY uci2.user_id
        HAVING SUM(uci1.weight * uci2.weight) > 0
        ORDER BY similarity_score DESC
        LIMIT 50
    ),
    recommended_courses AS (
        SELECT 
            uci.course_id,
            SUM(su.similarity_score * 
                CASE 
                    WHEN uci.interaction_type = 'view' THEN 1.0
                    WHEN uci.interaction_type = 'like' THEN 3.0
                    WHEN uci.interaction_type = 'bookmark' THEN 2.0
                    WHEN uci.interaction_type = 'start' THEN 4.0
                    WHEN uci.interaction_type = 'complete' THEN 5.0
                    ELSE 1.0
                END
            ) as recommendation_score
        FROM user_course_interactions uci
        JOIN similar_users su ON uci.user_id = su.user_id
        WHERE uci.course_id NOT IN (
            SELECT course_id FROM user_interactions
        )
        GROUP BY uci.course_id
        ORDER BY recommendation_score DESC
    )
    SELECT 
        c.id as course_id,
        c.title,
        c.description,
        cc.name as category_name,
        c.duration_minutes,
        c.difficulty,
        c.distance_km,
        c.estimated_cost,
        c.image_url,
        c.rating,
        rc.recommendation_score,
        '비슷한 사용자들이 좋아한 코스' as recommendation_reason
    FROM recommended_courses rc
    JOIN courses c ON rc.course_id = c.id
    JOIN course_categories cc ON c.category_id = cc.id
    WHERE c.is_active = true
    ORDER BY rc.recommendation_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 17. 테스트 계정 생성
-- =============================================

-- 테스트 사용자 생성
INSERT INTO profiles (id, email, name, username, avatar_url, is_verified, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', '테스트 사용자', 'testuser', 'https://picsum.photos/100/100?random=999', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'manitri@naver.com', '마니트리', 'manitri', 'https://picsum.photos/100/100?random=998', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 테스트 사용자 선호도 설정
INSERT INTO user_preferences (user_id, interests, travel_style, budget_range, language, notifications_enabled, privacy_level, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['자연', '역사', '맛집', '사진'], 'relaxed', 'medium', 'ko', true, 'public', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', ARRAY['여행', '사진', '음식', '문화'], 'active', 'high', 'ko', true, 'public', NOW(), NOW());

-- =============================================
-- 18. 샘플 데이터 삽입
-- =============================================

-- 코스 카테고리 데이터
INSERT INTO course_categories (name, description, icon_url, color) VALUES
('자연경관', '포항의 아름다운 자연을 만날 수 있는 코스', 'https://picsum.photos/100/100?random=1', '#10B981'),
('역사여행', '포항의 역사와 문화를 탐방하는 코스', 'https://picsum.photos/100/100?random=2', '#8B5CF6'),
('골목산책', '포항의 숨겨진 골목길을 걸어보는 코스', 'https://picsum.photos/100/100?random=3', '#F59E0B'),
('맛집탐방', '포항의 맛있는 음식을 찾아가는 코스', 'https://picsum.photos/100/100?random=4', '#EF4444'),
('가족여행', '가족과 함께 즐길 수 있는 코스', 'https://picsum.photos/100/100?random=5', '#3B82F6'),
('커플여행', '연인과 함께하는 로맨틱한 코스', 'https://picsum.photos/100/100?random=6', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- 방문지 데이터
INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes) VALUES
('죽도시장', '포항의 대표적인 전통시장', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장길 1', 'QR_DEATH_ISLAND_MARKET', 'https://picsum.photos/400/300?random=10', 'https://picsum.photos/200/200?random=110', 60),
('호미곶', '한반도 최동단의 아름다운 해안', ST_SetSRID(ST_MakePoint(129.5670, 36.0760), 4326), '경북 포항시 남구 호미곶면 대보리', 'QR_HOMIGOT', 'https://picsum.photos/400/300?random=11', 'https://picsum.photos/200/200?random=111', 120),
('포항제철소', '한국의 산업역사를 보여주는 대규모 제철소', ST_SetSRID(ST_MakePoint(129.3450, 36.1120), 4326), '경북 포항시 남구 대잠동', 'QR_POSCO', 'https://picsum.photos/400/300?random=12', 'https://picsum.photos/200/200?random=112', 90),
('포항공과대학교', '한국의 대표적인 공과대학', ST_SetSRID(ST_MakePoint(129.3250, 36.0130), 4326), '경북 포항시 남구 청암로 77', 'QR_POSTECH', 'https://picsum.photos/400/300?random=13', 'https://picsum.photos/200/200?random=113', 60),
('포항시립미술관', '현대미술을 감상할 수 있는 문화공간', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_ART_MUSEUM', 'https://picsum.photos/400/300?random=14', 'https://picsum.photos/200/200?random=114', 90),
('영일대해수욕장', '포항의 대표적인 해수욕장', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 240', 'QR_YEONGILDAE', 'https://picsum.photos/400/300?random=15', 'https://picsum.photos/200/200?random=115', 180),
('포항야생탐사관', '동해의 해양생물을 관찰할 수 있는 곳', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 해안로 200', 'QR_AQUARIUM', 'https://picsum.photos/400/300?random=16', 'https://picsum.photos/200/200?random=116', 120),
('포항운하', '도심을 가로지르는 운하공원', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로', 'QR_CANAL', 'https://picsum.photos/400/300?random=17', 'https://picsum.photos/200/200?random=117', 60),
('포항시청', '포항시의 중심 행정기관', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_CITY_HALL', 'https://picsum.photos/400/300?random=18', 'https://picsum.photos/200/200?random=118', 30),
('포항역', '포항의 대표적인 교통 허브', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 중앙로 200', 'QR_STATION', 'https://picsum.photos/400/300?random=19', 'https://picsum.photos/200/200?random=119', 20)
ON CONFLICT (name) DO NOTHING;

-- 코스 데이터
INSERT INTO courses (title, description, category_id, duration_minutes, difficulty, distance_km, estimated_cost, image_url, is_featured, tags, target_audience, season_suitability, weather_suitability, activity_level) VALUES
('포항 해안선 드라이브', '동해의 아름다운 해안선을 따라가는 드라이브 코스', (SELECT id FROM course_categories WHERE name = '자연경관'), 180, 'easy', 45.2, 50000, 'https://picsum.photos/600/400?random=20', true, ARRAY['드라이브', '해안', '자연'], ARRAY['커플', '가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음', '흐림'], 'relaxed'),
('포항 역사 탐방', '포항의 역사적 의미를 찾아가는 탐방 코스', (SELECT id FROM course_categories WHERE name = '역사여행'), 240, 'medium', 8.5, 30000, 'https://picsum.photos/600/400?random=21', true, ARRAY['역사', '문화', '교육'], ARRAY['가족', '학생'], ARRAY['봄', '가을'], ARRAY['맑음'], 'moderate'),
('포항 골목길 산책', '포항의 숨겨진 골목길을 걸어보는 산책 코스', (SELECT id FROM course_categories WHERE name = '골목산책'), 120, 'easy', 3.2, 15000, 'https://picsum.photos/600/400?random=22', false, ARRAY['산책', '골목', '로컬'], ARRAY['커플', '혼자'], ARRAY['봄', '가을'], ARRAY['맑음', '흐림'], 'relaxed'),
('포항 맛집 투어', '포항의 대표적인 맛집들을 찾아가는 투어', (SELECT id FROM course_categories WHERE name = '맛집탐방'), 180, 'easy', 5.8, 80000, 'https://picsum.photos/600/400?random=23', true, ARRAY['맛집', '음식', '투어'], ARRAY['커플', '가족', '친구'], ARRAY['봄', '여름', '가을', '겨울'], ARRAY['맑음', '흐림', '비'], 'moderate'),
('포항 가족 체험', '가족과 함께 즐길 수 있는 체험형 코스', (SELECT id FROM course_categories WHERE name = '가족여행'), 300, 'easy', 12.5, 100000, 'https://picsum.photos/600/400?random=24', false, ARRAY['체험', '가족', '교육'], ARRAY['가족'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'moderate'),
('포항 로맨틱 데이트', '연인과 함께하는 로맨틱한 데이트 코스', (SELECT id FROM course_categories WHERE name = '커플여행'), 240, 'easy', 6.8, 120000, 'https://picsum.photos/600/400?random=25', true, ARRAY['데이트', '로맨틱', '커플'], ARRAY['커플'], ARRAY['봄', '여름', '가을'], ARRAY['맑음'], 'relaxed')
ON CONFLICT (title) DO NOTHING;

-- 앨범 템플릿 데이터
INSERT INTO album_templates (name, description, template_type, layout_config, is_default) VALUES
('기본 그리드', '사진을 격자 형태로 배치하는 기본 템플릿', 'grid', 
 '{"columns": 3, "spacing": "medium", "showCaptions": true, "showDates": true}', true),
('타임라인', '시간 순서대로 콘텐츠를 배치하는 템플릿', 'timeline',
 '{"orientation": "vertical", "showConnectors": true, "dateFormat": "YYYY-MM-DD", "showTimes": true}', false),
('여행 앨범', '여행 기록에 특화된 템플릿', 'travel',
 '{"showMap": true, "showWeather": true, "groupByLocation": true, "showStamps": true}', false)
ON CONFLICT (name) DO NOTHING;

-- 기념품 템플릿 데이터
INSERT INTO souvenir_templates (name, description, template_type, category, base_price, dimensions, materials, is_available) VALUES
('포항 스탬프 앨범', '포항 여행의 추억을 담는 스탬프 앨범', 'album', '기념품', 15000.00, '{"width": 20, "height": 25, "depth": 2}', '{"cover": "가죽", "pages": "종이"}', true),
('호미곶 엽서 세트', '호미곶의 아름다운 풍경이 담긴 엽서 세트', 'postcard', '기념품', 8000.00, '{"width": 15, "height": 10}', '{"paper": "아트지", "finish": "매트"}', true),
('포항 맛집 가이드북', '포항의 맛집 정보가 담긴 가이드북', 'book', '도서', 12000.00, '{"width": 14, "height": 20, "pages": 100}', '{"paper": "코팅지", "binding": "스프링"}', true),
('포항 야생탐사관 스티커팩', '해양생물이 그려진 스티커팩', 'sticker', '기념품', 5000.00, '{"width": 10, "height": 15}', '{"material": "PVC", "finish": "글로시"}', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 19. 테스트 계정용 샘플 데이터 생성
-- =============================================

-- 테스트 계정용 미디어 파일 (5개)
INSERT INTO media_files (id, user_id, file_path, file_name, file_type, file_size, mime_type, tags, location_data, metadata, storage_url, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'uploads/test_001.jpg', '호미곶 일출', 'image', 2048000, 'image/jpeg', ARRAY['일출', '호미곶', '자연'], '{"address": "포항시 남구 호미곶", "description": "호미곶에서 찍은 아름다운 일출 사진"}', '{"description": "호미곶에서 찍은 아름다운 일출 사진"}', 'https://picsum.photos/800/600?random=1001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'uploads/test_002.jpg', '죽도시장 풍경', 'image', 1536000, 'image/jpeg', ARRAY['시장', '전통', '음식'], '{"address": "포항시 북구 죽도시장", "description": "죽도시장의 활기찬 모습"}', '{"description": "죽도시장의 활기찬 모습"}', 'https://picsum.photos/800/600?random=1002', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'uploads/test_003.jpg', '포항제철소 야경', 'image', 3072000, 'image/jpeg', ARRAY['야경', '제철소', '산업'], '{"address": "포항시 남구 포항제철소", "description": "포항제철소의 야간 조명"}', '{"description": "포항제철소의 야간 조명"}', 'https://picsum.photos/800/600?random=1003', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'uploads/test_004.jpg', '영일대해수욕장', 'image', 2560000, 'image/jpeg', ARRAY['바다', '해수욕장', '여름'], '{"address": "포항시 북구 영일대해수욕장", "description": "영일대해수욕장의 푸른 바다"}', '{"description": "영일대해수욕장의 푸른 바다"}', 'https://picsum.photos/800/600?random=1004', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'uploads/test_005.jpg', '포항공과대학교', 'image', 1792000, 'image/jpeg', ARRAY['대학교', '교육', '캠퍼스'], '{"address": "포항시 남구 포항공과대학교", "description": "POSTECH 캠퍼스의 아름다운 모습"}', '{"description": "POSTECH 캠퍼스의 아름다운 모습"}', 'https://picsum.photos/800/600?random=1005', NOW(), NOW()),
-- 마니트리 계정용 미디어 파일 (5개)
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'uploads/manitri_001.jpg', '포항 바다 풍경', 'image', 2200000, 'image/jpeg', ARRAY['바다', '풍경', '자연'], '{"address": "포항시 북구 영일대해수욕장", "description": "포항 바다의 아름다운 풍경"}', '{"description": "포항 바다의 아름다운 풍경"}', 'https://picsum.photos/800/600?random=2001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'uploads/manitri_002.jpg', '포항 맛집 탐방', 'image', 1800000, 'image/jpeg', ARRAY['맛집', '음식', '탐방'], '{"address": "포항시 북구 죽도시장", "description": "포항의 맛있는 음식들"}', '{"description": "포항의 맛있는 음식들"}', 'https://picsum.photos/800/600?random=2002', NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 'uploads/manitri_003.jpg', '포항 역사 탐방', 'image', 2400000, 'image/jpeg', ARRAY['역사', '문화', '탐방'], '{"address": "포항시 남구 포항제철소", "description": "포항의 역사적 의미"}', '{"description": "포항의 역사적 의미"}', 'https://picsum.photos/800/600?random=2003', NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'uploads/manitri_004.jpg', '포항 야경', 'image', 3000000, 'image/jpeg', ARRAY['야경', '도시', '밤'], '{"address": "포항시 북구 중앙로", "description": "포항의 아름다운 야경"}', '{"description": "포항의 아름다운 야경"}', 'https://picsum.photos/800/600?random=2004', NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'uploads/manitri_005.jpg', '포항 문화 체험', 'image', 2000000, 'image/jpeg', ARRAY['문화', '체험', '전통'], '{"address": "포항시 북구 포항시립미술관", "description": "포항의 문화를 체험하는 시간"}', '{"description": "포항의 문화를 체험하는 시간"}', 'https://picsum.photos/800/600?random=2005', NOW(), NOW());

-- 테스트 계정용 위치 데이터 (5개)
INSERT INTO locations (id, name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '테스트 호미곶', '포항의 동쪽 끝, 일출 명소 (테스트용)', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 남구 호미곶', 'QR_HOMIGOT_TEST', 'https://picsum.photos/400/300?random=1001', 'https://picsum.photos/200/200?random=2001', 60, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '테스트 죽도시장', '포항의 대표적인 전통시장 (테스트용)', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 죽도시장', 'QR_JUKDO_TEST', 'https://picsum.photos/400/300?random=1002', 'https://picsum.photos/200/200?random=2002', 90, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '테스트 영일대해수욕장', '포항의 대표적인 해수욕장 (테스트용)', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 북구 영일대해수욕장', 'QR_YEONGIL_TEST', 'https://picsum.photos/400/300?random=1003', 'https://picsum.photos/200/200?random=2003', 120, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '테스트 포항제철소', '포항의 산업 현장 (테스트용)', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 남구 포항제철소', 'QR_POSCO_TEST', 'https://picsum.photos/400/300?random=1004', 'https://picsum.photos/200/200?random=2004', 90, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '테스트 포항공과대학교', 'POSTECH 캠퍼스 (테스트용)', ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326), '경북 포항시 남구 포항공과대학교', 'QR_POSTECH_TEST', 'https://picsum.photos/400/300?random=1005', 'https://picsum.photos/200/200?random=2005', 120, true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 테스트 계정용 스탬프 (5개)
INSERT INTO stamps (id, name, description, image_url, location_id, is_active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '호미곶 일출 스탬프', '호미곶에서 일출을 감상하고 받는 스탬프', 'https://picsum.photos/64/64?random=2001', '00000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '죽도시장 탐방 스탬프', '죽도시장을 둘러보고 받는 스탬프', 'https://picsum.photos/64/64?random=2002', '00000000-0000-0000-0000-000000000002', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '영일대해수욕장 스탬프', '영일대해수욕장에서 받는 스탬프', 'https://picsum.photos/64/64?random=2003', '00000000-0000-0000-0000-000000000003', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '포항제철소 견학 스탬프', '포항제철소를 견학하고 받는 스탬프', 'https://picsum.photos/64/64?random=2004', '00000000-0000-0000-0000-000000000004', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'POSTECH 캠퍼스 스탬프', 'POSTECH 캠퍼스를 방문하고 받는 스탬프', 'https://picsum.photos/64/64?random=2005', '00000000-0000-0000-0000-000000000005', true, NOW(), NOW());

-- 테스트 계정용 스탬프 획득 기록 (5개)
INSERT INTO user_stamps (id, user_id, location_id, course_id, acquired_at, points, rarity, is_verified, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NULL, NOW(), 10, 'common', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NULL, NOW(), 15, 'common', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', NULL, NOW(), 12, 'common', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', NULL, NOW(), 20, 'rare', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', NULL, NOW(), 18, 'common', true, NOW(), NOW());

-- 테스트 계정용 앨범 (5개)
INSERT INTO albums (id, user_id, title, description, cover_image_url, template_type, is_public, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '포항 일출 앨범', '호미곶에서 찍은 아름다운 일출 사진들', 'https://picsum.photos/400/300?random=3001', 'grid', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '포항 맛집 탐방', '포항의 맛있는 음식들을 기록한 앨범', 'https://picsum.photos/400/300?random=3002', 'timeline', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '포항 역사 여행', '포항의 역사적 장소들을 둘러본 기록', 'https://picsum.photos/400/300?random=3003', 'travel', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '포항 야경 컬렉션', '포항의 아름다운 야경 사진들', 'https://picsum.photos/400/300?random=3004', 'grid', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '포항 바다 이야기', '포항의 바다와 관련된 추억들', 'https://picsum.photos/400/300?random=3005', 'travel', true, NOW(), NOW()),
-- 마니트리 계정용 앨범 (5개)
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '포항 여행 기록', '포항 여행의 모든 순간들을 담은 앨범', 'https://picsum.photos/400/300?random=4001', 'travel', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '포항 맛집 컬렉션', '포항에서 맛본 모든 음식들', 'https://picsum.photos/400/300?random=4002', 'grid', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '포항 문화 탐방', '포항의 문화와 역사를 둘러본 기록', 'https://picsum.photos/400/300?random=4003', 'timeline', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '포항 야경 갤러리', '포항의 아름다운 야경 사진들', 'https://picsum.photos/400/300?random=4004', 'grid', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', '포항 바다 스토리', '포항 바다와 함께한 특별한 순간들', 'https://picsum.photos/400/300?random=4005', 'travel', true, NOW(), NOW());

-- 테스트 계정용 앨범 아이템 (5개)
INSERT INTO album_items (id, album_id, media_file_id, item_type, order_index, caption, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'image', 1, '호미곶의 아름다운 일출', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'image', 1, '죽도시장의 활기찬 모습', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'image', 1, '포항제철소의 야간 조명', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'image', 1, '영일대해수욕장의 푸른 바다', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'image', 1, 'POSTECH 캠퍼스의 아름다운 모습', NOW(), NOW());

-- 테스트 계정용 기념품 (5개)
INSERT INTO souvenirs (id, user_id, template_id, name, description, image_url, quantity, status, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', (SELECT id FROM souvenir_templates LIMIT 1), '호미곶 일출 머그컵', '호미곶 일출이 그려진 머그컵', 'https://picsum.photos/200/200?random=4001', 1, 'completed', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', (SELECT id FROM souvenir_templates LIMIT 1), '죽도시장 엽서 세트', '죽도시장 풍경이 담긴 엽서 세트', 'https://picsum.photos/200/200?random=4002', 1, 'completed', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', (SELECT id FROM souvenir_templates LIMIT 1), '포항제철소 키링', '포항제철소 로고가 새겨진 키링', 'https://picsum.photos/200/200?random=4003', 2, 'completed', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', (SELECT id FROM souvenir_templates LIMIT 1), '영일대해수욕장 스티커', '영일대해수욕장을 테마로 한 스티커', 'https://picsum.photos/200/200?random=4004', 5, 'completed', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', (SELECT id FROM souvenir_templates LIMIT 1), 'POSTECH 마그넷', 'POSTECH 로고가 들어간 마그넷', 'https://picsum.photos/200/200?random=4005', 1, 'completed', NOW(), NOW());

-- 테스트 계정용 게시물 (5개)
INSERT INTO posts (id, author_id, title, content, media_urls, hashtags, location, is_public, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '호미곶 일출의 아름다움', '호미곶에서 맞이한 일출의 순간을 담았습니다. 정말 아름다웠어요!', ARRAY['https://picsum.photos/800/600?random=5001'], ARRAY['일출', '호미곶', '자연'], '포항시 남구 호미곶', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '죽도시장의 활기', '죽도시장의 활기찬 모습을 담았습니다. 정말 생동감 넘치네요!', ARRAY['https://picsum.photos/800/600?random=5002'], ARRAY['시장', '전통', '활기'], '포항시 북구 죽도시장', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '포항제철소 야경', '포항제철소의 야간 조명이 정말 멋졌습니다.', ARRAY['https://picsum.photos/800/600?random=5003'], ARRAY['야경', '제철소', '조명'], '포항시 남구 포항제철소', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '영일대해수욕장에서', '영일대해수욕장의 푸른 바다가 정말 아름다웠습니다.', ARRAY['https://picsum.photos/800/600?random=5004'], ARRAY['바다', '해수욕장', '여름'], '포항시 북구 영일대해수욕장', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'POSTECH 캠퍼스 산책', 'POSTECH 캠퍼스를 산책하며 느낀 학문의 전당의 위엄', ARRAY['https://picsum.photos/800/600?random=5005'], ARRAY['대학교', '캠퍼스', '학문'], '포항시 남구 포항공과대학교', true, NOW(), NOW()),
-- 마니트리 계정용 게시물 (5개)
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '포항 바다의 매력', '포항 바다의 아름다운 풍경에 매료되었습니다. 정말 평화로웠어요!', ARRAY['https://picsum.photos/800/600?random=6001'], ARRAY['바다', '풍경', '평화'], '포항시 북구 영일대해수욕장', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '포항 맛집 투어', '포항의 맛있는 음식들을 찾아다니며 즐거운 시간을 보냈습니다.', ARRAY['https://picsum.photos/800/600?random=6002'], ARRAY['맛집', '음식', '투어'], '포항시 북구 죽도시장', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '포항 역사의 흔적', '포항의 역사적 의미를 되새기며 걸었던 시간이 특별했습니다.', ARRAY['https://picsum.photos/800/600?random=6003'], ARRAY['역사', '문화', '탐방'], '포항시 남구 포항제철소', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '포항 야경의 로맨스', '포항의 야경이 정말 로맨틱했습니다. 연인과 함께하면 더욱 좋을 것 같아요!', ARRAY['https://picsum.photos/800/600?random=6004'], ARRAY['야경', '로맨스', '도시'], '포항시 북구 중앙로', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', '포항 문화 체험', '포항의 문화를 직접 체험하며 많은 것을 배웠습니다.', ARRAY['https://picsum.photos/800/600?random=6005'], ARRAY['문화', '체험', '학습'], '포항시 북구 포항시립미술관', true, NOW(), NOW());

-- =============================================
-- 20. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '통합 스키마 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '포항 스토리텔러 시스템이 준비되었습니다.';
    RAISE NOTICE '테스트 계정 (test@example.com)과 샘플 데이터가 생성되었습니다.';
END $$;
