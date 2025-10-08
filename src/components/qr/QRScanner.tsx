'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  CameraOff,
  QrCode,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
  onClose: () => void;
}

interface ScanResult {
  success: boolean;
  data: string;
  locationId?: string;
  locationName?: string;
}

export default function QRScanner({
  onScan,
  onError,
  isActive,
  onClose,
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 카메라 권한 요청 및 스트림 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      setHasPermission(false);
      onError('카메라 접근 권한이 필요합니다.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // QR 코드 스캔 로직
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // 비디오 프레임을 캔버스에 그리기
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 간단한 QR 코드 감지 (실제로는 라이브러리 사용)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const qrData = detectQRCode(imageData);

    if (qrData) {
      handleScanResult(qrData);
    }
  };

  // QR 코드 감지 함수 (실제 구현에서는 라이브러리 사용)
  const detectQRCode = (imageData: ImageData): string | null => {
    // 여기서는 간단한 시뮬레이션
    // 실제로는 @zxing/library 또는 qr-scanner 라이브러리 사용
    return null;
  };

  // 스캔 결과 처리
  const handleScanResult = async (data: string) => {
    setIsProcessing(true);

    try {
      // QR 코드 데이터 검증
      const result = await validateQRCode(data);

      if (result.success) {
        setScanResult(result);
        onScan(data);
        toast({
          title: '스탬프 획득!',
          description: `${result.locationName}에서 스탬프를 획득했습니다.`,
        });
      } else {
        onError('유효하지 않은 QR 코드입니다.');
      }
    } catch (error) {
      onError('QR 코드 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // QR 코드 검증
  const validateQRCode = async (data: string): Promise<ScanResult> => {
    // QR 코드 형식 검증 (예: "STAMP_LOCATION_ID")
    const stampPattern = /^STAMP_([A-Z0-9_]+)$/;
    const match = data.match(stampPattern);

    if (!match) {
      return { success: false, data };
    }

    const locationId = match[1];

    // 서버에서 위치 정보 확인
    try {
      const response = await fetch(`/api/locations/${locationId}`);
      if (response.ok) {
        const location = await response.json();
        return {
          success: true,
          data,
          locationId,
          locationName: location.name,
        };
      }
    } catch (error) {
      console.error('위치 정보 확인 실패:', error);
    }

    return { success: false, data };
  };

  // 컴포넌트 마운트 시 카메라 시작
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  // 스캔 루프
  useEffect(() => {
    if (!isScanning || isProcessing) return;

    const interval = setInterval(scanQRCode, 100); // 100ms마다 스캔
    return () => clearInterval(interval);
  }, [isScanning, isProcessing]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5" />
            QR 코드 스캔
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 카메라 권한 상태 */}
          {hasPermission === false && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">카메라 접근 권한이 필요합니다.</span>
            </div>
          )}

          {/* 비디오 스트림 */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* 스캔 오버레이 */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
            )}
          </div>

          {/* 스캔 결과 */}
          {scanResult && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                {scanResult.locationName} 스탬프 획득!
              </span>
            </div>
          )}

          {/* 처리 중 */}
          {isProcessing && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">처리 중...</p>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="text-center text-sm text-gray-600">
            <p>QR 코드를 카메라에 비춰주세요</p>
            <p className="text-xs mt-1">
              스탬프를 획득하여 포항 여행을 기록하세요!
            </p>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <CameraOff className="h-4 w-4 mr-2" />
              닫기
            </Button>
            {!isScanning && hasPermission && (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                다시 시작
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
