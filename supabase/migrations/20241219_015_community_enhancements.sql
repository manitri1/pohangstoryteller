-- 커뮤니티 기능 강화를 위한 마이그레이션
-- 생성일: 2024-12-19
-- 설명: 북마크, 댓글 좋아요, 사용자 인증, 게시물 타입 등 추가 기능

-- =============================================
-- 0. 마이그레이션 로그 테이블 생성 (필요한 경우)
-- =============================================

-- 마이그레이션 로그 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS migration_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    migration_name TEXT UNIQUE NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT
);

-- =============================================
-- 1. 사용자 프로필에 인증 상태 추가
-- =============================================

-- 사용자 인증 상태 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 인증된 사용자 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified) WHERE is_verified = true;

-- =============================================
-- 2. 게시물 테이블에 타입 필드 추가
-- =============================================

-- 게시물 타입 컬럼 추가
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'text' 
CHECK (post_type IN ('text', 'image', 'video', 'album'));

-- 게시물 타입 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);

-- =============================================
-- 3. 북마크 테이블 생성
-- =============================================

-- 북마크 테이블 생성
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- 북마크 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post ON bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_post ON bookmarks(user_id, post_id);

-- =============================================
-- 4. 댓글 좋아요 테이블 생성
-- =============================================

-- 댓글 좋아요 테이블 생성
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

-- 댓글 좋아요 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_comment ON comment_likes(user_id, comment_id);

-- =============================================
-- 5. 게시물 통계 업데이트를 위한 함수들
-- =============================================

-- 북마크 수 업데이트 함수 (updated_at만 업데이트)
CREATE OR REPLACE FUNCTION update_post_bookmark_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET updated_at = NOW() 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET updated_at = NOW() 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 북마크 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_bookmark_timestamp ON bookmarks;
CREATE TRIGGER trigger_update_bookmark_timestamp
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_post_bookmark_timestamp();

