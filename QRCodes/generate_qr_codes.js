const fs = require('fs');
const path = require('path');

// QR 코드 데이터 읽기
const qrData = JSON.parse(fs.readFileSync('qr_codes_data.json', 'utf8'));

// QR 코드 생성 함수 (실제로는 qrcode 라이브러리 사용)
function generateQRCode(data, filename) {
  // 실제 구현에서는 qrcode 라이브러리를 사용해야 합니다
  // npm install qrcode
  console.log(`QR 코드 생성: ${data.id} - ${data.name}`);

  // 임시로 텍스트 파일 생성 (실제로는 PNG 이미지 생성)
  const content = `QR Code: ${data.id}
Name: ${data.name}
Description: ${data.description}
Address: ${data.address}
Coordinates: ${data.coordinates.lat}, ${data.coordinates.lng}
Visit Duration: ${data.visit_duration_minutes} minutes
Image URL: ${data.image_url}
Stamp Image URL: ${data.stamp_image_url}

Generated at: ${new Date().toISOString()}`;

  fs.writeFileSync(`${filename}.txt`, content);
}

// 모든 QR 코드 생성
console.log('포항 스토리텔러 QR 코드 생성 시작...');
console.log(`총 ${qrData.qr_codes.length}개의 QR 코드를 생성합니다.`);

qrData.qr_codes.forEach((qrCode, index) => {
  const filename = qrCode.id;
  generateQRCode(qrCode, filename);
  console.log(
    `진행률: ${index + 1}/${qrData.qr_codes.length} (${Math.round(((index + 1) / qrData.qr_codes.length) * 100)}%)`
  );
});

console.log('QR 코드 생성 완료!');
console.log('실제 PNG 이미지를 생성하려면 다음 명령어를 실행하세요:');
console.log('npm install qrcode');
console.log('node generate_qr_images.js');
