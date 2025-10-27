#!/usr/bin/env node
/**
 * 포항 스토리텔러 Scripts 디렉토리 구조 가이드
 * 생성일: 2025-01-27
 * 설명: 최적화된 scripts 디렉토리 구조 및 사용법
 */

console.log('📁 포항 스토리텔러 Scripts 디렉토리 구조');
console.log('='.repeat(60));

console.log('\n🎯 최적화된 구조:');
console.log('scripts/');
console.log('├── 📊 데이터 수집');
console.log('│   ├── collect-real-data.js      # 실제 데이터 수집');
console.log('│   └── scrape-web-data.js        # 웹 스크래핑 (카카오/네이버)');
console.log('├── 💾 데이터 삽입');
console.log('│   └── insert-sample-data.ts     # 샘플 데이터 삽입 (TypeScript)');
console.log('├── 🧪 테스트');
console.log('│   ├── test-api.js               # REST API 테스트');
console.log('│   ├── test-naver-api.js         # 네이버 API 테스트');
console.log('│   ├── test-env-vars.js          # 환경변수 테스트');
console.log('│   └── test-setup.js             # 테스트 환경 설정');
console.log('└── 📖 가이드');
console.log('    └── naver-api-guide.js        # 네이버 API 가이드');

console.log('\n📋 파일별 상세 설명:');
console.log('='.repeat(60));

console.log('\n🔹 데이터 수집 스크립트:');
console.log('  📄 collect-real-data.js');
console.log('     - 포항 실제 관광지, 맛집, 문화시설 데이터 수집');
console.log('     - 정적 데이터 기반 SQL/JSON 파일 생성');
console.log('     - 실행: node scripts/collect-real-data.js');
console.log('');
console.log('  📄 scrape-web-data.js');
console.log('     - 카카오 API + 네이버 API를 통한 동적 데이터 수집');
console.log('     - 웹 스크래핑으로 실시간 데이터 수집');
console.log('     - 실행: node scripts/scrape-web-data.js');

console.log('\n🔹 데이터 삽입 스크립트:');
console.log('  📄 insert-sample-data.ts');
console.log('     - Supabase에 샘플 데이터 직접 삽입');
console.log('     - 사용자, 게시물, 댓글, 좋아요 데이터 생성');
console.log('     - 실행: npx tsx scripts/insert-sample-data.ts');

console.log('\n🔹 테스트 스크립트:');
console.log('  📄 test-api.js');
console.log('     - REST API 엔드포인트 종합 테스트');
console.log('     - 서버 상태 및 API 동작 확인');
console.log('     - 실행: node scripts/test-api.js');
console.log('');
console.log('  📄 test-naver-api.js');
console.log('     - 네이버 API 전용 테스트');
console.log('     - 검색 API 및 플레이스 API 테스트');
console.log('     - 실행: node scripts/test-naver-api.js');
console.log('');
console.log('  📄 test-env-vars.js');
console.log('     - 환경변수 설정 상태 확인');
console.log('     - API 키 유효성 검증');
console.log('     - 실행: node scripts/test-env-vars.js');
console.log('');
console.log('  📄 test-setup.js');
console.log('     - 테스트 환경 설정');
console.log('     - 픽스처 파일 및 디렉토리 생성');
console.log('     - 실행: node scripts/test-setup.js');

console.log('\n🔹 가이드 스크립트:');
console.log('  📄 naver-api-guide.js');
console.log('     - 네이버 API 발급 방법 안내');
console.log('     - 설정 방법 및 문제 해결 가이드');
console.log('     - 실행: node scripts/naver-api-guide.js');

console.log('\n🚀 권장 실행 순서:');
console.log('='.repeat(60));
console.log('1️⃣ 환경 설정 확인');
console.log('   node scripts/test-env-vars.js');
console.log('');
console.log('2️⃣ API 키 테스트');
console.log('   node scripts/test-naver-api.js');
console.log('');
console.log('3️⃣ 데이터 수집');
console.log('   node scripts/collect-real-data.js');
console.log('   node scripts/scrape-web-data.js');
console.log('');
console.log('4️⃣ 샘플 데이터 삽입');
console.log('   npx tsx scripts/insert-sample-data.ts');
console.log('');
console.log('5️⃣ API 테스트');
console.log('   node scripts/test-api.js');

console.log('\n💡 사용 팁:');
console.log('='.repeat(60));
console.log('🔸 개발 환경에서 먼저 test-env-vars.js로 환경변수 확인');
console.log('🔸 API 키가 설정된 후 test-naver-api.js로 API 동작 확인');
console.log('🔸 데이터 수집은 collect-real-data.js → scrape-web-data.js 순서로');
console.log('🔸 샘플 데이터는 개발/테스트용으로만 사용');
console.log('🔸 프로덕션 배포 전 test-api.js로 전체 API 테스트');

console.log('\n🎉 Scripts 디렉토리 정리 완료!');