-- 댓글 좋아요 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comments 
        SET like_count = like_count + 1,
            updated_at = NOW()
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comments 
        SET like_count = GREATEST(like_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 좋아요 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_like_count
    AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_like_count();

-- =============================================
-- 6. RLS 정책 추가
-- =============================================

-- 북마크 테이블 RLS 활성화
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 북마크 정책 생성
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- 댓글 좋아요 테이블 RLS 활성화
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- 댓글 좋아요 정책 생성
DROP POLICY IF EXISTS "Users can view comment likes" ON comment_likes;
CREATE POLICY "Users can view comment likes" ON comment_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own comment likes" ON comment_likes;
CREATE POLICY "Users can manage their own comment likes" ON comment_likes
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 7. 게시물에 북마크 수 컬럼 추가
-- =============================================

-- 게시물에 북마크 수 컬럼 추가
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS bookmark_count INTEGER DEFAULT 0;

-- 북마크 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_bookmark_count_column()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET bookmark_count = bookmark_count + 1,
            updated_at = NOW()
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET bookmark_count = GREATEST(bookmark_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 북마크 수 업데이트 트리거
DROP TRIGGER IF EXISTS trigger_update_bookmark_count_column ON bookmarks;
CREATE TRIGGER trigger_update_bookmark_count_column
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_post_bookmark_count_column();

-- =============================================
-- 8. 기존 데이터에 대한 북마크 수 초기화
-- =============================================

-- 기존 게시물들의 북마크 수 초기화 (북마크 테이블이 비어있을 수 있으므로 안전하게 처리)
UPDATE posts 
SET bookmark_count = COALESCE((
    SELECT COUNT(*) 
    FROM bookmarks 
    WHERE bookmarks.post_id = posts.id
), 0);

-- =============================================
-- 9. 성능 최적화를 위한 추가 인덱스
-- =============================================

-- 게시물 조회 성능 최적화
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_like_count_desc ON posts(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_bookmark_count_desc ON posts(bookmark_count DESC);

-- 댓글 조회 성능 최적화
CREATE INDEX IF NOT EXISTS idx_comments_created_at_desc ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_like_count_desc ON comments(like_count DESC);

-- =============================================
-- 10. 샘플 데이터 추가 (개발용)
-- =============================================

-- 샘플 사용자 데이터 (기존 사용자가 있는 경우에만 업데이트)
-- 주의: auth.users에 해당 사용자가 존재해야 함
-- 개발 환경에서만 실행하거나, 실제 사용자 생성 후 실행

-- 기존 사용자의 인증 상태만 업데이트 (새로운 사용자 생성은 하지 않음)
UPDATE profiles 
SET is_verified = true, updated_at = NOW()
WHERE email IN ('admin@pohangstory.com', 'guide@pohangstory.com')
AND id IN (SELECT id FROM auth.users WHERE email IN ('admin@pohangstory.com', 'guide@pohangstory.com'));

-- 기존 사용자가 없는 경우를 위한 안전한 처리
-- 실제 운영 환경에서는 이 부분을 제거하고 수동으로 사용자를 생성하는 것을 권장

-- 샘플 게시물 데이터 (기존 사용자가 있는 경우에만 생성)
INSERT INTO posts (id, author_id, content, post_type, hashtags, is_public, like_count, comment_count, share_count, bookmark_count, created_at, updated_at)
SELECT 
    '33333333-3333-3333-3333-333333333333',
    p.id,
    '포항의 아름다운 바다를 소개합니다! 🌊',
    'image',
    ARRAY['포항', '바다', '여행'],
    true,
    15,
    3,
    2,
    5,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
FROM profiles p
WHERE p.email = 'admin@pohangstory.com'
AND NOT EXISTS (SELECT 1 FROM posts LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- 샘플 댓글 데이터 (기존 사용자와 게시물이 있는 경우에만 생성)
INSERT INTO comments (id, post_id, author_id, content, like_count, created_at, updated_at)
SELECT 
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    p.id,
    '정말 아름다운 곳이네요! 다음에 꼭 가보고 싶습니다.',
    2,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.email = 'guide@pohangstory.com'
AND EXISTS (SELECT 1 FROM posts WHERE id = '33333333-3333-3333-3333-333333333333')
AND NOT EXISTS (SELECT 1 FROM comments LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 11. 뷰 생성 (통계 및 분석용)
-- =============================================

-- 커뮤니티 통계 뷰
CREATE OR REPLACE VIEW community_stats AS
SELECT 
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT p.author_id) as total_users,
    COALESCE(SUM(p.like_count), 0) as total_likes,
    COALESCE(SUM(p.comment_count), 0) as total_comments,
    COALESCE(SUM(p.share_count), 0) as total_shares,
    COALESCE(SUM(p.bookmark_count), 0) as total_bookmarks,
    COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '7 days' THEN p.id END) as posts_last_week,
    COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '30 days' THEN p.id END) as posts_last_month
FROM posts p
WHERE p.is_public = true;

-- 인기 해시태그 뷰
CREATE OR REPLACE VIEW trending_hashtags AS
SELECT 
    hashtag,
    COUNT(*) as usage_count,
    COUNT(DISTINCT author_id) as unique_users
FROM (
    SELECT 
        unnest(hashtags) as hashtag,
        author_id
    FROM posts 
    WHERE is_public = true 
    AND created_at >= NOW() - INTERVAL '30 days'
) t
GROUP BY hashtag
ORDER BY usage_count DESC, unique_users DESC
LIMIT 20;

-- =============================================
-- 12. 완료 메시지
-- =============================================

-- 마이그레이션 완료 로그
INSERT INTO migration_log (migration_name, applied_at, description)
VALUES (
    '20241219_015_community_enhancements',
    NOW(),
    '커뮤니티 기능 강화: 북마크, 댓글 좋아요, 사용자 인증, 게시물 타입, 통계 뷰 추가'
) ON CONFLICT (migration_name) DO UPDATE SET
    applied_at = NOW(),
    description = EXCLUDED.description;
