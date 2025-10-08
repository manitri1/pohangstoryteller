import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 간단한 테이블 존재 확인
    const { data, error } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205') {
        return NextResponse.json({
          status: 'migration_required',
          message: '마이그레이션이 필요합니다.',
          error: error.message,
          guide: 'QUICK_MIGRATION_GUIDE.md 참고',
        });
      }

      return NextResponse.json({
        status: 'database_error',
        message: '데이터베이스 연결 오류',
        error: error.message,
      });
    }

    return NextResponse.json({
      status: 'healthy',
      message: '데이터베이스 연결 정상',
      dataCount: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: '서버 오류',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
