-- DIY 기념품 제작 시스템을 위한 데이터베이스 스키마
-- 포항 스토리 텔러 DIY 기념품 제작 및 주문 시스템

-- 기념품 템플릿 테이블
CREATE TABLE IF NOT EXISTS souvenir_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('포항4컷', '롤링페이퍼', '포토북', '스티커', '키링', '엽서')),
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('nature', 'history', 'food', 'culture', 'general')),
    template_config JSONB NOT NULL, -- 레이아웃, 스타일 설정
    preview_image_url TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 제작 프로젝트 테이블
CREATE TABLE IF NOT EXISTS souvenir_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES souvenir_templates(id),
    project_name VARCHAR(200) NOT NULL,
    project_data JSONB NOT NULL, -- 제작 데이터 (이미지, 텍스트, 레이아웃 등)
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'ordered', 'cancelled')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 주문 테이블
CREATE TABLE IF NOT EXISTS souvenir_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES souvenir_projects(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 주문 아이템 테이블
CREATE TABLE IF NOT EXISTS souvenir_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES souvenir_orders(id) ON DELETE CASCADE,
    template_id UUID REFERENCES souvenir_templates(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    specifications JSONB, -- 제작 사양 (크기, 재질, 옵션 등)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 제작 파일 테이블
CREATE TABLE IF NOT EXISTS souvenir_production_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES souvenir_projects(id) ON DELETE CASCADE,
    order_id UUID REFERENCES souvenir_orders(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('source', 'preview', 'production', 'final')),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 리뷰 테이블
CREATE TABLE IF NOT EXISTS souvenir_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES souvenir_orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_images TEXT[], -- 리뷰 이미지 URL 배열
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 공유 테이블
CREATE TABLE IF NOT EXISTS souvenir_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES souvenir_projects(id) ON DELETE CASCADE,
    share_type VARCHAR(20) DEFAULT 'public' CHECK (share_type IN ('public', 'private', 'link')),
    share_token TEXT UNIQUE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기념품 좋아요 테이블
CREATE TABLE IF NOT EXISTS souvenir_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES souvenir_projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_souvenir_templates_type ON souvenir_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_souvenir_templates_category ON souvenir_templates(category);
CREATE INDEX IF NOT EXISTS idx_souvenir_projects_user_id ON souvenir_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_projects_template_id ON souvenir_projects(template_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_projects_status ON souvenir_projects(status);
CREATE INDEX IF NOT EXISTS idx_souvenir_orders_user_id ON souvenir_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_orders_status ON souvenir_orders(status);
CREATE INDEX IF NOT EXISTS idx_souvenir_orders_order_number ON souvenir_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_souvenir_order_items_order_id ON souvenir_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_production_files_project_id ON souvenir_production_files(project_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_reviews_order_id ON souvenir_reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_shares_project_id ON souvenir_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_likes_project_id ON souvenir_likes(project_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE souvenir_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_production_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_likes ENABLE ROW LEVEL SECURITY;

-- 템플릿 정책 (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view active templates" ON souvenir_templates
    FOR SELECT USING (is_active = true);

-- 프로젝트 정책
CREATE POLICY "Users can manage own projects" ON souvenir_projects
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON souvenir_projects
    FOR SELECT USING (is_public = true);

-- 주문 정책
CREATE POLICY "Users can manage own orders" ON souvenir_orders
    FOR ALL USING (auth.uid() = user_id);

-- 주문 아이템 정책
CREATE POLICY "Users can view order items from own orders" ON souvenir_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM souvenir_orders 
            WHERE souvenir_orders.id = souvenir_order_items.order_id 
            AND souvenir_orders.user_id = auth.uid()
        )
    );

-- 제작 파일 정책
CREATE POLICY "Users can manage files from own projects" ON souvenir_production_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM souvenir_projects 
            WHERE souvenir_projects.id = souvenir_production_files.project_id 
            AND souvenir_projects.user_id = auth.uid()
        )
    );

-- 리뷰 정책
CREATE POLICY "Users can manage own reviews" ON souvenir_reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified reviews" ON souvenir_reviews
    FOR SELECT USING (is_verified = true);

-- 공유 정책
CREATE POLICY "Users can manage shares for own projects" ON souvenir_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM souvenir_projects 
            WHERE souvenir_projects.id = souvenir_shares.project_id 
            AND souvenir_projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view public shares" ON souvenir_shares
    FOR SELECT USING (share_type = 'public');

-- 좋아요 정책
CREATE POLICY "Users can manage own likes" ON souvenir_likes
    FOR ALL USING (auth.uid() = user_id);

-- 트리거 함수: 주문 번호 자동 생성
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'SOU' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 시퀀스 생성
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- 트리거 생성
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON souvenir_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- 트리거 함수: 프로젝트 업데이트 시 자동 업데이트
CREATE OR REPLACE FUNCTION update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 프로젝트 업데이트 트리거
CREATE TRIGGER trigger_update_project_updated_at
    BEFORE UPDATE ON souvenir_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_project_updated_at();

-- 주문 업데이트 트리거
CREATE TRIGGER trigger_update_order_updated_at
    BEFORE UPDATE ON souvenir_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_project_updated_at();

-- 뷰 생성: 사용자 기념품 통계
CREATE OR REPLACE VIEW user_souvenir_stats AS
SELECT 
    sp.user_id,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN sp.is_public = true THEN 1 END) as public_projects,
    COUNT(so.id) as total_orders,
    COUNT(CASE WHEN so.status = 'delivered' THEN 1 END) as delivered_orders,
    COALESCE(SUM(so.final_amount), 0) as total_spent,
    MAX(sp.created_at) as last_project_created
FROM souvenir_projects sp
LEFT JOIN souvenir_orders so ON sp.id = so.project_id
GROUP BY sp.user_id;

-- 뷰 생성: 인기 기념품 템플릿
CREATE OR REPLACE VIEW popular_souvenir_templates AS
SELECT 
    st.id,
    st.name,
    st.description,
    st.template_type,
    st.category,
    st.preview_image_url,
    st.base_price,
    COUNT(sp.id) as project_count,
    COUNT(so.id) as order_count,
    COALESCE(AVG(sr.rating), 0) as average_rating,
    COUNT(sr.id) as review_count
FROM souvenir_templates st
LEFT JOIN souvenir_projects sp ON st.id = sp.template_id
LEFT JOIN souvenir_orders so ON sp.id = so.project_id
LEFT JOIN souvenir_reviews sr ON so.id = sr.order_id
WHERE st.is_active = true
GROUP BY st.id, st.name, st.description, st.template_type, st.category, st.preview_image_url, st.base_price
ORDER BY project_count DESC, order_count DESC;

-- 샘플 기념품 템플릿 데이터
INSERT INTO souvenir_templates (name, description, template_type, category, template_config, base_price) VALUES
('포항4컷 기본', '포항의 아름다운 풍경을 담은 4컷 사진 템플릿', '포항4컷', 'nature', '{"layout": "grid", "slots": 4, "size": "10x15cm", "orientation": "vertical"}', 5000),
('포항4컷 해변', '포항 해변의 특별한 순간들을 담은 4컷 템플릿', '포항4컷', 'nature', '{"layout": "grid", "slots": 4, "size": "10x15cm", "orientation": "vertical", "theme": "beach"}', 5500),
('롤링페이퍼 클래식', '전통적인 롤링페이퍼 디자인', '롤링페이퍼', 'general', '{"layout": "scroll", "size": "A4", "orientation": "horizontal", "style": "classic"}', 8000),
('롤링페이퍼 모던', '현대적인 롤링페이퍼 디자인', '롤링페이퍼', 'general', '{"layout": "scroll", "size": "A4", "orientation": "horizontal", "style": "modern"}', 8500),
('포토북 미니', '소형 포토북 템플릿 (20페이지)', '포토북', 'general', '{"layout": "book", "pages": 20, "size": "15x15cm", "binding": "perfect"}', 15000),
('포토북 라지', '대형 포토북 템플릿 (40페이지)', '포토북', 'general', '{"layout": "book", "pages": 40, "size": "20x20cm", "binding": "hardcover"}', 25000),
('스티커 세트', '포항 테마 스티커 세트', '스티커', 'general', '{"layout": "sticker", "count": 10, "size": "5x5cm", "material": "vinyl"}', 3000),
('키링 세트', '포항 랜드마크 키링 세트', '키링', 'general', '{"layout": "keyring", "count": 3, "size": "3x3cm", "material": "acrylic"}', 4000),
('엽서 세트', '포항 풍경 엽서 세트', '엽서', 'nature', '{"layout": "postcard", "count": 5, "size": "10x15cm", "material": "cardstock"}', 6000);
