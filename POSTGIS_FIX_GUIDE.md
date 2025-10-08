# 🔧 PostGIS 좌표 타입 오류 해결 가이드

## 🚨 현재 오류

```
ERROR: 42804: column "coordinates" is of type geometry but expression is of type point
LINE 118: ('영일대 해수욕장', '포항의 대표적인 해수욕장으로 아름다운 일몰을 감상할 수 있는 곳', POINT(129.3656, 36.0194), '경상북도 포항시 북구 흥해읍', 'QR_YEONGILDAE_001', 'https://picsum.photos/800/600?random=1', 'https://picsum.photos/200/200?random=stamp1', 60),
```

## 🔍 문제 원인

### PostGIS vs PostgreSQL POINT 타입 불일치

- **테이블 정의**: `coordinates GEOMETRY(POINT, 4326)` (PostGIS 타입)
- **데이터 삽입**: `POINT(129.3656, 36.0194)` (PostgreSQL 기본 타입)
- **결과**: 타입 불일치로 인한 오류 발생

### PostGIS 좌표 시스템

- **SRID 4326**: WGS84 좌표계 (경도, 위도)
- **GEOMETRY 타입**: PostGIS의 공간 데이터 타입
- **ST_GeomFromText()**: PostGIS 함수로 올바른 형식 변환

## ✅ 해결 방법

### 방법 1: 수정된 마이그레이션 사용 (권장)

#### 1단계: Supabase 대시보드에서 SQL Editor 열기

- Supabase 프로젝트 → SQL Editor

#### 2단계: 수정된 마이그레이션 실행

```sql
-- 20241219_999_fixed_migration.sql 파일 내용을 복사하여 실행
-- PostGIS 함수를 사용한 올바른 좌표 삽입
```

#### 3단계: 결과 확인

- ✅ 성공 메시지: "PostGIS 좌표 타입 오류가 수정되었습니다."
- ✅ 데이터 확인: 모든 위치 데이터가 올바르게 삽입됨

### 방법 2: 기존 파일 수정 (고급)

#### 올바른 PostGIS 함수 사용

```sql
-- 잘못된 방법 (오류 발생)
POINT(129.3656, 36.0194)

-- 올바른 방법 (PostGIS 함수 사용)
ST_GeomFromText('POINT(129.3656 36.0194)', 4326)
```

#### 좌표 형식 차이점

```sql
-- PostgreSQL POINT (쉼표 사용)
POINT(129.3656, 36.0194)

-- PostGIS WKT (공백 사용)
ST_GeomFromText('POINT(129.3656 36.0194)', 4326)
```

## 🎯 수정된 내용

### 1. 좌표 삽입 방식 변경

```sql
-- 수정 전 (오류 발생)
INSERT INTO locations (name, coordinates) VALUES
('영일대 해수욕장', POINT(129.3656, 36.0194));

-- 수정 후 (정상 작동)
INSERT INTO locations (name, coordinates) VALUES
('영일대 해수욕장', ST_GeomFromText('POINT(129.3656 36.0194)', 4326));
```

### 2. PostGIS 함수 사용

- **ST_GeomFromText()**: WKT(Well-Known Text) 형식을 GEOMETRY 타입으로 변환
- **SRID 4326**: WGS84 좌표계 명시
- **공백 구분**: 경도와 위도 사이에 공백 사용

### 3. 좌표 순서 확인

- **경도(Longitude)**: 129.3656 (동서 방향)
- **위도(Latitude)**: 36.0194 (남북 방향)
- **순서**: POINT(경도 위도)

## 🔧 기술적 세부사항

### PostGIS 확장 기능

```sql
-- PostGIS 확장 활성화
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 공간 인덱스 생성
CREATE INDEX idx_locations_coordinates ON locations USING GIST (coordinates);
```

### 좌표 시스템 정보

- **SRID 4326**: WGS84 (World Geodetic System 1984)
- **사용 목적**: GPS 좌표, 지도 표시, 거리 계산
- **정확도**: 전 세계 표준 좌표계

## 📞 다음 단계

1. **수정된 마이그레이션 실행**: `20241219_999_fixed_migration.sql` 사용
2. **좌표 데이터 확인**: 모든 위치가 올바르게 저장되었는지 확인
3. **API 테스트**: 지도 표시 및 좌표 조회 기능 테스트
4. **성능 확인**: 공간 인덱스가 올바르게 작동하는지 확인

## 🎉 완료 후 효과

- **오류 해결**: 42804 타입 불일치 오류 완전 해결
- **좌표 정확성**: PostGIS 표준에 맞는 정확한 좌표 저장
- **공간 쿼리**: 거리 계산, 범위 검색 등 공간 쿼리 가능
- **지도 연동**: 프론트엔드 지도 라이브러리와 완벽 호환

## ⚠️ 주의사항

- **좌표 순서**: POINT(경도 위도) 순서 준수
- **SRID 명시**: 항상 4326 좌표계 명시
- **공백 구분**: 경도와 위도 사이에 공백 사용
- **PostGIS 함수**: ST_GeomFromText() 함수 사용 필수
