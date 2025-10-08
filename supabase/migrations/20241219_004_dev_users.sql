-- 개발용 사용자 생성 마이그레이션
-- 생성일: 2024-12-19
-- 설명: 20241219_004_user_engagement_data.sql에서 사용할 개발용 사용자들을 생성
-- ⚠️ 주의: 이 파일은 개발 환경에서만 사용하세요. 프로덕션에서는 사용하지 마세요.

-- =============================================
-- 1. 필요한 확장 프로그램 활성화
-- =============================================

-- pgcrypto 확장이 필요합니다 (비밀번호 암호화용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 2. 개발용 사용자 5명 생성
-- =============================================

-- 개발용 사용자들을 auth.users 테이블에 직접 삽입
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at
)
SELECT
    '00000000-0000-0000-0000-000000000000'::uuid,
    id,
    'authenticated',
    'authenticated',
    email,
    crypt('password123', gen_salt('bf')),
    NOW(),
    '',
    '',
    '',
    '',
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('name', name),
    false,
    NOW()
FROM (VALUES
    ('00000000-0000-0000-0000-000000000001'::uuid, 'test@example.com', '테스트 사용자'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'admin@example.com', '관리자'),
    ('00000000-0000-0000-0000-000000000003'::uuid, 'user1@example.com', '김포항'),
    ('00000000-0000-0000-0000-000000000004'::uuid, 'user2@example.com', '이여행'),
    ('00000000-0000-0000-0000-000000000005'::uuid, 'user3@example.com', '박스토리')
) AS users(id, email, name)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. 사용자 생성 확인
-- =============================================

-- 생성된 사용자 수 확인
SELECT 
    COUNT(*) as user_count,
    '개발용 사용자가 성공적으로 생성되었습니다.' as message
FROM auth.users 
WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);

-- =============================================
-- 4. 사용자 정보 출력
-- =============================================

-- 생성된 사용자들의 기본 정보 출력
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
)
ORDER BY created_at;

-- =============================================
-- 5. 완료 메시지
-- =============================================

SELECT '개발용 사용자 5명이 생성되었습니다. (비밀번호: password123)' as message;
