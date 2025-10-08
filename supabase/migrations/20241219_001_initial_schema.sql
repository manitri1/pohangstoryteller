-- 포항 스토리 텔러 초기 데이터베이스 스키마
-- 생성일: 2024-12-19
-- 설명: 사용자, 코스, 스탬프, 앨범, 커뮤니티 관련 테이블 생성

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- 1. 사용자 관련 테이블
-- =============================================

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
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
-- 2. 코스 및 스토리 관련 테이블
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
    title TEXT NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 방문지 테이블
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
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
    waypoints JSONB NOT NULL, -- [{lat: number, lng: number}, ...]
    color TEXT DEFAULT '#3B82F6',


    
    description TEXT,
    stroke_weight INTEGER DEFAULT 3,
    stroke_opacity DECIMAL(3,2) DEFAULT 0.8,
    is_main_route BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. 스탬프 및 경험 기록 테이블
-- =============================================

-- 스탬프 테이블
CREATE TABLE IF NOT EXISTS stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    qr_code_scanned TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 테이블
CREATE TABLE IF NOT EXISTS albums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    theme TEXT CHECK (theme IN ('nature', 'history', 'food', 'culture', 'mixed')),
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앨범 아이템 테이블
CREATE TABLE IF NOT EXISTS album_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    item_type TEXT CHECK (item_type IN ('stamp', 'photo', 'video', 'text')),
    content TEXT,
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. 커뮤니티 관련 테이블
-- =============================================

-- 게시물 테이블
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    location_data JSONB,
    mood TEXT,
    is_public BOOLEAN DEFAULT true,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
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

-- 공유 테이블
CREATE TABLE IF NOT EXISTS shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT CHECK (platform IN ('instagram', 'facebook', 'twitter', 'kakao')),
    share_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. DIY 기념품 관련 테이블
-- =============================================

-- 템플릿 테이블
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('포항4컷', '롤링페이퍼', '포토북')),
    layout_config JSONB NOT NULL,
    price INTEGER NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 아이템 테이블
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id),
    quantity INTEGER DEFAULT 1,
    customization_data JSONB,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. AI 챗봇 관련 테이블
-- =============================================

-- 채팅 세션 테이블
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. 인덱스 생성
-- =============================================

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_courses_active ON courses(is_active) WHERE is_active = true;
CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
CREATE INDEX idx_stamps_user ON stamps(user_id);
CREATE INDEX idx_stamps_location ON stamps(location_id);
CREATE INDEX idx_albums_user ON albums(user_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_public ON posts(is_public) WHERE is_public = true;
CREATE INDEX idx_posts_hashtags ON posts USING GIN(hashtags);
CREATE INDEX idx_likes_user_post ON likes(user_id, post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);

-- =============================================
-- 8. RLS (Row Level Security) 정책 설정
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Courses policies (public read, admin write)
CREATE POLICY "Anyone can view active courses" ON courses
    FOR SELECT USING (is_active = true);

-- Locations policies (public read, admin write)
CREATE POLICY "Anyone can view active locations" ON locations
    FOR SELECT USING (is_active = true);

-- Course locations policies (public read)
CREATE POLICY "Anyone can view course locations" ON course_locations
    FOR SELECT USING (true);

-- Routes policies (public read)
CREATE POLICY "Anyone can view routes" ON routes
    FOR SELECT USING (true);

-- Stamps policies
CREATE POLICY "Users can view their own stamps" ON stamps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stamps" ON stamps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Albums policies
CREATE POLICY "Users can view their own albums" ON albums
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public albums" ON albums
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own albums" ON albums
    FOR ALL USING (auth.uid() = user_id);

-- Album items policies
CREATE POLICY "Users can manage album items for their albums" ON album_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM albums 
            WHERE id = album_items.album_id 
            AND user_id = auth.uid()
        )
    );

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON posts
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own posts" ON posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can manage their own posts" ON posts
    FOR ALL USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Users can manage their own likes" ON likes
    FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments on public posts" ON comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE id = comments.post_id 
            AND is_public = true
        )
    );

CREATE POLICY "Users can manage their own comments" ON comments
    FOR ALL USING (auth.uid() = author_id);

-- Shares policies
CREATE POLICY "Users can manage their own shares" ON shares
    FOR ALL USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

-- Chat sessions policies
CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can manage messages in their sessions" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE id = chat_messages.session_id 
            AND user_id = auth.uid()
        )
    );

-- =============================================
-- 9. 함수 및 트리거 생성
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

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 10. 초기 데이터 삽입
-- =============================================

-- 코스 카테고리 초기 데이터
INSERT INTO course_categories (name, description, icon_url, color) VALUES
('맛집탐방', '포항의 맛있는 음식과 카페를 찾아 떠나는 여행', '/icons/food.svg', '#F59E0B'),
('역사여행', '포항의 역사와 문화를 탐험하는 여행', '/icons/history.svg', '#8B5CF6'),
('자연경관', '포항의 아름다운 자연을 만끽하는 여행', '/icons/nature.svg', '#10B981'),
('골목산책', '포항의 숨겨진 골목과 지역 문화를 발견하는 여행', '/icons/walk.svg', '#3B82F6');

-- 기본 템플릿 데이터
INSERT INTO templates (name, type, layout_config, price, preview_url) VALUES
('포항4컷 기본', '포항4컷', '{"slots": [{"id": "slot1", "position": {"x": 0, "y": 0}, "size": {"width": 200, "height": 200}, "type": "image"}, {"id": "slot2", "position": {"x": 220, "y": 0}, "size": {"width": 200, "height": 200}, "type": "image"}, {"id": "slot3", "position": {"x": 0, "y": 220}, "size": {"width": 200, "height": 200}, "type": "image"}, {"id": "slot4", "position": {"x": 220, "y": 220}, "size": {"width": 200, "height": 200}, "type": "image"}]}', 5000, '/templates/pohang4cuts-basic.jpg'),
('롤링페이퍼 기본', '롤링페이퍼', '{"slots": [{"id": "text1", "position": {"x": 50, "y": 50}, "size": {"width": 300, "height": 100}, "type": "text"}]}', 3000, '/templates/rolling-paper-basic.jpg'),
('포토북 기본', '포토북', '{"slots": [{"id": "photo1", "position": {"x": 0, "y": 0}, "size": {"width": 400, "height": 300}, "type": "image"}]}', 15000, '/templates/photobook-basic.jpg');

-- =============================================
-- 11. 완료 메시지
-- =============================================

-- Migration 완료
SELECT '포항 스토리 텔러 데이터베이스 스키마가 성공적으로 생성되었습니다.' as message;
