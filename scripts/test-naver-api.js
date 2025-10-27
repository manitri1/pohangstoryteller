#!/usr/bin/env node
/**
 * 네이버 API 테스트 스크립트
 * 생성일: 2025-01-27
 * 설명: 네이버 검색 API와 플레이스 API의 동작을 테스트하는 스크립트
 */

const axios = require('axios');

// 네이버 API 설정
const NAVER_API_CONFIG = {
  search: {
    baseUrl: 'https://openapi.naver.com/v1/search/local.json',
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || 'YOUR_CLIENT_ID',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || 'YOUR_CLIENT_SECRET'
    }
  },
  place: {
    baseUrl: 'https://openapi.naver.com/v1/search/local.json',
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || 'YOUR_CLIENT_ID',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || 'YOUR_CLIENT_SECRET'
    }
  }
};

// 테스트할 검색 키워드들
const TEST_KEYWORDS = [
  '포항시청',
  '영일대해수욕장',
  '호미곶',
  '포항제철소',
  '포항공과대학교',
  '죽도시장',
  '포항 회',
  '포항 과메기',
  '포항 맛집'
];

// 네이버 검색 API 테스트
async function testNaverSearchAPI(keyword) {
  try {
    console.log(`🔍 네이버 검색 API 테스트: "${keyword}"`);
    
    const response = await axios.get(NAVER_API_CONFIG.search.baseUrl, {
      headers: NAVER_API_CONFIG.search.headers,
      params: {
        query: `포항 ${keyword}`,
        display: 5,
        sort: 'comment'
      },
      timeout: 10000
    });

    console.log(`   ✅ 상태: ${response.status} ${response.statusText}`);
    console.log(`   📊 결과 개수: ${response.data.items?.length || 0}개`);
    
    if (response.data.items && response.data.items.length > 0) {
      console.log(`   📋 첫 번째 결과: ${response.data.items[0].title.replace(/<[^>]*>/g, '')}`);
      console.log(`   📋 주소: ${response.data.items[0].address}`);
      console.log(`   📋 카테고리: ${response.data.items[0].category}`);
    }

    return {
      success: true,
      status: response.status,
      data: response.data,
      resultCount: response.data.items?.length || 0
    };

  } catch (error) {
    console.log(`   ❌ 오류 발생:`);
    
    if (error.response) {
      console.log(`   📋 상태: ${error.response.status} ${error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.log(`   💡 인증 오류: 네이버 API 키를 확인해주세요`);
        console.log(`   💡 발급 방법: https://developers.naver.com/`);
      } else if (error.response.status === 403) {
        console.log(`   💡 접근 거부: API 사용 권한을 확인해주세요`);
      } else if (error.response.status === 429) {
        console.log(`   💡 요청 한도 초과: 잠시 후 다시 시도해주세요`);
      }
      
      return {
        success: false,
        status: error.response.status,
        error: error.response.data
      };
    } else if (error.request) {
      console.log(`   📋 네트워크 오류: 서버에 연결할 수 없습니다`);
      return {
        success: false,
        error: 'Network error'
      };
    } else {
      console.log(`   📋 오류: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 네이버 플레이스 API 테스트 (검색 API와 동일하지만 다른 파라미터 사용)
async function testNaverPlaceAPI(keyword) {
  try {
    console.log(`🏢 네이버 플레이스 API 테스트: "${keyword}"`);
    
    const response = await axios.get(NAVER_API_CONFIG.place.baseUrl, {
      headers: NAVER_API_CONFIG.place.headers,
      params: {
        query: `포항 ${keyword}`,
        display: 3,
        sort: 'random'
      },
      timeout: 10000
    });

    console.log(`   ✅ 상태: ${response.status} ${response.statusText}`);
    console.log(`   📊 결과 개수: ${response.data.items?.length || 0}개`);
    
    if (response.data.items && response.data.items.length > 0) {
      console.log(`   📋 첫 번째 결과: ${response.data.items[0].title.replace(/<[^>]*>/g, '')}`);
      console.log(`   📋 전화번호: ${response.data.items[0].telephone || '없음'}`);
    }

    return {
      success: true,
      status: response.status,
      data: response.data,
      resultCount: response.data.items?.length || 0
    };

  } catch (error) {
    console.log(`   ❌ 오류 발생:`);
    
    if (error.response) {
      console.log(`   📋 상태: ${error.response.status} ${error.response.statusText}`);
      return {
        success: false,
        status: error.response.status,
        error: error.response.data
      };
    } else {
      console.log(`   📋 오류: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// API 키 유효성 확인
function checkApiKeys() {
  console.log('🔑 네이버 API 키 확인:');
  
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  
  console.log(`   📋 CLIENT_ID: ${clientId ? '설정됨' : '설정되지 않음'}`);
  console.log(`   📋 CLIENT_SECRET: ${clientSecret ? '설정됨' : '설정되지 않음'}`);
  
  if (!clientId || !clientSecret || clientId === 'YOUR_CLIENT_ID' || clientSecret === 'YOUR_CLIENT_SECRET') {
    console.log('   ⚠️ 네이버 API 키가 설정되지 않았습니다.');
    console.log('   💡 설정 방법:');
    console.log('      1. https://developers.naver.com/ 접속');
    console.log('      2. 애플리케이션 등록');
    console.log('      3. 검색 API 사용 설정');
    console.log('      4. CLIENT_ID와 CLIENT_SECRET을 환경변수에 설정');
    return false;
  }
  
  console.log('   ✅ 네이버 API 키가 설정되어 있습니다.');
  return true;
}

// 메인 실행 함수
async function main() {
  console.log('🚀 네이버 API 테스트 시작...');
  console.log('='.repeat(50));
  
  // API 키 확인
  const hasValidKeys = checkApiKeys();
  
  if (!hasValidKeys) {
    console.log('\n❌ API 키가 설정되지 않아 테스트를 중단합니다.');
    console.log('💡 환경변수 설정 후 다시 실행해주세요.');
    return;
  }

  console.log('\n📋 네이버 검색 API 테스트 시작...');
  
  const searchResults = [];
  const placeResults = [];
  
  // 검색 API 테스트 (처음 3개 키워드만)
  for (const keyword of TEST_KEYWORDS.slice(0, 3)) {
    const result = await testNaverSearchAPI(keyword);
    searchResults.push({
      keyword,
      ...result
    });
    
    // API 호출 간격 (요청 한도 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📋 네이버 플레이스 API 테스트 시작...');
  
  // 플레이스 API 테스트 (처음 2개 키워드만)
  for (const keyword of TEST_KEYWORDS.slice(0, 2)) {
    const result = await testNaverPlaceAPI(keyword);
    placeResults.push({
      keyword,
      ...result
    });
    
    // API 호출 간격 (요청 한도 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 결과 요약
  console.log('\n📊 테스트 결과 요약:');
  console.log('='.repeat(50));
  
  const searchSuccessCount = searchResults.filter(r => r.success).length;
  const placeSuccessCount = placeResults.filter(r => r.success).length;
  
  console.log(`🔍 검색 API: ${searchSuccessCount}/${searchResults.length}개 성공`);
  console.log(`🏢 플레이스 API: ${placeSuccessCount}/${placeResults.length}개 성공`);
  
  // 상세 결과
  console.log('\n📋 검색 API 상세 결과:');
  searchResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const count = result.resultCount || 0;
    console.log(`${status} "${result.keyword}": ${count}개 결과`);
  });
  
  console.log('\n📋 플레이스 API 상세 결과:');
  placeResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const count = result.resultCount || 0;
    console.log(`${status} "${result.keyword}": ${count}개 결과`);
  });

  // 권장사항
  console.log('\n💡 권장사항:');
  
  const allResults = [...searchResults, ...placeResults];
  const failedResults = allResults.filter(r => !r.success);
  
  if (failedResults.length === 0) {
    console.log('🎉 모든 네이버 API가 정상 작동합니다!');
    console.log('💡 포항 스토리텔러에서 네이버 API를 활용할 수 있습니다.');
  } else {
    failedResults.forEach(result => {
      if (result.status === 401) {
        console.log(`- ${result.keyword}: API 키 인증 오류`);
      } else if (result.status === 403) {
        console.log(`- ${result.keyword}: API 사용 권한 없음`);
      } else if (result.status === 429) {
        console.log(`- ${result.keyword}: 요청 한도 초과`);
      } else {
        console.log(`- ${result.keyword}: ${result.error || '알 수 없는 오류'}`);
      }
    });
  }

  console.log('\n🎉 네이버 API 테스트 완료!');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testNaverSearchAPI,
  testNaverPlaceAPI,
  checkApiKeys
};
