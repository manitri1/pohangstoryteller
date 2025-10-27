#!/usr/bin/env node
/**
 * 포항 스토리텔러 REST API 테스트 스크립트
 * 생성일: 2025-01-27
 * 설명: 주요 API 엔드포인트들의 동작을 테스트하는 스크립트
 */

const axios = require('axios');

// API 기본 설정
const API_BASE_URL = 'http://localhost:3000/api';

// 테스트할 API 엔드포인트들
const API_ENDPOINTS = [
  {
    name: '헬스체크',
    url: '/health',
    method: 'GET',
    description: '서버 및 데이터베이스 상태 확인'
  },
  {
    name: '환경변수 테스트',
    url: '/env-test',
    method: 'GET',
    description: '환경변수 설정 상태 확인'
  },
  {
    name: '코스 목록',
    url: '/courses',
    method: 'GET',
    description: '관광 코스 목록 조회'
  },
  {
    name: '위치 정보 (ID: 1)',
    url: '/locations/1',
    method: 'GET',
    description: '특정 위치 정보 조회'
  },
  {
    name: '스탬프 목록',
    url: '/stamps',
    method: 'GET',
    description: '사용자 스탬프 목록 조회 (인증 필요)'
  },
  {
    name: '추천 시스템',
    url: '/recommendations',
    method: 'POST',
    description: '개인화된 코스 추천 (인증 필요)',
    data: {
      interests: ['자연경관', '맛집탐방'],
      duration: 180,
      companion: 'family',
      difficulty: 'easy',
      limit: 5
    }
  }
];

// API 테스트 함수
async function testApiEndpoint(endpoint) {
  try {
    console.log(`\n🔍 ${endpoint.name} 테스트 중...`);
    console.log(`   URL: ${endpoint.method} ${API_BASE_URL}${endpoint.url}`);
    console.log(`   설명: ${endpoint.description}`);

    const config = {
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.url}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PohangStoryTeller-API-Test/1.0'
      }
    };

    if (endpoint.data) {
      config.data = endpoint.data;
    }

    const response = await axios(config);
    
    console.log(`   ✅ 상태: ${response.status} ${response.statusText}`);
    console.log(`   📊 응답 크기: ${JSON.stringify(response.data).length} bytes`);
    
    // 응답 데이터 요약
    if (response.data) {
      if (Array.isArray(response.data)) {
        console.log(`   📋 데이터 개수: ${response.data.length}개`);
      } else if (typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        console.log(`   📋 응답 필드: ${keys.join(', ')}`);
        
        // 특정 필드들의 값 표시
        if (response.data.status) {
          console.log(`   📋 상태: ${response.data.status}`);
        }
        if (response.data.message) {
          console.log(`   📋 메시지: ${response.data.message}`);
        }
        if (response.data.courses) {
          console.log(`   📋 코스 개수: ${response.data.courses.length}개`);
        }
        if (response.data.stamps) {
          console.log(`   📋 스탬프 개수: ${response.data.stamps.length}개`);
        }
      }
    }

    return {
      success: true,
      status: response.status,
      data: response.data
    };

  } catch (error) {
    console.log(`   ❌ 오류 발생:`);
    
    if (error.response) {
      // 서버가 응답했지만 오류 상태
      console.log(`   📋 상태: ${error.response.status} ${error.response.statusText}`);
      console.log(`   📋 오류 메시지: ${error.response.data?.error || error.response.data?.message || '알 수 없는 오류'}`);
      
      // 인증 오류인 경우 특별 처리
      if (error.response.status === 401) {
        console.log(`   💡 인증이 필요한 API입니다. 로그인 후 다시 시도해주세요.`);
      }
      
      return {
        success: false,
        status: error.response.status,
        error: error.response.data
      };
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.log(`   📋 네트워크 오류: 서버에 연결할 수 없습니다.`);
      console.log(`   💡 서버가 실행 중인지 확인해주세요: npm run dev`);
      
      return {
        success: false,
        error: 'Network error'
      };
    } else {
      // 기타 오류
      console.log(`   📋 오류: ${error.message}`);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 서버 연결 테스트
async function testServerConnection() {
  try {
    console.log('🔍 서버 연결 테스트 중...');
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ 서버 연결 성공');
    return true;
  } catch (error) {
    console.log('❌ 서버 연결 실패');
    console.log('💡 다음을 확인해주세요:');
    console.log('   1. 개발 서버가 실행 중인지: npm run dev');
    console.log('   2. 포트 3000이 사용 가능한지');
    console.log('   3. 방화벽 설정');
    return false;
  }
}

// 메인 실행 함수
async function main() {
  console.log('🚀 포항 스토리텔러 REST API 테스트 시작...');
  console.log(`📡 API 기본 URL: ${API_BASE_URL}`);
  
  // 서버 연결 테스트
  const serverConnected = await testServerConnection();
  if (!serverConnected) {
    console.log('\n❌ 서버 연결 실패로 테스트를 중단합니다.');
    return;
  }

  console.log('\n📋 API 엔드포인트 테스트 시작...');
  
  const results = [];
  
  for (const endpoint of API_ENDPOINTS) {
    const result = await testApiEndpoint(endpoint);
    results.push({
      name: endpoint.name,
      ...result
    });
    
    // API 호출 간격 (서버 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 결과 요약
  console.log('\n📊 테스트 결과 요약:');
  console.log('='.repeat(50));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ 성공: ${successCount}/${totalCount}개`);
  console.log(`❌ 실패: ${totalCount - successCount}/${totalCount}개`);
  
  console.log('\n📋 상세 결과:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const statusCode = result.status ? ` (${result.status})` : '';
    console.log(`${status} ${result.name}${statusCode}`);
  });

  // 권장사항
  console.log('\n💡 권장사항:');
  const failedApis = results.filter(r => !r.success);
  
  if (failedApis.length === 0) {
    console.log('🎉 모든 API가 정상 작동합니다!');
  } else {
    failedApis.forEach(api => {
      if (api.status === 401) {
        console.log(`- ${api.name}: 인증이 필요합니다. 로그인 기능을 구현해주세요.`);
      } else if (api.status === 404) {
        console.log(`- ${api.name}: 데이터가 없습니다. 마이그레이션을 실행해주세요.`);
      } else if (api.error === 'Network error') {
        console.log(`- ${api.name}: 서버 연결 문제입니다. 서버 상태를 확인해주세요.`);
      } else {
        console.log(`- ${api.name}: ${api.error || '알 수 없는 오류'}`);
      }
    });
  }

  console.log('\n🎉 API 테스트 완료!');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testApiEndpoint,
  testServerConnection,
  API_ENDPOINTS
};
