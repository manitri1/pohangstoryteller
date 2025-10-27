import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // UUID 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error('⚠️ 잘못된 ID 형식:', id);
      return NextResponse.json(
        { error: 'Invalid course ID format. UUID 형식이 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Supabase에서 특정 코스 데이터 조회
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        full_description,
        duration_hours,
        difficulty_level,
        rating,
        image_url,
        category,
        is_featured,
        created_at,
        locations:courses_locations(
          location:locations(
            id,
            name,
            description,
            coordinates,
            address,
            qr_code,
            image_url,
            visit_duration_minutes
          ),
          order_index
        ),
        routes:courses_routes(
          id,
          name,
          description,
          color,
          stroke_weight,
          stroke_opacity,
          is_main_route,
          coordinates
        )
      `)
      .eq('id', id)
      .single();

    if (courseError) {
      console.error('❌ 코스 조회 실패:', courseError);
      
      if (courseError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'database_error',
          message: '데이터베이스 오류가 발생했습니다.',
          details: courseError.message
        },
        { status: 500 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // 데이터 변환
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      fullDescription: course.full_description,
      duration: `${course.duration_hours}시간`,
      difficulty: course.difficulty_level,
      rating: course.rating || 0,
      image: course.image_url,
      category: course.category,
      isFeatured: course.is_featured,
      createdAt: course.created_at,
      locations: course.locations
        ?.sort((a: any, b: any) => a.order_index - b.order_index)
        ?.map((cl: any) => ({
          id: cl.location.id,
          name: cl.location.name,
          description: cl.location.description,
          coordinates: cl.location.coordinates,
          address: cl.location.address,
          qrCode: cl.location.qr_code,
          image: cl.location.image_url,
          visitDuration: cl.location.visit_duration_minutes
        })) || [],
      routes: course.routes?.map((route: any) => ({
        id: route.id,
        name: route.name,
        description: route.description,
        color: route.color,
        coordinates: route.coordinates,
        strokeWeight: route.stroke_weight,
        strokeOpacity: route.stroke_opacity,
        isMainRoute: route.is_main_route,
      })) || []
    };

    return NextResponse.json(transformedCourse);
  } catch (error) {
    console.error('❌ API 오류:', error);
    return NextResponse.json(
      { 
        error: 'server_error',
        message: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}