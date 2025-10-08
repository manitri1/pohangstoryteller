import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 위치 정보 조회
    const { data: location, error } = await supabase
      .from('locations')
      .select(
        `
        id,
        name,
        description,
        coordinates,
        address,
        image_url,
        stamp_image_url,
        visit_duration_minutes,
        is_active
      `
      )
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !location) {
      return NextResponse.json(
        { error: '위치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
