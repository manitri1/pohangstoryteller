# 📱 QR 스탬프 투어 시스템 설치 가이드

## 📦 필요한 패키지 설치

### 1. QR 코드 스캔 라이브러리

```bash
npm install @zxing/library
npm install qr-scanner
```

### 2. 애니메이션 라이브러리pohangstoryteller copy

```bash
npm install framer-motion
```

### 3. 카메라 관련 타입 정의

```bash
npm install --save-dev @types/dom-mediacapture-record
```

## 🔧 설정 파일 업데이트

### next.config.ts에 카메라 권한 추가

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... 기존 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

## 📱 QR 스캔 컴포넌트 개선

### 실제 QR 코드 스캔을 위한 라이브러리 사용

```typescript
// QRScanner.tsx에서 실제 라이브러리 사용
import { BrowserQRCodeReader } from '@zxing/library';

const scanQRCode = async () => {
  const codeReader = new BrowserQRCodeReader();
  const result = await codeReader.decodeFromVideoDevice(
    undefined,
    videoRef.current
  );

  if (result) {
    handleScanResult(result.getText());
  }
};
```

## 🗄️ 데이터베이스 마이그레이션 실행

### Supabase에서 마이그레이션 실행

```sql
-- 20241219_012_stamp_system.sql 파일을 Supabase SQL Editor에서 실행
```

## 🎯 테스트 방법

### 1. QR 코드 생성 테스트

```javascript
// 테스트용 QR 코드 생성
const testQRCode = 'STAMP_LOCATION_001';
```

### 2. 카메라 권한 테스트

- 브라우저에서 HTTPS 환경에서 테스트
- 카메라 권한 허용 확인

### 3. 스탬프 획득 테스트

- QR 코드 스캔 후 스탬프 획득 확인
- 애니메이션 효과 확인
- 데이터베이스 저장 확인

## 🚀 배포 시 주의사항

### 1. HTTPS 필수

- 카메라 접근을 위해 HTTPS 환경 필요
- Vercel 배포 시 자동으로 HTTPS 적용

### 2. 권한 정책 설정

- 브라우저 권한 정책 설정
- 사용자에게 명확한 권한 요청 안내

### 3. 성능 최적화

- QR 스캔 성능 최적화
- 애니메이션 성능 최적화
- 이미지 로딩 최적화

## 📋 체크리스트

- [ ] 필요한 패키지 설치 완료
- [ ] QR 스캔 컴포넌트 구현 완료
- [ ] 스탬프 시스템 데이터베이스 스키마 생성
- [ ] API 엔드포인트 구현 완료
- [ ] 애니메이션 컴포넌트 구현 완료
- [ ] 스탬프 컬렉션 페이지 구현 완료
- [ ] 카메라 권한 테스트 완료
- [ ] QR 코드 스캔 테스트 완료
- [ ] 스탬프 획득 테스트 완료
- [ ] 애니메이션 효과 테스트 완료

## 🎉 완료!

QR 스탬프 투어 시스템이 성공적으로 구현되었습니다!
