'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  QrCode,
  Navigation,
  Star,
  Settings,
} from 'lucide-react';
import { StampInTour } from '@/types/stamp-tour';
import { useLocation } from '@/hooks/use-location';
import { QRScanner } from './qr-scanner';

interface StampCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stamp: StampInTour;
  onCollect: (stamp: StampInTour) => void;
}

export function StampCollectionModal({
  isOpen,
  onClose,
  stamp,
  onCollect,
}: StampCollectionModalProps) {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [locationVerificationEnabled, setLocationVerificationEnabled] =
    useState(() => {
      // 로컬 스토리지에서 위치 검증 설정을 불러옴 (기본값: true)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('locationVerificationEnabled');
        return saved ? JSON.parse(saved) : true;
      }
      return true;
    });

  const {
    location,
    error: locationErrorState,
    isLoading: locationLoading,
    getCurrentLocation,
    isWithinRange,
  } = useLocation();

  // 위치 검증 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'locationVerificationEnabled',
        JSON.stringify(locationVerificationEnabled)
      );
    }
  }, [locationVerificationEnabled]);

  useEffect(() => {
    if (isOpen && locationVerificationEnabled) {
      verifyLocation();
    } else if (isOpen && !locationVerificationEnabled) {
      // 위치 검증이 비활성화된 경우 자동으로 검증 완료로 설정
      setLocationVerified(true);
      setLocationError(null);
    }
  }, [isOpen, locationVerificationEnabled]);

  const verifyLocation = async () => {
    try {
      setLocationError(null);
      await getCurrentLocation();
    } catch (error) {
      setLocationError('위치 정보를 가져올 수 없습니다.');
    }
  };

  useEffect(() => {
    if (location && locationVerificationEnabled) {
      const isInRange = isWithinRange(
        stamp.coordinates.lat,
        stamp.coordinates.lng,
        100 // 100미터 반경
      );
      setLocationVerified(isInRange);

      if (!isInRange) {
        setLocationError(
          '스탬프 위치에서 너무 멀리 떨어져 있습니다. (100m 이내)'
        );
      }
    }
  }, [location, stamp.coordinates, isWithinRange, locationVerificationEnabled]);

  const handleQRScanSuccess = (scannedStamp: StampInTour) => {
    setShowQRScanner(false);

    // QR 스캔 성공 시 스탬프 수집 처리
    if (!locationVerificationEnabled || locationVerified) {
      handleCollectStamp();
    } else {
      setLocationError('위치 검증이 필요합니다.');
    }
  };

  const handleCollectStamp = async () => {
    console.log('스탬프 수집 시작:', {
      locationVerificationEnabled,
      locationVerified,
      stamp: stamp.name,
    });

    if (locationVerificationEnabled && !locationVerified) {
      setLocationError('위치 검증이 완료되지 않았습니다.');
      return;
    }

    setIsCollecting(true);

    try {
      // 스탬프 수집 처리
      const collectedStamp: StampInTour = {
        ...stamp,
        isCollected: true,
        collectedAt: new Date().toISOString(),
      };

      console.log('스탬프 수집 데이터:', collectedStamp);
      onCollect(collectedStamp);
      onClose();
    } catch (error) {
      console.error('스탬프 수집 실패:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  const getDistance = () => {
    if (!location) return null;

    const distance =
      Math.sqrt(
        Math.pow(location.latitude - stamp.coordinates.lat, 2) +
          Math.pow(location.longitude - stamp.coordinates.lng, 2)
      ) * 111000; // 대략적인 미터 변환

    return Math.round(distance);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>스탬프 수집</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 스탬프 정보 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{stamp.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {stamp.name}
              </h3>
              <p className="text-gray-600 mb-4">{stamp.description}</p>
              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {stamp.rarity} • {stamp.points}점
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {stamp.location}
                </div>
              </div>
            </div>

            {/* 위치 검증 설정 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">위치 검증</h4>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <Label
                    htmlFor="location-verification-toggle"
                    className="text-sm text-gray-600"
                  >
                    위치 검증 활성화
                  </Label>
                  <Switch
                    id="location-verification-toggle"
                    checked={locationVerificationEnabled}
                    onCheckedChange={setLocationVerificationEnabled}
                  />
                </div>
              </div>

              {!locationVerificationEnabled && (
                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    위치 검증이 비활성화되어 있습니다. (테스트 모드)
                  </span>
                </div>
              )}

              {locationVerificationEnabled && locationLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">위치 확인 중...</span>
                </div>
              )}

              {locationVerificationEnabled && location && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {locationVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        locationVerified ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {locationVerified ? '위치 검증 완료' : '위치 검증 실패'}
                    </span>
                  </div>

                  {getDistance() && (
                    <div className="text-xs text-gray-500">
                      현재 위치에서 {getDistance()}m 떨어져 있음
                    </div>
                  )}
                </div>
              )}

              {locationError && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{locationError}</span>
                </div>
              )}

              {locationErrorState && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{locationErrorState.message}</span>
                </div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              {locationVerificationEnabled && !locationVerified && (
                <Button
                  onClick={verifyLocation}
                  variant="outline"
                  className="w-full"
                  disabled={locationLoading}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  위치 다시 확인
                </Button>
              )}

              {(!locationVerificationEnabled || locationVerified) && (
                <Button
                  onClick={() => setShowQRScanner(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR 코드 스캔
                </Button>
              )}

              {(!locationVerificationEnabled || locationVerified) && (
                <Button
                  onClick={handleCollectStamp}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isCollecting}
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      수집 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      스탬프 수집
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* 사용 안내 */}
            <div className="text-xs text-gray-500 space-y-1">
              {locationVerificationEnabled ? (
                <>
                  <p>• 스탬프 위치에서 100m 이내에 있어야 합니다</p>
                  <p>• QR 코드를 스캔하거나 직접 수집할 수 있습니다</p>
                  <p>• 위치 권한이 필요합니다</p>
                </>
              ) : (
                <>
                  <p>
                    • 테스트 모드: 위치 검증 없이 스탬프를 수집할 수 있습니다
                  </p>
                  <p>• QR 코드를 스캔하거나 직접 수집할 수 있습니다</p>
                  <p>• 개발/테스트 목적으로만 사용하세요</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR 스캐너 모달 */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
        targetStamp={stamp}
      />
    </>
  );
}
