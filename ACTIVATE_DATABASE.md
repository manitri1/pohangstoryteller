# 데이터베이스 연동 활성화 가이드

## 🎯 목표

목업 데이터 대신 실제 Supabase 데이터베이스의 풍부한 데이터 사용

## 📊 데이터 비교

| 구분           | 현재 (목업) | 데이터베이스                                 |
| -------------- | ----------- | -------------------------------------------- |
| **코스 수**    | 3개         | 14개                                         |
| **관광지 수**  | 5개         | 78개                                         |
| **카테고리**   | 하드코딩    | 4개 (자연경관, 역사여행, 맛집탐방, 골목산책) |
| **메타데이터** | 기본        | 상세 (소요시간, 난이도, 거리, 비용)          |

## 🛠️ 활성화 단계

### 1단계: Supabase 마이그레이션 적용

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `dfnqxobgwxmxywlpwvov`
3. SQL Editor 메뉴 클릭
4. 다음 순서로 마이그레이션 파일 실행:

```sql
-- 1. 스키마 생성
-- 20241219_001_initial_schema.sql 내용 복사

-- 2. 샘플 데이터
-- 20241219_002_sample_data.sql 내용 복사

-- 3. 관광지 데이터
-- 20241219_003_pohang_tourist_spots.sql 내용 복사

-- 4. 개발자 사용자
-- 20241219_004_dev_users.sql 내용 복사

-- 5. 사용자 참여 데이터
-- 20241219_005_user_engagement_data.sql 내용 복사
```

### 2단계: API 코드 활성화

마이그레이션 적용 후 다음 파일들을 수정:

#### `/src/app/api/courses/route.ts`

```typescript
// 이 부분을 주석 처리
// console.log('⚠️ 마이그레이션이 적용되지 않아 목업 데이터를 사용합니다.');
// return NextResponse.json(mockCourses);

// 이 부분을 활성화
const supabase = await createClient();
```

#### `/src/app/api/courses/[id]/route.ts`

```typescript
// 이 부분을 주석 처리
// console.log('⚠️ 마이그레이션이 적용되지 않아 목업 데이터를 사용합니다.');
// const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
// if (fallbackCourse) {
//   return NextResponse.json(fallbackCourse);
// }
// return NextResponse.json({ error: 'Course not found' }, { status: 404 });

// 이 부분을 활성화
const supabase = await createClient();
```

### 3단계: 확인

- 브라우저에서 `/stories` 페이지 접속
- 14개의 코스가 표시되는지 확인
- 각 코스의 상세 정보가 풍부한지 확인

## ⚠️ 주의사항

- 마이그레이션을 순서대로 실행해야 함
- 오류 발생 시 이전 단계부터 다시 실행
- 데이터가 이미 있는 경우 중복 오류 발생 가능

## 🎉 완료 후 효과

- **14개 코스**: 포항 바다와 일몰의 만남, 호미곶 일출 투어 등
- **78개 관광지**: 영일대 해수욕장, 구룡포, 호미곶 등
- **실제 좌표**: 정확한 지도 표시
- **QR 코드**: 각 관광지별 고유 QR 코드
- **상세 메타데이터**: 소요시간, 난이도, 거리, 비용 정보
