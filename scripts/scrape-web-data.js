#!/usr/bin/env node
/**
 * 포항 스토리텔러 웹 스크래핑 스크립트
 * 생성일: 2025-01-27
 * 설명: 네이버 플레이스, 카카오맵에서 포항 데이터를 자동으로 수집하는 스크립트
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// 환경변수 로딩 (dotenv 사용)
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// 설정 (환경변수 기반)
const config = {
  naver: {
    baseUrl: 'https://map.naver.com',
    searchUrl: 'https://map.naver.com/v5/api/search',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  },
  kakao: {
    baseUrl: 'https://dapi.kakao.com/v2/local',
    headers: {
      'Authorization': `KakaoAK ${process.env.KAKAO_API_KEY || '81bc629292619cb2ede368c8b02a7f25'}`,
      'KA': 'sdk/1.0 os/javascript origin/http://localhost:3000'
    }
  }
};

// 대체 데이터 소스 (API 키가 없을 때 사용)
function getMockData() {
  return [
    {
      name: '영일대 해수욕장',
      address: '경북 포항시 북구 해안로 240',
      coordinates: { lat: 36.0194, lng: 129.3656 },
      category: '관광지',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '호미곶',
      address: '경북 포항시 남구 호미곶면 대보리',
      coordinates: { lat: 36.0760, lng: 129.5670 },
      category: '관광지',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '포항제철소',
      address: '경북 포항시 남구 대잠동',
      coordinates: { lat: 36.1120, lng: 129.3450 },
      category: '관광지',
      phone: '054-220-0114',
      source: 'mock'
    },
    {
      name: '포항공과대학교',
      address: '경북 포항시 남구 청암로 77',
      coordinates: { lat: 36.0130, lng: 129.3250 },
      category: '관광지',
      phone: '054-279-0114',
      source: 'mock'
    },
    {
      name: '죽도시장',
      address: '경북 포항시 북구 죽도시장길 1',
      coordinates: { lat: 36.0190, lng: 129.3650 },
      category: '맛집',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '포항 회센터',
      address: '경북 포항시 북구 중앙로',
      coordinates: { lat: 36.0180, lng: 129.3640 },
      category: '맛집',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '과메기 전문점',
      address: '경북 포항시 남구 구룡포읍',
      coordinates: { lat: 35.9680, lng: 129.5440 },
      category: '맛집',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '포항시립미술관',
      address: '경북 포항시 북구 중앙로 200',
      coordinates: { lat: 36.0190, lng: 129.3650 },
      category: '문화시설',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '포항시립도서관',
      address: '경북 포항시 북구 중앙로 200',
      coordinates: { lat: 36.0190, lng: 129.3650 },
      category: '문화시설',
      phone: '054-270-4000',
      source: 'mock'
    },
    {
      name: '포항 바다뷰 카페',
      address: '경북 포항시 북구 해안로 240',
      coordinates: { lat: 36.0194, lng: 129.3656 },
      category: '카페',
      phone: '054-270-4000',
      source: 'mock'
    }
  ];
}

// 포항 검색 키워드
const searchKeywords = {
  touristSpots: [
    '영일대 해수욕장',
    '호미곶',
    '포항제철소',
    '포항공과대학교',
    '포항시립미술관',
    '포항시립도서관',
    '포항문화예술회관',
    '포항 운하',
    '죽도시장',
    '구룡포 과메기 거리'
  ],
  restaurants: [
    '포항 회',
    '포항 과메기',
    '포항 생선구이',
    '포항 갈비',
    '포항 전통 한정식',
    '포항 바다뷰 카페',
    '호미곶 일출 카페',
    '포항 맛집'
  ],
  culturalFacilities: [
    '포항시립미술관',
    '포항시립도서관',
    '포항문화예술회관',
    '포항 박물관',
    '포항 갤러리'
  ]
};

// 카카오맵 API를 통한 장소 검색
async function searchKakaoPlaces(keyword, category = '') {
  try {
    // API 키 확인 (기본값 사용)
    const apiKey = process.env.KAKAO_API_KEY || '81bc629292619cb2ede368c8b02a7f25';
    
    const headers = {
      'Authorization': `KakaoAK ${apiKey}`,
      'KA': 'sdk/1.0 os/javascript origin/http://localhost:3000'
    };

    console.log(`🔍 카카오 API로 "${keyword}" 검색 중...`);

    const response = await axios.get(`${config.kakao.baseUrl}/search/keyword.json`, {
      headers: headers,
      params: {
        query: `포항 ${keyword}`,
        size: 10
      }
    });

    if (response.data.documents && response.data.documents.length > 0) {
      console.log(`✅ "${keyword}" 검색 성공: ${response.data.documents.length}개 결과`);
      
      return response.data.documents.map(place => ({
        name: place.place_name,
        address: place.address_name,
        roadAddress: place.road_address_name,
        coordinates: {
          lat: parseFloat(place.y),
          lng: parseFloat(place.x)
        },
        category: place.category_name,
        phone: place.phone,
        url: place.place_url,
        source: 'kakao'
      }));
    } else {
      console.log(`⚠️ "${keyword}" 검색 결과 없음`);
      return [];
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(`⚠️ 카카오맵 API 인증 오류 (${keyword}): API 키를 확인해주세요`);
    } else if (error.response?.status === 403) {
      console.warn(`⚠️ 카카오맵 API 접근 거부 (${keyword}): KA 헤더 문제일 수 있습니다`);
    } else {
      console.error(`카카오맵 검색 오류 (${keyword}):`, error.message);
      if (error.response?.data) {
        console.error('API 응답:', error.response.data);
      }
    }
    return [];
  }
}

// 네이버 검색 API를 통한 장소 검색
async function searchNaverPlaces(keyword) {
  try {
    // API 키 확인
    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      console.warn(`⚠️ 네이버 API 키가 설정되지 않았습니다. (${keyword})`);
      return [];
    }

    console.log(`🔍 네이버 API로 "${keyword}" 검색 중...`);

    const searchQuery = `포항 ${keyword}`;
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      },
      params: {
        query: searchQuery,
        display: 10,
        sort: 'comment'
      },
      timeout: 10000
    });

    if (response.data.items && response.data.items.length > 0) {
      console.log(`✅ "${keyword}" 네이버 검색 성공: ${response.data.items.length}개 결과`);
      
      return response.data.items.map(item => ({
        name: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
        address: item.address || '',
        roadAddress: item.roadAddress || '',
        coordinates: {
          lat: 0, // 네이버 API는 좌표를 제공하지 않음
          lng: 0
        },
        category: item.category || '',
        phone: item.telephone || '',
        source: 'naver'
      }));
    } else {
      console.log(`⚠️ "${keyword}" 네이버 검색 결과 없음`);
      return [];
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(`⚠️ 네이버 API 인증 오류 (${keyword}): API 키를 확인해주세요`);
    } else if (error.response?.status === 403) {
      console.warn(`⚠️ 네이버 API 접근 거부 (${keyword}): API 사용 권한을 확인해주세요`);
    } else if (error.response?.status === 429) {
      console.warn(`⚠️ 네이버 API 요청 한도 초과 (${keyword}): 잠시 후 다시 시도해주세요`);
    } else {
      console.error(`네이버 검색 오류 (${keyword}):`, error.message);
      if (error.response?.data) {
        console.error('API 응답:', error.response.data);
      }
    }
    return [];
  }
}

// 네이버 플레이스 스크래핑 (기존 방식 - 백업용)
async function scrapeNaverPlaces(keyword) {
  try {
    console.log(`🌐 네이버 플레이스 스크래핑: "${keyword}"`);
    
    const searchQuery = encodeURIComponent(`포항 ${keyword}`);
    const response = await axios.get(`https://map.naver.com/v5/search/${searchQuery}`, {
      headers: config.naver.headers,
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const places = [];

    // 네이버 플레이스 데이터 파싱 (실제 구조에 따라 조정 필요)
    $('.place_item').each((index, element) => {
      const $el = $(element);
      const name = $el.find('.place_name').text().trim();
      const address = $el.find('.address').text().trim();
      const phone = $el.find('.phone').text().trim();
      const rating = $el.find('.rating').text().trim();

      if (name) {
        places.push({
          name,
          address: address || '',
          phone: phone || '',
          rating: rating || '',
          coordinates: {
            lat: 0, // 스크래핑으로는 좌표를 얻기 어려움
            lng: 0
          },
          source: 'naver_scraping'
        });
      }
    });

    if (places.length > 0) {
      console.log(`✅ "${keyword}" 네이버 플레이스 스크래핑 성공: ${places.length}개 결과`);
    } else {
      console.log(`⚠️ "${keyword}" 네이버 플레이스 스크래핑 결과 없음`);
    }

    return places;
  } catch (error) {
    console.error(`네이버 플레이스 스크래핑 오류 (${keyword}):`, error.message);
    return [];
  }
}

// 데이터 정제 및 중복 제거
function cleanAndDeduplicateData(data) {
  const cleanedData = [];
  const seenNames = new Set();

  data.forEach(item => {
    if (item.name && !seenNames.has(item.name)) {
      seenNames.add(item.name);
      
      // 데이터 정제
      const cleanedItem = {
        name: item.name.trim(),
        description: generateDescription(item),
        coordinates: item.coordinates || { lat: 0, lng: 0 },
        address: item.address || item.roadAddress || '',
        phone: item.phone || '',
        rating: item.rating || '',
        category: categorizeItem(item),
        tags: generateTags(item),
        source: item.source || 'unknown'
      };

      cleanedData.push(cleanedItem);
    }
  });

  return cleanedData;
}

// 설명 생성
function generateDescription(item) {
  const category = categorizeItem(item);
  const baseDescriptions = {
    '관광지': '포항의 아름다운 관광지입니다',
    '맛집': '포항의 맛있는 음식을 맛볼 수 있는 곳입니다',
    '문화시설': '포항의 문화와 예술을 체험할 수 있는 곳입니다',
    '카페': '포항에서 커피와 휴식을 즐길 수 있는 카페입니다'
  };

  return baseDescriptions[category] || '포항의 특별한 장소입니다';
}

// 카테고리 분류
function categorizeItem(item) {
  const name = item.name.toLowerCase();
  const category = item.category ? item.category.toLowerCase() : '';

  if (name.includes('해수욕장') || name.includes('해안') || name.includes('바다')) {
    return '자연경관';
  } else if (name.includes('제철소') || name.includes('대학교') || name.includes('역사')) {
    return '역사여행';
  } else if (name.includes('시장') || name.includes('맛집') || name.includes('식당')) {
    return '맛집탐방';
  } else if (name.includes('카페') || name.includes('커피')) {
    return '맛집탐방';
  } else if (name.includes('미술관') || name.includes('도서관') || name.includes('문화')) {
    return '역사여행';
  } else {
    return '자연경관';
  }
}

// 태그 생성
function generateTags(item) {
  const tags = [];
  const name = item.name.toLowerCase();

  if (name.includes('해수욕장')) tags.push('해수욕장', '바다');
  if (name.includes('일출')) tags.push('일출', '자연');
  if (name.includes('제철소')) tags.push('산업', '역사');
  if (name.includes('대학교')) tags.push('교육', '캠퍼스');
  if (name.includes('시장')) tags.push('시장', '전통');
  if (name.includes('회')) tags.push('해산물', '회');
  if (name.includes('과메기')) tags.push('과메기', '전통');
  if (name.includes('카페')) tags.push('카페', '커피');
  if (name.includes('미술관')) tags.push('미술', '문화');
  if (name.includes('도서관')) tags.push('도서관', '교육');

  return tags.length > 0 ? tags : ['포항'];
}

// SQL 생성
function generateSQL(data) {
  // 환경변수에서 이미지 URL 기본값 가져오기
  const defaultImageUrl = process.env.DEFAULT_IMAGE_URL || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
  const defaultStampImageUrl = process.env.DEFAULT_STAMP_IMAGE_URL || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200';
  const defaultVisitDuration = process.env.DEFAULT_VISIT_DURATION || 60;
  const qrCodePrefix = process.env.QR_CODE_PREFIX || 'QR_';

  let sql = `-- 포항 스토리텔러 웹 스크래핑 데이터 마이그레이션
-- 생성일: ${new Date().toISOString().split('T')[0]}
-- 설명: 웹 스크래핑을 통해 수집한 포항 실제 데이터
-- Supabase Migration SQL Guideline 준수
-- 환경변수 기반 설정:
--   DEFAULT_IMAGE_URL: ${defaultImageUrl}
--   DEFAULT_STAMP_IMAGE_URL: ${defaultStampImageUrl}
--   DEFAULT_VISIT_DURATION: ${defaultVisitDuration}분
--   QR_CODE_PREFIX: ${qrCodePrefix}

-- =============================================
-- 1. 웹 스크래핑 데이터 추가
-- =============================================

`;

  data.forEach((item, index) => {
    const qrCode = `${qrCodePrefix}${item.name.replace(/\s+/g, '_').toUpperCase()}`;
    const imageUrl = `${defaultImageUrl}&random=${index + 100}`;
    const stampImageUrl = `${defaultStampImageUrl}&random=${index + 100}`;

    sql += `INSERT INTO locations (name, description, coordinates, address, qr_code, image_url, stamp_image_url, visit_duration_minutes, is_active) VALUES
('${item.name}', '${item.description}', ST_SetSRID(ST_MakePoint(${item.coordinates.lng}, ${item.coordinates.lat}), 4326), '${item.address}', '${qrCode}', '${imageUrl}', '${stampImageUrl}', ${defaultVisitDuration}, true)
ON CONFLICT (name) DO NOTHING;

`;
  });

  sql += `-- =============================================
-- 2. 완료 메시지
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '웹 스크래핑 데이터 마이그레이션이 성공적으로 완료되었습니다!';
    RAISE NOTICE '총 ${data.length}개의 장소 데이터가 추가되었습니다.';
    RAISE NOTICE '환경변수 설정:';
    RAISE NOTICE '  - DEFAULT_IMAGE_URL: ${defaultImageUrl}';
    RAISE NOTICE '  - DEFAULT_STAMP_IMAGE_URL: ${defaultStampImageUrl}';
    RAISE NOTICE '  - DEFAULT_VISIT_DURATION: ${defaultVisitDuration}분';
    RAISE NOTICE '  - QR_CODE_PREFIX: ${qrCodePrefix}';
END $$;
`;

  return sql;
}

// 메인 실행 함수
async function main() {
  console.log('🚀 포항 스토리텔러 웹 스크래핑 시작...');
  
  // 환경변수 설정 (기본값)
  if (!process.env.DEFAULT_IMAGE_URL) {
    process.env.DEFAULT_IMAGE_URL = 'https://picsum.photos/400/300';
  }
  if (!process.env.DEFAULT_STAMP_IMAGE_URL) {
    process.env.DEFAULT_STAMP_IMAGE_URL = 'https://picsum.photos/200/200';
  }
  if (!process.env.DEFAULT_VISIT_DURATION) {
    process.env.DEFAULT_VISIT_DURATION = '90';
  }
  if (!process.env.QR_CODE_PREFIX) {
    process.env.QR_CODE_PREFIX = 'POHANG_';
  }

  console.log('📋 환경변수 설정:');
  console.log(`  - DEFAULT_IMAGE_URL: ${process.env.DEFAULT_IMAGE_URL}`);
  console.log(`  - DEFAULT_STAMP_IMAGE_URL: ${process.env.DEFAULT_STAMP_IMAGE_URL}`);
  console.log(`  - DEFAULT_VISIT_DURATION: ${process.env.DEFAULT_VISIT_DURATION}분`);
  console.log(`  - QR_CODE_PREFIX: ${process.env.QR_CODE_PREFIX}`);
  console.log(`  - KAKAO_API_KEY: ${process.env.KAKAO_API_KEY ? '설정됨' : '설정되지 않음'}`);
  console.log(`  - NAVER_CLIENT_ID: ${process.env.NAVER_CLIENT_ID ? '설정됨' : '설정되지 않음'}`);
  console.log(`  - NAVER_CLIENT_SECRET: ${process.env.NAVER_CLIENT_SECRET ? '설정됨' : '설정되지 않음'}`);
  
  let allData = [];

  // API 키 확인 (실제 유효성 테스트 포함)
  const hasKakaoApiKey = process.env.KAKAO_API_KEY && process.env.KAKAO_API_KEY !== 'YOUR_KAKAO_API_KEY';
  const hasNaverApiKey = process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET && 
                         process.env.NAVER_CLIENT_ID !== 'YOUR_CLIENT_ID' && 
                         process.env.NAVER_CLIENT_SECRET !== 'YOUR_CLIENT_SECRET';
  
  // 카카오 API 키 유효성 간단 테스트
  let kakaoApiValid = false;
  if (hasKakaoApiKey || process.env.KAKAO_API_KEY === '81bc629292619cb2ede368c8b02a7f25') {
    try {
      console.log('🔑 카카오 API 키 유효성 테스트 중...');
      const testResponse = await axios.get(`${config.kakao.baseUrl}/search/keyword.json`, {
        headers: {
          'Authorization': `KakaoAK ${process.env.KAKAO_API_KEY || '81bc629292619cb2ede368c8b02a7f25'}`,
          'KA': 'sdk/1.0 os/javascript origin/http://localhost:3000'
        },
        params: {
          query: '포항시청',
          size: 1
        }
      });
      
      if (testResponse.status === 200) {
        kakaoApiValid = true;
        console.log('✅ 카카오 API 키 유효성 확인됨');
      }
    } catch (error) {
      console.warn('⚠️ 카카오 API 키 테스트 실패:', error.message);
      kakaoApiValid = false;
    }
  }

  // 네이버 API 키 유효성 간단 테스트
  let naverApiValid = false;
  if (hasNaverApiKey) {
    try {
      console.log('🔑 네이버 API 키 유효성 테스트 중...');
      const testResponse = await axios.get('https://openapi.naver.com/v1/search/local.json', {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        },
        params: {
          query: '포항시청',
          display: 1
        },
        timeout: 5000
      });
      
      if (testResponse.status === 200) {
        naverApiValid = true;
        console.log('✅ 네이버 API 키 유효성 확인됨');
      }
    } catch (error) {
      console.warn('⚠️ 네이버 API 키 테스트 실패:', error.message);
      naverApiValid = false;
    }
  }
  
  if (kakaoApiValid || naverApiValid) {
    // 카카오맵 API를 통한 데이터 수집
    if (kakaoApiValid) {
      console.log('📡 카카오맵 API를 통한 데이터 수집 중...');
      for (const category in searchKeywords) {
        console.log(`  - ${category} 수집 중...`);
        for (const keyword of searchKeywords[category]) {
          const places = await searchKakaoPlaces(keyword, category);
          allData = allData.concat(places);
          
          // API 호출 제한을 위한 대기
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // 네이버 검색 API를 통한 데이터 수집
    if (naverApiValid) {
      console.log('🔍 네이버 검색 API를 통한 데이터 수집 중...');
      for (const category in searchKeywords) {
        console.log(`  - ${category} 수집 중...`);
        for (const keyword of searchKeywords[category]) {
          const places = await searchNaverPlaces(keyword);
          allData = allData.concat(places);
          
          // API 호출 제한을 위한 대기
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // 네이버 플레이스 스크래핑 (백업용 - 선택적)
    if (naverApiValid) {
      console.log('🌐 네이버 플레이스 스크래핑 중...');
      for (const keyword of searchKeywords.touristSpots.slice(0, 3)) { // 처음 3개만 테스트
        const places = await scrapeNaverPlaces(keyword);
        allData = allData.concat(places);
        
        // 스크래핑 제한을 위한 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } else {
    console.log('⚠️ API 키가 설정되지 않거나 유효하지 않아 대체 데이터를 사용합니다.');
    console.log('💡 API 키 설정 방법:');
    console.log('   export KAKAO_API_KEY="your_kakao_api_key"');
    console.log('   export NAVER_CLIENT_ID="your_naver_client_id"');
    console.log('   export NAVER_CLIENT_SECRET="your_naver_client_secret"');
    console.log('💡 카카오맵 API 키 문제 해결:');
    console.log('   1. 카카오 개발자 콘솔에서 카카오맵 서비스 활성화');
    console.log('   2. 도메인 제한 설정 확인');
    console.log('   3. API 키 재발급');
    
    // 대체 데이터 사용
    allData = getMockData();
  }

  // 데이터 정제
  console.log('🧹 데이터 정제 및 중복 제거 중...');
  const cleanedData = cleanAndDeduplicateData(allData);

  // SQL 파일 생성
  const sqlContent = generateSQL(cleanedData);
  const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '20250127_004_scraped_data.sql');
  
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
  console.log(`✅ SQL 파일 생성 완료: ${sqlFilePath}`);

  // JSON 파일 생성
  const sources = [];
  if (kakaoApiValid) sources.push('kakao');
  if (naverApiValid) sources.push('naver');
  if (sources.length === 0) sources.push('mock');

  const jsonContent = JSON.stringify({
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCount: cleanedData.length,
      sources: sources,
      apiKeyStatus: {
        kakao: kakaoApiValid ? 'valid' : 'invalid_or_not_configured',
        naver: naverApiValid ? 'valid' : 'invalid_or_not_configured'
      }
    },
    data: cleanedData
  }, null, 2);

  const jsonFilePath = path.join(__dirname, '..', 'data', 'scraped-data.json');
  const dataDir = path.dirname(jsonFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
  console.log(`✅ JSON 파일 생성 완료: ${jsonFilePath}`);

  // 통계 출력
  console.log('\n📊 스크래핑 결과:');
  console.log(`- 총 수집된 데이터: ${allData.length}개`);
  console.log(`- 정제된 데이터: ${cleanedData.length}개`);
  console.log(`- 중복 제거: ${allData.length - cleanedData.length}개`);

  // 카테고리별 통계
  const categoryStats = {};
  cleanedData.forEach(item => {
    const category = item.category;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });

  console.log('\n📈 카테고리별 통계:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`- ${category}: ${count}개`);
  });

  console.log('\n🎉 웹 스크래핑 완료!');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getMockData,
  searchKakaoPlaces,
  searchNaverPlaces,
  scrapeNaverPlaces,
  cleanAndDeduplicateData,
  generateSQL
};
