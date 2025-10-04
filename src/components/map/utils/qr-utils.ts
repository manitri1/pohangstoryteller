/**
 * 📱 QR 코드 유틸리티 함수들
 * QR 코드 생성, 스캔, 검증 기능을 제공합니다.
 */

import { QRCodeInfo, Coordinate } from '../types';

/**
 * QR 코드 정보 생성
 */
export function createQRCodeInfo(
  type: QRCodeInfo['type'],
  locationId: string,
  data: any,
  expiresAt?: Date
): QRCodeInfo {
  return {
    type,
    locationId,
    data,
    expiresAt,
  };
}

/**
 * QR 코드 데이터를 JSON 문자열로 인코딩
 */
export function encodeQRData(qrInfo: QRCodeInfo): string {
  const qrData = {
    type: qrInfo.type,
    locationId: qrInfo.locationId,
    data: qrInfo.data,
    expiresAt: qrInfo.expiresAt?.toISOString(),
    timestamp: new Date().toISOString(),
  };
  
  return JSON.stringify(qrData);
}

/**
 * JSON 문자열을 QR 코드 데이터로 디코딩
 */
export function decodeQRData(qrString: string): QRCodeInfo | null {
  try {
    const qrData = JSON.parse(qrString);
    
    // 필수 필드 검증
    if (!qrData.type || !qrData.locationId || !qrData.data) {
      return null;
    }
    
    // 만료 시간 검증
    if (qrData.expiresAt) {
      const expiresAt = new Date(qrData.expiresAt);
      if (expiresAt < new Date()) {
        return null; // 만료된 QR 코드
      }
    }
    
    return {
      type: qrData.type,
      locationId: qrData.locationId,
      data: qrData.data,
      expiresAt: qrData.expiresAt ? new Date(qrData.expiresAt) : undefined,
    };
  } catch (error) {
    console.error('QR 코드 디코딩 실패:', error);
    return null;
  }
}

/**
 * QR 코드 유효성 검사
 */
export function validateQRCode(qrInfo: QRCodeInfo): boolean {
  // 기본 필드 검증
  if (!qrInfo.type || !qrInfo.locationId || !qrInfo.data) {
    return false;
  }
  
  // 타입 검증
  const validTypes = ['stamp', 'story', 'media'];
  if (!validTypes.includes(qrInfo.type)) {
    return false;
  }
  
  // 만료 시간 검증
  if (qrInfo.expiresAt && qrInfo.expiresAt < new Date()) {
    return false;
  }
  
  return true;
}

/**
 * 스탬프 QR 코드 생성
 */
export function createStampQRCode(
  locationId: string,
  stampId: string,
  reward?: {
    type: 'coupon' | 'badge' | 'discount';
    value: string;
    description: string;
  }
): string {
  const qrInfo = createQRCodeInfo('stamp', locationId, {
    stampId,
    reward,
  });
  
  return encodeQRData(qrInfo);
}

/**
 * 스토리 QR 코드 생성
 */
export function createStoryQRCode(
  locationId: string,
  storyId: string,
  mediaUrl?: string
): string {
  const qrInfo = createQRCodeInfo('story', locationId, {
    storyId,
    mediaUrl,
  });
  
  return encodeQRData(qrInfo);
}

/**
 * 미디어 QR 코드 생성
 */
export function createMediaQRCode(
  locationId: string,
  mediaId: string,
  mediaType: 'image' | 'video' | 'audio',
  mediaUrl: string
): string {
  const qrInfo = createQRCodeInfo('media', locationId, {
    mediaId,
    mediaType,
    mediaUrl,
  });
  
  return encodeQRData(qrInfo);
}

/**
 * QR 코드 스캔 (카메라 접근)
 */
export function scanQRCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 카메라 접근 권한 확인
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      reject(new Error('카메라를 지원하지 않는 브라우저입니다.'));
      return;
    }

    // 간단한 QR 스캔 구현 (실제로는 더 복잡한 라이브러리 필요)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // 여기서 실제 QR 스캔 로직을 구현해야 함
        // 예: qr-scanner 라이브러리 사용
        console.log('QR 스캔 시작');
        
        // 임시로 더미 데이터 반환
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          resolve('dummy_qr_data');
        }, 2000);
      })
      .catch(error => {
        reject(new Error(`카메라 접근 실패: ${error.message}`));
      });
  });
}

/**
 * QR 코드 이미지 생성 (Canvas 사용)
 */
export function generateQRCodeImage(
  qrData: string,
  size: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 실제로는 QR 코드 라이브러리 (예: qrcode.js)를 사용해야 함
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas를 지원하지 않는 브라우저입니다.'));
      return;
    }
    
    // 간단한 QR 코드 패턴 생성 (실제로는 라이브러리 사용)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < size; i += 10) {
      for (let j = 0; j < size; j += 10) {
        if ((i + j) % 20 === 0) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }
    
    const dataURL = canvas.toDataURL('image/png');
    resolve(dataURL);
  });
}

/**
 * QR 코드 다운로드
 */
export function downloadQRCode(qrData: string, filename: string = 'qrcode.png'): void {
  generateQRCodeImage(qrData)
    .then(dataURL => {
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('QR 코드 다운로드 실패:', error);
    });
}

/**
 * QR 코드 공유 (Web Share API 사용)
 */
export async function shareQRCode(qrData: string, title: string = 'QR 코드'): Promise<void> {
  if (!navigator.share) {
    // Web Share API를 지원하지 않는 경우 클립보드에 복사
    await navigator.clipboard.writeText(qrData);
    alert('QR 코드 데이터가 클립보드에 복사되었습니다.');
    return;
  }

  try {
    await navigator.share({
      title,
      text: qrData,
    });
  } catch (error) {
    console.error('QR 코드 공유 실패:', error);
  }
}

/**
 * QR 코드 만료 시간 설정
 */
export function setQRCodeExpiration(hours: number = 24): Date {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
}

/**
 * QR 코드 만료 시간 검증
 */
export function isQRCodeExpired(expiresAt: Date): boolean {
  return expiresAt < new Date();
}

/**
 * QR 코드 만료까지 남은 시간 계산
 */
export function getQRCodeTimeRemaining(expiresAt: Date): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

/**
 * QR 코드 통계 생성
 */
export function generateQRCodeStats(qrCodes: QRCodeInfo[]): {
  total: number;
  byType: Record<string, number>;
  expired: number;
  valid: number;
} {
  const stats = {
    total: qrCodes.length,
    byType: {} as Record<string, number>,
    expired: 0,
    valid: 0,
  };
  
  qrCodes.forEach(qrCode => {
    // 타입별 통계
    stats.byType[qrCode.type] = (stats.byType[qrCode.type] || 0) + 1;
    
    // 만료 상태 통계
    if (qrCode.expiresAt && isQRCodeExpired(qrCode.expiresAt)) {
      stats.expired++;
    } else {
      stats.valid++;
    }
  });
  
  return stats;
}
