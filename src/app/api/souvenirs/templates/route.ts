import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 템플릿 조회
    const { data: templates, error: templatesError } = await supabase
      .from('souvenir_templates')
      .select(
        `
        id,
        name,
        description,
        template_type,
        category,
        preview_image_url,
        base_price,
        template_config,
        created_at,
        updated_at
      `
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (templatesError) {
      console.error('템플릿 조회 오류:', templatesError);
      return NextResponse.json(
        { error: '템플릿 데이터를 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 각 템플릿의 통계 정보 조회
    const templatesWithStats = await Promise.all(
      (templates || []).map(async (template) => {
        // 프로젝트 수 조회
        const { count: projectCount } = await supabase
          .from('souvenir_projects')
          .select('*', { count: 'exact', head: true })
          .eq('template_id', template.id);

        // 주문 수 조회
        const { count: orderCount } = await supabase
          .from('souvenir_orders')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', template.id);

        // 평점 조회
        const { data: reviews } = await supabase
          .from('souvenir_reviews')
          .select('rating')
          .eq('order_id', template.id);

        const averageRating =
          reviews && reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

        return {
          id: template.id,
          name: template.name,
          description: template.description,
          templateType: template.template_type,
          category: template.category,
          previewImageUrl: template.preview_image_url,
          basePrice: template.base_price,
          projectCount: projectCount || 0,
          orderCount: orderCount || 0,
          averageRating,
          reviewCount: reviews?.length || 0,
          templateConfig: template.template_config,
          createdAt: template.created_at,
          updatedAt: template.updated_at,
        };
      })
    );

    // 전체 통계 조회
    const { count: totalTemplates } = await supabase
      .from('souvenir_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: totalProjects } = await supabase
      .from('souvenir_projects')
      .select('*', { count: 'exact', head: true });

    const { count: totalOrders } = await supabase
      .from('souvenir_orders')
      .select('*', { count: 'exact', head: true });

    const { data: revenueData } = await supabase
      .from('souvenir_orders')
      .select('final_amount')
      .eq('status', 'delivered');

    const totalRevenue =
      revenueData?.reduce((sum, order) => sum + order.final_amount, 0) || 0;

    return NextResponse.json({
      templates: templatesWithStats,
      stats: {
        totalTemplates: totalTemplates || 0,
        totalProjects: totalProjects || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
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
    const {
      name,
      description,
      templateType,
      category,
      templateConfig,
      basePrice,
      previewImageUrl,
    } = body;

    if (!name || !templateType) {
      return NextResponse.json(
        { error: '템플릿 이름과 타입이 필요합니다.' },
        { status: 400 }
      );
    }

    // 템플릿 생성
    const { data: newTemplate, error: templateError } = await supabase
      .from('souvenir_templates')
      .insert({
        name,
        description,
        template_type: templateType,
        category: category || 'general',
        template_config: templateConfig || {},
        base_price: basePrice || 0,
        preview_image_url: previewImageUrl,
      })
      .select()
      .single();

    if (templateError) {
      console.error('템플릿 생성 오류:', templateError);
      return NextResponse.json(
        { error: '템플릿 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      template: {
        id: newTemplate.id,
        name: newTemplate.name,
        description: newTemplate.description,
        templateType: newTemplate.template_type,
        category: newTemplate.category,
        basePrice: newTemplate.base_price,
        templateConfig: newTemplate.template_config,
        createdAt: newTemplate.created_at,
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
