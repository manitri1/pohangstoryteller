import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116은 "no rows returned" 에러
      console.error('이메일 확인 중 오류:', error);
      return NextResponse.json(
        { error: '이메일 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!existingUser,
      message: existingUser
        ? '이미 가입된 이메일입니다.'
        : '사용 가능한 이메일입니다.',
    });
  } catch (error) {
    console.error('이메일 확인 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
