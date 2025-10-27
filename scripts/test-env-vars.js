#!/usr/bin/env node
/**
 * 환경변수 테스트 스크립트
 */

const { getMockData, generateSQL } = require('./scrape-web-data.js');

// 환경변수 설정
process.env.DEFAULT_IMAGE_URL = 'https://picsum.photos/400/300';
process.env.DEFAULT_STAMP_IMAGE_URL = 'https://picsum.photos/200/200';
process.env.DEFAULT_VISIT_DURATION = '90';
process.env.QR_CODE_PREFIX = 'POHANG_';

// 데이터 생성 및 SQL 파일 생성
const data = getMockData();
const sql = generateSQL(data);

require('fs').writeFileSync('./supabase/migrations/20250127_004_scraped_data.sql', sql, 'utf8');

console.log('✅ 환경변수 기반 SQL 파일 생성 완료!');
console.log('📊 생성된 데이터:', data.length, '개');
console.log('📁 파일 위치: ./supabase/migrations/20250127_004_scraped_data.sql');
