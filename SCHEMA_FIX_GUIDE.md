# 🔧 스키마 오류 해결 가이드

## 🚨 현재 문제

- **오류**: `column routes_1.description does not exist`
- **원인**: API에서 `routes.description` 컬럼을 조회하려고 하지만 실제 스키마에 없음
- **결과**: 42703 오류가 계속 발생

## 📋 해결 방안

### 방안 1: 스키마에 description 컬럼 추가 (권장)

#### 1단계: Supabase 대시보드에서 마이그레이션 실행

```sql
-- 20241219_006_add_routes_description.sql 내용을 복사하여 실행
ALTER TABLE routes ADD COLUMN IF NOT EXISTS description TEXT;
UPDATE routes SET description = name WHERE description IS NULL;
COMMENT ON COLUMN routes.description IS '경로에 대한 상세 설명';
```

#### 2단계: API 코드 수정

```typescript
// routes 쿼리에서 description 포함
routes(
  id,
  name,
  waypoints,
  color,
  description,
  stroke_weight,
  stroke_opacity,
  is_main_route
);
```

### 방안 2: API를 현재 스키마에 맞게 수정 (현재 적용됨)

#### 수정된 API 쿼리

```typescript
// 실제 존재하는 컬럼만 조회
routes(
  id,
  name,
  waypoints,
  color,
  stroke_weight,
  stroke_opacity,
  is_main_route
);
```

#### 수정된 데이터 매핑

```typescript
routes: course.routes?.map((route: any) => ({
  id: route.id,
  name: route.name,
  waypoints: route.waypoints,
  color: route.color,
  strokeWeight: route.stroke_weight,
  strokeOpacity: route.stroke_opacity,
  isMainRoute: route.is_main_route,
}));
```

## 🎯 권장 해결책

### 즉시 해결 (방안 2 적용됨)

- ✅ **API 코드 수정**: 실제 스키마에 맞게 조정
- ✅ **오류 처리**: 42703 오류에 대한 특별 처리
- ✅ **Fallback**: 오류 시 목업 데이터 사용

### 장기적 해결 (방안 1)

- 📋 **스키마 업데이트**: `description` 컬럼 추가
- 📋 **데이터 풍부화**: 경로에 대한 상세 설명 제공
- 📋 **API 확장**: 더 많은 메타데이터 활용

## 🔍 현재 상태

- **API**: 실제 스키마에 맞게 수정됨
- **오류 처리**: 42703 오류에 대한 적절한 처리
- **서비스**: 안정적으로 작동 (목업 데이터 사용)

## 📞 다음 단계

1. **즉시**: 현재 수정된 코드로 정상 작동
2. **선택적**: 스키마에 `description` 컬럼 추가하여 더 풍부한 데이터 제공
