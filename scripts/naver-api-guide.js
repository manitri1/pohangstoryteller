#!/usr/bin/env node
/**
 * 네이버 API 키 발급 가이드 및 테스트 스크립트
 * 생성일: 2025-01-27
 * 설명: 네이버 API 키 발급 방법과 테스트 방법을 안내하는 스크립트
 */

console.log('🚀 네이버 API 키 발급 및 테스트 가이드');
console.log('='.repeat(60));

console.log('\n📋 1단계: 네이버 개발자센터 접속');
console.log('   🌐 URL: https://developers.naver.com/');
console.log('   📝 네이버 계정으로 로그인');

console.log('\n📋 2단계: 애플리케이션 등록');
console.log('   🔹 "Application" → "애플리케이션 등록" 클릭');
console.log('   🔹 애플리케이션 이름: "포항 스토리텔러"');
console.log('   🔹 사용 API: "검색" 선택');
console.log('   🔹 서비스 환경: "Web" 선택');
console.log('   🔹 서비스 URL: "http://localhost:3000"');

console.log('\n📋 3단계: API 키 확인');
console.log('   🔹 Client ID: 애플리케이션 상세 페이지에서 확인');
console.log('   🔹 Client Secret: 애플리케이션 상세 페이지에서 확인');

console.log('\n📋 4단계: 환경변수 설정');
console.log('   🔹 .env.local 파일 생성:');
console.log('     NAVER_CLIENT_ID=your_actual_client_id');
console.log('     NAVER_CLIENT_SECRET=your_actual_client_secret');

console.log('\n📋 5단계: API 테스트');
console.log('   🔹 터미널에서 실행: node scripts/test-naver-api.js');

console.log('\n💡 네이버 API 사용 가능한 서비스:');
console.log('   🔍 검색 API: 지역 검색, 뉴스 검색, 블로그 검색');
console.log('   🗺️ 지도 API: 주소 검색, 좌표 변환');
console.log('   📱 파파고 API: 번역 서비스');
console.log('   📊 쇼핑 API: 상품 검색');

console.log('\n⚠️ 주의사항:');
console.log('   🔸 API 사용량 제한: 일일 25,000회');
console.log('   🔸 요청 간격: 초당 10회 이하 권장');
console.log('   🔸 API 키 보안: 공개 저장소에 노출 금지');

console.log('\n🎯 포항 스토리텔러에서 활용 가능한 네이버 API:');
console.log('   📍 지역 검색: 포항 관광지, 맛집 검색');
console.log('   🗺️ 주소 검색: 정확한 주소 정보 수집');
console.log('   📰 뉴스 검색: 포항 관련 뉴스 수집');
console.log('   📝 블로그 검색: 포항 여행 후기 수집');

console.log('\n🔧 테스트 명령어:');
console.log('   # 환경변수 설정 후');
console.log('   export NAVER_CLIENT_ID="your_client_id"');
console.log('   export NAVER_CLIENT_SECRET="your_client_secret"');
console.log('   node scripts/test-naver-api.js');

console.log('\n📞 문제 해결:');
console.log('   ❌ 401 오류: API 키가 잘못되었거나 만료됨');
console.log('   ❌ 403 오류: API 사용 권한이 없음');
console.log('   ❌ 429 오류: 요청 한도 초과');
console.log('   ❌ 500 오류: 서버 내부 오류');

console.log('\n🎉 네이버 API 설정 완료 후 포항 스토리텔러에서 활용하세요!');
