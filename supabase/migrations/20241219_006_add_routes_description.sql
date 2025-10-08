-- routes 테이블에 description 컬럼 추가
-- API에서 description을 사용하고 있으므로 스키마에 추가

ALTER TABLE routes ADD COLUMN IF NOT EXISTS description TEXT;

-- 기존 데이터에 대한 기본 설명 추가
UPDATE routes SET description = name WHERE description IS NULL;

-- description 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN routes.description IS '경로에 대한 상세 설명';
