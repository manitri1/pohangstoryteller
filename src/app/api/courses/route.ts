import { NextResponse } from 'next/server';
import { createPureClient } from '@/lib/supabase/server';
import mockCourses from '@/data/mock-courses.json';

// 이 라우트를 동적으로 설정
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createPureClient();

    // 데이터베이스 연결 테스트
    console.log('🔍 Supabase 클라이언트 생성 완료');
    console.log('🔍 환경 변수 확인:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    // 간단한 연결 테스트
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ 데이터베이스 연결 테스트 실패:', testError);
      console.error('📋 오류 상세:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
      });
    } else {
      console.log('✅ 데이터베이스 연결 성공');
      console.log('📋 테스트 데이터:', testData);
    }

    // 단계별 쿼리 테스트
    console.log('🔍 1단계: 기본 코스 데이터 조회');
    const { data: basicCourses, error: basicError } = await supabase
      .from('courses')
      .select('id, title, description')
      .limit(3);

    if (basicError) {
      console.error('❌ 기본 코스 조회 실패:', basicError);
    } else {
      console.log('✅ 기본 코스 조회 성공:', basicCourses?.length || 0, '개');
    }

    console.log('🔍 2단계: 카테고리 조인 테스트');
    const { data: categoryTest, error: categoryError } = await supabase
      .from('courses')
      .select('id, title, course_categories(name)')
      .limit(3);

    if (categoryError) {
      console.error('❌ 카테고리 조인 실패:', categoryError);
    } else {
      console.log('✅ 카테고리 조인 성공:', categoryTest?.length || 0, '개');
    }

    // Supabase에서 코스 데이터 조회 (카테고리, 위치, 루트 정보 포함)
    const { data: courses, error } = await supabase
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
        course_categories(name),
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
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 메인 쿼리 오류 발생:', error);
      console.error('📋 오류 상세:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      console.log(
        '📋 조인 문제일 가능성이 높습니다. course_categories 테이블을 확인해주세요.'
      );

      // PGRST205 오류는 테이블이 없음을 의미
      if (error.code === 'PGRST205') {
        console.error(
          '⚠️ 테이블이 존재하지 않습니다. 마이그레이션을 적용해주세요.'
        );
        console.error('📋 마이그레이션 가이드: QUICK_MIGRATION_GUIDE.md 참고');
        // 마이그레이션 미적용 시 목업 데이터 사용
        return NextResponse.json(mockCourses);
      }

      // 42703 오류는 컬럼이 없음을 의미
      if (error.code === '42703') {
        console.error('⚠️ 컬럼이 존재하지 않습니다. 스키마를 확인해주세요.');
        console.error('📋 오류 상세:', error.message);
        // 스키마 오류 시 목업 데이터 사용
        return NextResponse.json(mockCourses);
      }

      // 기타 Supabase 오류 시 목업 데이터로 fallback
      console.error('⚠️ Supabase 연결 오류로 목업 데이터를 사용합니다.');
      return NextResponse.json(mockCourses);
    }

    if (!courses || courses.length === 0) {
      console.log(
        '📋 데이터베이스에서 코스 데이터를 찾을 수 없습니다. 마이그레이션을 확인해주세요.'
      );
      console.log(
        '📋 필요한 마이그레이션: 20241219_001_initial_schema.sql, 20241219_002_sample_data.sql'
      );

      // 테이블 존재 여부 확인
      console.log('📋 테이블 존재 여부를 확인합니다...');

      // courses 테이블 확인
      const { data: coursesCheck, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .limit(1);

      if (coursesError) {
        console.error('❌ courses 테이블 확인 실패:', coursesError);
      } else {
        console.log(
          '✅ courses 테이블 존재, 데이터 수:',
          coursesCheck?.length || 0
        );
      }

      // locations 테이블 확인
      const { data: locationsCheck, error: locationsError } = await supabase
        .from('locations')
        .select('id')
        .limit(1);

      if (locationsError) {
        console.error('❌ locations 테이블 확인 실패:', locationsError);
      } else {
        console.log(
          '✅ locations 테이블 존재, 데이터 수:',
          locationsCheck?.length || 0
        );
      }

      // course_categories 테이블 확인
      const { data: categoriesCheck, error: categoriesError } = await supabase
        .from('course_categories')
        .select('id, name')
        .limit(3);

      if (categoriesError) {
        console.error(
          '❌ course_categories 테이블 확인 실패:',
          categoriesError
        );
        console.log('📋 이 테이블이 없어서 조인이 실패할 수 있습니다.');
      } else {
        console.log(
          '✅ course_categories 테이블 존재, 데이터 수:',
          categoriesCheck?.length || 0
        );
        console.log('📋 카테고리 데이터:', categoriesCheck);
      }

      // 데이터베이스에 데이터가 없을 때 목업 데이터 사용
      console.log('🔍 현재 환경:', process.env.NODE_ENV);
      console.log(
        '📋 데이터베이스에 코스 데이터가 없습니다. 마이그레이션을 실행해주세요.'
      );
      console.log('📋 임시로 목업 데이터를 사용합니다.');

      // 임시로 목업 데이터 사용 (마이그레이션 완료 후 제거 예정)
      return NextResponse.json(mockCourses);

      return NextResponse.json(
        {
          error: 'No courses found in database. Please run migrations first.',
          hint: 'Run migrations: 20241219_001_initial_schema.sql, 20241219_002_sample_data.sql',
        },
        { status: 404 }
      );
    }

    // 데이터베이스 결과를 프론트엔드 형식으로 변환
    const transformedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: `${Math.floor(course.duration_minutes / 60)}시간 ${
        course.duration_minutes % 60
      }분`,
      difficulty:
        course.difficulty === 'easy'
          ? '쉬움'
          : course.difficulty === 'medium'
          ? '보통'
          : '어려움',
      rating: 4.5, // 기본 평점 (실제로는 별도 테이블에서 계산)
      reviewCount: Math.floor(Math.random() * 200) + 50, // 임시 리뷰 수
      image: course.image_url,
      category: course.course_categories?.name || '기타',
      isFeatured: course.is_featured,
      distance: course.distance_km,
      cost: course.estimated_cost,
      locations:
        course.course_locations?.map((cl: any) => ({
          id: cl.locations?.id || '',
          name: cl.locations?.name || '',
          description: cl.locations?.description || '',
          coordinates: {
            lat: cl.locations?.coordinates?.y || 0,
            lng: cl.locations?.coordinates?.x || 0,
          },
          qrCode: cl.locations?.qr_code || '',
          image: cl.locations?.image_url || '',
          stampImage: cl.locations?.stamp_image_url || '',
          visitDuration: cl.locations?.visit_duration_minutes || 0,
          address: cl.locations?.address || '',
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
    }));

    return NextResponse.json({ courses: transformedCourses });
  } catch (error) {
    console.error('API error:', error);
    // 모든 오류 시 목업 데이터로 fallback
    return NextResponse.json(mockCourses);
  }
}
