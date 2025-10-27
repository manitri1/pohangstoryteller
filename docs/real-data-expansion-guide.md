# 포항 스토리텔러 실제 데이터 확보 및 추가 가이드

## 📋 개요

포항 스토리텔러 프로젝트의 샘플 데이터를 실제 포항 데이터로 확장하는 방법을 안내합니다.

## 🎯 목표

- 샘플 데이터를 실제 포항 관광지, 맛집, 문화시설 데이터로 확장
- 자동화된 데이터 수집 시스템 구축
- 지속적인 데이터 업데이트 체계 구축

## 📊 현재 데이터 현황

### **기존 샘플 데이터**
- 관광지: 10개 (죽도시장, 호미곶, 포항제철소 등)
- 맛집: 8개 (해산물, 전통음식, 카페)
- 문화시설: 3개 (미술관, 도서관, 문화회관)
- 코스: 6개 (자연경관, 역사여행, 맛집탐방 등)
- 스탬프: 13개 (각 위치별 스탬프)
- 기념품: 4개 (앨범, 엽서, 가이드북, 스티커)

### **목표 실제 데이터**
- 관광지: 50개 이상
- 맛집: 100개 이상
- 문화시설: 20개 이상
- 코스: 30개 이상
- 스탬프: 100개 이상
- 기념품: 50개 이상

## 🛠️ 데이터 확보 방법

### **1. 공식 데이터 소스**

#### **🏛️ 포항시청 공식 데이터**
- **포항시청 관광과**: 관광지 정보, 이벤트 정보
- **포항시 문화관광**: 문화재, 박물관, 갤러리 정보
- **포항시 경제진흥과**: 상권, 맛집 정보
- **포항시청 홈페이지**: 공식 관광 정보

#### **🌐 공공데이터포털**
- **포항시 관광데이터**: 관광지, 맛집, 숙박 정보
- **포항시 문화데이터**: 문화시설, 행사 정보
- **포항시 상권데이터**: 상권, 업종별 정보

### **2. 웹 스크래핑 대상**

#### **📱 주요 플랫폼**
- **네이버 플레이스**: 포항 맛집, 카페, 관광지
- **카카오맵**: 위치 정보, 리뷰, 평점
- **구글 맵스**: 상세 정보, 사진, 리뷰
- **트립어드바이저**: 관광지 정보, 리뷰
- **망고플레이트**: 맛집 정보, 리뷰

#### **🔍 검색 키워드**
```javascript
const searchKeywords = {
  touristSpots: [
    '영일대 해수욕장', '호미곶', '포항제철소', '포항공과대학교',
    '포항시립미술관', '포항시립도서관', '포항문화예술회관',
    '포항 운하', '죽도시장', '구룡포 과메기 거리'
  ],
  restaurants: [
    '포항 회', '포항 과메기', '포항 생선구이', '포항 갈비',
    '포항 전통 한정식', '포항 바다뷰 카페', '호미곶 일출 카페'
  ],
  culturalFacilities: [
    '포항시립미술관', '포항시립도서관', '포항문화예술회관',
    '포항 박물관', '포항 갤러리'
  ]
};
```

### **3. API 활용**

#### **🗺️ 카카오맵 API**
```javascript
// 카카오맵 API를 통한 장소 검색
async function searchKakaoPlaces(keyword) {
  const response = await axios.get(`${config.kakao.baseUrl}/search/keyword.json`, {
    headers: config.kakao.headers,
    params: {
      query: `포항 ${keyword}`,
      size: 10
    }
  });
  return response.data.documents;
}
```

#### **🔍 네이버 검색 API**
```javascript
// 네이버 검색 API를 통한 장소 정보 검색
async function searchNaverPlaces(keyword) {
  const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
    },
    params: {
      query: `포항 ${keyword}`,
      display: 10
    }
  });
  return response.data.items;
}
```

## 🚀 실행 방법

### **1. 수동 데이터 추가**

#### **마이그레이션 파일 실행**
```sql
-- 1단계: 통합 스키마 + RPC 함수 생성
-- 20250110_000_integrated_schema.sql 실행

-- 2단계: 최종 데이터 마이그레이션
-- 20250127_001_final_data_migration.sql 실행

-- 3단계: 실제 데이터 마이그레이션
-- 20250127_002_real_data_migration.sql 실행
```

