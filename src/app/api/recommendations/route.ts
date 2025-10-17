import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      interests = [],
      duration,
      companion,
      difficulty,
      limit = 10,
    } = body;

    const supabase = await createClient();

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

    // 사용자 선호도 저장/업데이트
    const { error: prefError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        interests,
        preferred_duration: duration,
        companion_type: companion,
        preferred_difficulty: difficulty,
        updated_at: new Date().toISOString(),
      });

    if (prefError) {
      console.error('선호도 저장 오류:', prefError);
    }

    // 추천 알고리즘 실행
    const { data: recommendations, error: recError } = await supabase.rpc(
      'get_hybrid_recommendations',
      {
        target_user_id: user.id,
        limit_count: limit,
      }
    );

    if (recError) {
      console.error('추천 알고리즘 오류:', recError);

      // 추천 실패 시 기본 추천 로직
      const { data: fallbackCourses, error: fallbackError } = await supabase
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
          rating,
          review_count,
          tags,
          target_audience,
          activity_level
        `
        )
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        return NextResponse.json(
          { error: '추천 시스템 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        recommendations:
          fallbackCourses?.map((course) => ({
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
            distance: course.distance_km,
            cost: course.estimated_cost,
            image: course.image_url,
            rating: course.rating,
            reviewCount: course.review_count,
            tags: course.tags,
            targetAudience: course.target_audience,
            activityLevel: course.activity_level,
            recommendationScore: 0.5, // 기본 점수
            recommendationReason: '인기 코스 추천',
          })) || [],
      });
    }

    // 추천된 코스의 상세 정보 조회
    const courseIds = recommendations?.map((rec) => rec.course_id) || [];

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
      });
    }

    const { data: courses, error: coursesError } = await supabase
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
        rating,
        review_count,
        tags,
        target_audience,
        activity_level,
        course_categories(name)
      `
      )
      .in('id', courseIds)
      .eq('is_active', true);

    if (coursesError) {
      return NextResponse.json(
        { error: '코스 정보 조회 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 추천 결과와 코스 정보 매핑
    const mappedRecommendations =
      recommendations
        ?.map((rec) => {
          const course = courses?.find((c) => c.id === rec.course_id);
          if (!course) return null;

          return {
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
            distance: course.distance_km,
            cost: course.estimated_cost,
            image: course.image_url,
            rating: course.rating,
            reviewCount: course.review_count,
            tags: course.tags,
            targetAudience: course.target_audience,
            activityLevel: course.activity_level,
            category: course.course_categories?.[0]?.name || '기타',
            recommendationScore: rec.recommendation_score,
            recommendationReason: rec.recommendation_reason,
          };
        })
        .filter(Boolean) || [];

    // 추천 로그 저장
    const recommendationLogs = mappedRecommendations.map((rec) => ({
      user_id: user.id,
      course_id: rec.id,
      recommendation_algorithm: 'hybrid',
      recommendation_score: rec.recommendationScore,
      recommendation_reason: rec.recommendationReason,
    }));

    await supabase.from('course_recommendations').insert(recommendationLogs);

    return NextResponse.json({
      success: true,
      recommendations: mappedRecommendations,
    });
  } catch (error) {
    console.error('추천 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 추천 결과 클릭 추적
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, action } = body;

    const supabase = await createClient();

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

    // 상호작용 기록 저장
    const { error: interactionError } = await supabase
      .from('user_course_interactions')
      .insert({
        user_id: user.id,
        course_id: courseId,
        interaction_type: action,
        interaction_data: {
          timestamp: new Date().toISOString(),
          source: 'recommendation',
        },
      });

    if (interactionError) {
      console.error('상호작용 기록 오류:', interactionError);
    }

    // 추천 로그 업데이트 (클릭된 경우)
    if (action === 'view' || action === 'start') {
      await supabase
        .from('course_recommendations')
        .update({ is_clicked: true })
        .eq('user_id', user.id)
        .eq('course_id', courseId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('상호작용 추적 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
