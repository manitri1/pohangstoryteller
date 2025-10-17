'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Camera,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';
import { StampInTour } from '@/types/stamp-tour';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (stamp: StampInTour) => void;
  targetStamp?: StampInTour;
}

export function QRScanner({
  isOpen,
  onClose,
  onScanSuccess,
  targetStamp,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    } else {
      stopScanning();
    }
  }, [isOpen]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라 우선
        },
      });
      setHasPermission(true);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      setHasPermission(false);
      setError('카메라 접근 권한이 필요합니다.');
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleQRCodeDetected = (result: string) => {
    setScanResult(result);
    setIsScanning(false);

    // QR 코드 데이터 파싱
    try {
      const qrData = JSON.parse(result);

      // 스탬프 데이터 검증
      if (qrData.type === 'stamp' && qrData.stampId) {
        // 실제로는 서버에서 스탬프 정보를 가져와야 함
        const mockStamp: StampInTour = {
          id: qrData.stampId,
          name: targetStamp?.name || '스탬프',
          description:
            targetStamp?.description || 'QR 코드로 획득한 스탬프입니다.',
          location: targetStamp?.location || '알 수 없는 위치',
          coordinates: targetStamp?.coordinates || { lat: 0, lng: 0 },
          imageUrl:
            targetStamp?.imageUrl || 'https://picsum.photos/200/200?random=999',
          rarity: targetStamp?.rarity || 'common',
          points: targetStamp?.points || 50,
          isCollected: false,
          order: targetStamp?.order || 1,
        };

        onScanSuccess(mockStamp);
      } else {
        setError('유효하지 않은 QR 코드입니다.');
      }
    } catch (err) {
      setError('QR 코드 형식이 올바르지 않습니다.');
    }
  };

  const simulateQRScan = () => {
    // 개발용 시뮬레이션
    const mockQRData = {
      type: 'stamp',
      stampId: targetStamp?.id || 'stamp_simulation',
      timestamp: Date.now(),
    };
    handleQRCodeDetected(JSON.stringify(mockQRData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR 코드 스캔</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 카메라 권한 상태 */}
          {hasPermission === false && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">
                카메라 접근 권한이 필요합니다.
              </p>
              <Button onClick={requestCameraPermission}>권한 다시 요청</Button>
            </div>
          )}

          {/* 카메라 미리보기 */}
          {hasPermission && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />

              {/* 스캔 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            </div>
          )}

          {/* 스캔 결과 */}
          {scanResult && (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">QR 코드 스캔 완료!</p>
            </div>
          )}

          {/* 오류 메시지 */}
          {error && (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 대상 스탬프 정보 */}
          {targetStamp && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">스캔 대상</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{targetStamp.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">
                    {targetStamp.name}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {targetStamp.location}
                  </p>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">
                    {targetStamp.rarity} • {targetStamp.points}점
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex space-x-2">
            {!isScanning && hasPermission && (
              <Button
                onClick={startScanning}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                스캔 시작
              </Button>
            )}

            {isScanning && (
              <Button
                onClick={stopScanning}
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                스캔 중지
              </Button>
            )}

            {/* 개발용 시뮬레이션 버튼 */}
            <Button
              onClick={simulateQRScan}
              variant="outline"
              className="flex-1"
            >
              <QrCode className="h-4 w-4 mr-2" />
              시뮬레이션
            </Button>
          </div>

          {/* 사용 안내 */}
          <div className="text-xs text-gray-500 text-center">
            <p>QR 코드를 카메라에 비춰주세요</p>
            <p>스캔이 어려운 경우 시뮬레이션 버튼을 사용하세요</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
