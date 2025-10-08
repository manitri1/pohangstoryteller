const fs = require('fs');
const QRCode = require('qrcode');

// QR 코드 데이터 읽기
const qrData = JSON.parse(fs.readFileSync('qr_codes_data.json', 'utf8'));

// QR 코드 이미지 생성 함수
async function generateQRCodeImage(data, filename) {
  try {
    // QR 코드 데이터 생성 (JSON 형태로 인코딩)
    const qrDataString = JSON.stringify({
      id: data.id,
      name: data.name,
      coordinates: data.coordinates,
      timestamp: new Date().toISOString(),
    });

    // QR 코드 이미지 생성
    const qrCodeImage = await QRCode.toDataURL(qrDataString, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });

    // Base64 데이터를 파일로 저장
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(`${filename}.png`, base64Data, 'base64');

    console.log(`✅ QR 코드 생성 완료: ${data.id} - ${data.name}`);
    return true;
  } catch (error) {
    console.error(`❌ QR 코드 생성 실패: ${data.id} - ${error.message}`);
    return false;
  }
}

// 모든 QR 코드 생성
async function generateAllQRCodes() {
  console.log('🚀 포항 스토리텔러 QR 코드 이미지 생성 시작...');
  console.log(`📊 총 ${qrData.qr_codes.length}개의 QR 코드를 생성합니다.\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < qrData.qr_codes.length; i++) {
    const qrCode = qrData.qr_codes[i];
    const filename = qrCode.id;

    console.log(
      `[${i + 1}/${qrData.qr_codes.length}] ${qrCode.name} 처리 중...`
    );

    const success = await generateQRCodeImage(qrCode, filename);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // 진행률 표시
    const progress = Math.round(((i + 1) / qrData.qr_codes.length) * 100);
    console.log(
      `진행률: ${progress}% (성공: ${successCount}, 실패: ${failCount})\n`
    );
  }

  console.log('🎉 QR 코드 생성 완료!');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`📁 생성된 파일 위치: ${__dirname}`);
}

// 실행
generateAllQRCodes().catch(console.error);
