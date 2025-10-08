#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 테스트 환경 설정 중...');

// 테스트 디렉토리 생성
const testDirs = ['tests/fixtures', 'tests/results', 'test-results'];

testDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 디렉토리 생성: ${dir}`);
  }
});

// 테스트 픽스처 파일 생성
const fixtures = [
  'test-image.jpg',
  'test-image-1.jpg',
  'test-image-2.jpg',
  'test-image-3.jpg',
  'test-video.mp4',
  'large-image.jpg',
  'test-file.txt',
];

fixtures.forEach((fixture) => {
  const filePath = path.join('tests/fixtures', fixture);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `# 테스트 파일: ${fixture}\n`);
    console.log(`✅ 픽스처 파일 생성: ${fixture}`);
  }
});

console.log('🎉 테스트 환경 설정 완료!');
console.log('');
console.log('테스트 실행 명령어:');
console.log('  npm run test:community  - 커뮤니티 기능 테스트');
console.log('  npm run test:ui         - UI 모드로 테스트 실행');
console.log('  npm run test:headed     - 헤드 모드로 테스트 실행');
console.log('  npm run test:debug      - 디버그 모드로 테스트 실행');
