import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Supabase 클라이언트 확인
    if (!supabase) {
      console.error('Supabase 클라이언트 초기화 실패');
      return NextResponse.json(
        { error: '데이터베이스 연결에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 스탬프 조회
    const { data: stamps, error: stampsError } = await supabase
      .from('user_stamps')
      .select(
        `
        id,
        location_id,
        acquired_at,
        points,
        rarity,
        is_verified,
        locations!inner(
          id,
          name,
          description,
          image_url,
          coordinates
        )
      `
      )
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false });

    if (stampsError) {
      console.error('스탬프 조회 오류:', stampsError);
      return NextResponse.json(
        { error: '스탬프 데이터를 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 사용자 스탬프 통계 조회
    const { data: stats, error: statsError } = await supabase
      .from('user_stamp_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError) {
      console.error('통계 조회 오류:', statsError);
    }

    // 스탬프 데이터 변환
    const transformedStamps =
      stamps?.map((stamp) => ({
        id: stamp.id,
        locationId: stamp.location_id,
        locationName: stamp.locations[0]?.name || '알 수 없는 위치',
        locationImage: stamp.locations[0]?.image_url,
        acquiredAt: stamp.acquired_at,
        stampImage: stamp.locations[0]?.image_url, // 실제로는 별도 스탬프 이미지 사용
        description: stamp.locations[0]?.description,
        rarity: stamp.rarity,
        points: stamp.points,
        isVerified: stamp.is_verified,
      })) || [];

    return NextResponse.json({
      stamps: transformedStamps,
      stats: stats || {
        total_stamps: 0,
        total_points: 0,
        rare_count: 0,
        epic_count: 0,
        legendary_count: 0,
        completion_rate: 0,
      },
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Supabase 클라이언트 확인
    if (!supabase) {
      console.error('Supabase 클라이언트 초기화 실패');
      return NextResponse.json(
        { error: '데이터베이스 연결에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { locationId, qrCodeData, deviceInfo, coordinates } = body;

    if (!locationId) {
      return NextResponse.json(
        { error: '위치 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 위치 정보 확인
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .select('id, name, description, image_url')
      .eq('id', locationId)
      .eq('is_active', true)
      .single();

    if (locationError || !location) {
      return NextResponse.json(
        { error: '유효하지 않은 위치입니다.' },
        { status: 404 }
      );
    }

    // 중복 스탬프 확인
    const { data: existingStamp, error: duplicateError } = await supabase
      .from('user_stamps')
      .select('id')
      .eq('user_id', user.id)
      .eq('location_id', locationId)
      .single();

    if (existingStamp) {
      return NextResponse.json(
        { error: '이미 획득한 스탬프입니다.' },
        { status: 409 }
      );
    }

    // 희귀도 결정 (간단한 로직)
    const rarity = determineRarity(locationId);
    const points = calculatePoints(rarity);

    // 스탬프 생성
    const { data: newStamp, error: stampError } = await supabase
      .from('user_stamps')
      .insert({
        user_id: user.id,
        location_id: locationId,
        points: points,
        rarity: rarity,
        is_verified: true,
        verification_code: qrCodeData,
      })
      .select()
      .single();

    if (stampError) {
      console.error('스탬프 생성 오류:', stampError);
      return NextResponse.json(
        { error: '스탬프 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 스탬프 획득 기록 생성
    const { error: acquisitionError } = await supabase
      .from('stamp_acquisitions')
      .insert({
        user_stamp_id: newStamp.id,
        acquisition_method: 'qr_scan',
        qr_code_data: qrCodeData,
        device_info: deviceInfo,
        location_coordinates: coordinates,
      });

    if (acquisitionError) {
      console.error('획득 기록 생성 오류:', acquisitionError);
    }

    return NextResponse.json({
      success: true,
      stamp: {
        id: newStamp.id,
        locationId: locationId,
        locationName: location.name,
        locationImage: location.image_url,
        acquiredAt: newStamp.acquired_at,
        stampImage: location.image_url,
        description: location.description,
        rarity: rarity,
        points: points,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 희귀도 결정 함수
function determineRarity(
  locationId: string
): 'common' | 'rare' | 'epic' | 'legendary' {
  // 실제로는 더 복잡한 로직 사용 가능
  const random = Math.random();
  if (random < 0.6) return 'common';
  if (random < 0.85) return 'rare';
  if (random < 0.95) return 'epic';
  return 'legendary';
}

// 포인트 계산 함수
function calculatePoints(rarity: string): number {
  switch (rarity) {
    case 'common':
      return 10;
    case 'rare':
      return 25;
    case 'epic':
      return 50;
    case 'legendary':
      return 100;
    default:
      return 10;
  }
}
