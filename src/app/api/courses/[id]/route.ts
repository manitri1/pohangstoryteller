import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import mockCourses from '@/data/mock-courses.json';

// 목업 데이터 유효성 검증
const validateMockData = () => {
  try {
    if (
      !mockCourses ||
      !mockCourses.courses ||
      !Array.isArray(mockCourses.courses)
    ) {
      console.error('❌ 목업 데이터 구조가 올바르지 않습니다.');
      return false;
    }
    console.log(
      '✅ 목업 데이터 구조가 유효합니다. 코스 수:',
      mockCourses.courses.length
    );
    return true;
  } catch (error) {
    console.error('❌ 목업 데이터 로딩 실패:', error);
    return false;
  }
};

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
      console.error(
        '📋 UUID 형식이 필요합니다. 예: 550e8400-e29b-41d4-a716-446655440001'
      );

      // 목업 데이터에서 찾기
      console.log('📋 잘못된 ID 형식으로 목업 데이터를 확인합니다. ID:', id);
      if (validateMockData()) {
        try {
          const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
          if (fallbackCourse) {
            console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
            return NextResponse.json(fallbackCourse);
          }
          console.log('❌ 목업 데이터에서도 코스를 찾을 수 없습니다.');
        } catch (mockError) {
          console.error('❌ 목업 데이터 로딩 오류:', mockError);
        }
      }
      return NextResponse.json(
        { error: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Supabase에서 특정 코스 데이터 조회
    const { data: course, error } = await supabase
      .from('courses')
      .select(
        `
        id,
        title,
        description,
        duration_minutes,
        difficulty,
        distance_km,
        estimated_cost,
        image_url,
        is_featured,
        created_at,
        updated_at,
        course_categories!inner(name),
        course_locations(
          locations(
            id,
            name,
            description,
            coordinates,
            address,
            qr_code,
            image_url,
            stamp_image_url,
            visit_duration_minutes
          )
        ),
        routes(
          id,
          name,
          waypoints,
          color,
          description,
          stroke_weight,
          stroke_opacity,
          is_main_route
        )
      `
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // PGRST205 오류는 테이블이 없음을 의미
      if (error.code === 'PGRST205') {
        console.error(
          '⚠️ 테이블이 존재하지 않습니다. 마이그레이션을 적용해주세요.'
        );
        console.error('📋 마이그레이션 가이드: QUICK_MIGRATION_GUIDE.md 참고');
        // 마이그레이션 미적용 시 목업 데이터에서 찾기
        try {
          const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
          if (fallbackCourse) {
            console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
            return NextResponse.json(fallbackCourse);
          }
        } catch (mockError) {
          console.error('❌ 목업 데이터 로딩 오류:', mockError);
        }
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }

      // 42703 오류는 컬럼이 없음을 의미
      if (error.code === '42703') {
        console.error('⚠️ 컬럼이 존재하지 않습니다. 스키마를 확인해주세요.');
        console.error('📋 오류 상세:', error.message);
        // 스키마 오류 시 목업 데이터에서 찾기
        try {
          const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
          if (fallbackCourse) {
            console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
            return NextResponse.json(fallbackCourse);
          }
        } catch (mockError) {
          console.error('❌ 목업 데이터 로딩 오류:', mockError);
        }
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }

      // 기타 Supabase 오류 시 목업 데이터에서 찾기
      console.error('⚠️ Supabase 연결 오류로 목업 데이터를 사용합니다.');
      console.error('📋 오류 코드:', error.code, '메시지:', error.message);
      try {
        const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
        if (fallbackCourse) {
          console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
          return NextResponse.json(fallbackCourse);
        }
        console.log('❌ 목업 데이터에서도 코스를 찾을 수 없습니다.');
      } catch (mockError) {
        console.error('❌ 목업 데이터 로딩 오류:', mockError);
      }
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course) {
      console.log(
        '📋 데이터베이스에서 코스를 찾을 수 없습니다. 마이그레이션을 확인해주세요.'
      );
      console.log(
        '📋 필요한 마이그레이션: 20241219_001_initial_schema.sql, 20241219_002_sample_data.sql'
      );

      // 데이터베이스에 데이터가 없을 때 목업 데이터 사용
      console.log('🔍 현재 환경:', process.env.NODE_ENV);
      console.log(
        '📋 데이터베이스에 코스 데이터가 없습니다. 마이그레이션을 실행해주세요.'
      );
      console.log('📋 임시로 목업 데이터를 사용합니다.');

      try {
        const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
        if (fallbackCourse) {
          console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
          return NextResponse.json(fallbackCourse);
        }
        console.log('❌ 목업 데이터에서도 코스를 찾을 수 없습니다.');
      } catch (mockError) {
        console.error('❌ 목업 데이터 로딩 오류:', mockError);
      }

      return NextResponse.json(
        {
          error: 'Course not found in database. Please run migrations first.',
          hint: 'Run migrations: 20241219_001_initial_schema.sql, 20241219_002_sample_data.sql',
        },
        { status: 404 }
      );
    }

    // 데이터베이스 결과를 프론트엔드 형식으로 변환
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      fullDescription: course.description, // 상세 설명은 description과 동일
      duration: course.duration_minutes
        ? `${Math.floor(course.duration_minutes / 60)}시간 ${course.duration_minutes % 60}분`
        : '3시간', // 기본값
      difficulty:
        course.difficulty === 'easy'
          ? '쉬움'
          : course.difficulty === 'medium'
            ? '보통'
            : course.difficulty === 'hard'
              ? '어려움'
              : '쉬움', // 기본값
      rating: 4.5, // 기본 평점
      reviewCount: Math.floor(Math.random() * 200) + 50, // 임시 리뷰 수
      image: course.image_url,
      category: (course.course_categories as any)?.name || '기타',
      isFeatured: course.is_featured,
      distance: course.distance_km,
      cost: course.estimated_cost,
      tags: (course.course_categories as any)?.name
        ? [(course.course_categories as any).name]
        : ['기타'], // 카테고리를 태그로 사용
      tips: [
        '편안한 신발을 착용하세요.',
        '날씨에 맞는 옷을 준비하세요.',
        '충분한 물을 준비하세요.',
      ],
      locations:
        course.course_locations?.map((cl: any) => ({
          id: cl.locations?.id || '',
          name: cl.locations?.name || '',
          description: cl.locations?.description || '',
          coordinates: {
            lat:
              cl.locations?.coordinates?.y ||
              cl.locations?.coordinates?.lat ||
              0,
            lng:
              cl.locations?.coordinates?.x ||
              cl.locations?.coordinates?.lng ||
              0,
          },
          qrCode: cl.locations?.qr_code || '',
          image: cl.locations?.image_url || '',
          stampImage: cl.locations?.stamp_image_url || '',
          visitDuration: cl.locations?.visit_duration_minutes || 0,
          address: cl.locations?.address || '',
          media: [
            {
              id: `${cl.locations?.id || ''}-media`,
              type: 'image',
              url: cl.locations?.image_url || '',
              title: cl.locations?.name || '',
            },
          ],
        })) || [],
      routes:
        course.routes?.map((route: any) => ({
          id: route.id,
          name: route.name,
          waypoints: route.waypoints,
          color: route.color,
          description: route.description,
          strokeWeight: route.stroke_weight,
          strokeOpacity: route.stroke_opacity,
          isMainRoute: route.is_main_route,
        })) || [],
    };

    return NextResponse.json(transformedCourse);
  } catch (error) {
    console.error('API error:', error);
    // 모든 오류 시 목업 데이터에서 찾기
    const { id } = await params;
    console.log('📋 예외 발생으로 목업 데이터를 확인합니다. ID:', id);
    try {
      const fallbackCourse = mockCourses.courses.find((c) => c.id === id);
      if (fallbackCourse) {
        console.log('✅ 목업 데이터에서 코스를 찾았습니다.');
        return NextResponse.json(fallbackCourse);
      }
      console.log('❌ 목업 데이터에서도 코스를 찾을 수 없습니다.');
    } catch (mockError) {
      console.error('❌ 목업 데이터 로딩 오류:', mockError);
    }
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