### **2. 자동 데이터 수집**

#### **실제 데이터 수집 스크립트 실행**
```bash
# Node.js 스크립트 실행
node scripts/collect-real-data.js

# 생성되는 파일들:
# - supabase/migrations/20250127_003_auto_generated_data.sql
# - data/pohang-real-data.json
```

#### **웹 스크래핑 스크립트 실행**
```bash
# 필요한 패키지 설치
npm install axios cheerio

# 환경 변수 설정
export KAKAO_API_KEY="your_kakao_api_key"
export NAVER_CLIENT_ID="your_naver_client_id"
export NAVER_CLIENT_SECRET="your_naver_client_secret"

# 웹 스크래핑 실행
node scripts/scrape-web-data.js

# 생성되는 파일들:
# - supabase/migrations/20250127_004_scraped_data.sql
# - data/scraped-data.json
```

### **3. 데이터 검증 및 정제**

#### **데이터 품질 확인**
```sql
-- 데이터 개수 확인
SELECT 
  'locations' as table_name, COUNT(*) as count FROM locations
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'stamps', COUNT(*) FROM stamps
UNION ALL
SELECT 'souvenir_templates', COUNT(*) FROM souvenir_templates;

-- 중복 데이터 확인
SELECT name, COUNT(*) as count 
FROM locations 
GROUP BY name 
HAVING COUNT(*) > 1;

-- 좌표 유효성 확인
SELECT name, coordinates 
FROM locations 
WHERE coordinates IS NULL;
```

#### **데이터 정제**
```sql
-- 중복 데이터 제거
DELETE FROM locations 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM locations 
  GROUP BY name
);

-- 좌표 업데이트
UPDATE locations 
SET coordinates = ST_SetSRID(ST_MakePoint(129.3650, 36.0190), 4326)
WHERE coordinates IS NULL;
```

## 📈 데이터 확장 계획

### **Phase 1: 기본 데이터 확장 (1주)**
- [ ] 관광지 50개 추가
- [ ] 맛집 100개 추가
- [ ] 문화시설 20개 추가
- [ ] 기본 스탬프 100개 생성

### **Phase 2: 고급 데이터 추가 (2주)**
- [ ] 상세 리뷰 및 평점 데이터
- [ ] 실제 사진 및 미디어 파일
- [ ] 이벤트 및 행사 정보
- [ ] 실시간 정보 (운영시간, 휴무일)

### **Phase 3: 사용자 생성 데이터 (3주)**
- [ ] 사용자 리뷰 시스템
- [ ] 사용자 사진 업로드
- [ ] 사용자 추천 시스템
- [ ] 커뮤니티 기능 강화

## 🔧 기술적 고려사항

### **1. 성능 최적화**
- 인덱스 최적화
- 쿼리 성능 튜닝
- 캐싱 전략 수립

### **2. 데이터 품질 관리**
- 데이터 검증 규칙
- 중복 데이터 방지
- 좌표 정확성 확인

### **3. 확장성 고려**
- 파티셔닝 전략
- 샤딩 계획
- CDN 활용

## 📚 참고 자료

### **공식 문서**
- [포항시청 관광과](https://www.pohang.go.kr/tour)
- [포항시 문화관광](https://www.pohang.go.kr/culture)
- [공공데이터포털](https://data.go.kr)

### **API 문서**
- [카카오맵 API](https://developers.kakao.com/docs/latest/ko/local/dev-guide)
- [네이버 검색 API](https://developers.naver.com/docs/search/local/)
- [구글 맵스 API](https://developers.google.com/maps/documentation)

### **도구 및 라이브러리**
- [Axios](https://axios-http.com/) - HTTP 클라이언트
- [Cheerio](https://cheerio.js.org/) - HTML 파싱
- [Puppeteer](https://pptr.dev/) - 브라우저 자동화

## 🎯 성공 지표

### **정량적 지표**
- 데이터 개수: 500개 이상
- 데이터 품질: 95% 이상
- 업데이트 빈도: 주 1회 이상

### **정성적 지표**
- 사용자 만족도 향상
- 검색 정확도 개선
- 추천 시스템 성능 향상

---

**포항 스토리텔러 팀**  
_2025년 1월 27일_
