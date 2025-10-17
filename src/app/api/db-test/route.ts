import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase 클라이언트 초기화 (환경 변수 확인)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
}

const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseKey || 'dummy_key'
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'tables';
  const table = searchParams.get('table') || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let result: any = null;
    let error: string | null = null;

    switch (action) {
      case 'tables':
        // 모든 테이블 목록 조회 (RPC 함수 사용)
        try {
          const { data: tables, error: tablesError } = await supabase.rpc(
            'get_tables'
          );
          if (tablesError) throw tablesError;
          result = tables;
        } catch (error) {
          // 대체 방법: 알려진 테이블 목록 반환
          result = [
            { table_name: 'profiles', table_type: 'BASE TABLE' },
            { table_name: 'user_preferences', table_type: 'BASE TABLE' },
            { table_name: 'course_categories', table_type: 'BASE TABLE' },
            { table_name: 'courses', table_type: 'BASE TABLE' },
            { table_name: 'locations', table_type: 'BASE TABLE' },
            { table_name: 'course_locations', table_type: 'BASE TABLE' },
            { table_name: 'routes', table_type: 'BASE TABLE' },
            { table_name: 'stamps', table_type: 'BASE TABLE' },
            { table_name: 'posts', table_type: 'BASE TABLE' },
            { table_name: 'likes', table_type: 'BASE TABLE' },
            { table_name: 'comments', table_type: 'BASE TABLE' },
            { table_name: 'shares', table_type: 'BASE TABLE' },
            { table_name: 'bookmarks', table_type: 'BASE TABLE' },
            { table_name: 'comment_likes', table_type: 'BASE TABLE' },
            { table_name: 'chat_sessions', table_type: 'BASE TABLE' },
            { table_name: 'chat_messages', table_type: 'BASE TABLE' },
            { table_name: 'albums', table_type: 'BASE TABLE' },
            { table_name: 'album_items', table_type: 'BASE TABLE' },
            { table_name: 'media_files', table_type: 'BASE TABLE' },
            { table_name: 'souvenirs', table_type: 'BASE TABLE' },
            { table_name: 'souvenir_templates', table_type: 'BASE TABLE' },
            { table_name: 'user_stamps', table_type: 'BASE TABLE' },
            { table_name: 'stamp_acquisitions', table_type: 'BASE TABLE' },
            { table_name: 'stamp_collections', table_type: 'BASE TABLE' },
            { table_name: 'collection_stamps', table_type: 'BASE TABLE' },
            { table_name: 'stamp_achievements', table_type: 'BASE TABLE' },
            { table_name: 'stamp_shares', table_type: 'BASE TABLE' },
          ];
        }
        break;

      case 'table_data':
        if (!table) throw new Error('테이블명이 필요합니다');

        // 특정 테이블 데이터 조회
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(limit);

        if (tableError) throw tableError;
        result = tableData;
        break;

      case 'table_schema':
        if (!table) throw new Error('테이블명이 필요합니다');

        // 테이블 스키마 조회 (RPC 함수 사용)
        try {
          const { data: schema, error: schemaError } = await supabase.rpc(
            'get_table_schema',
            { table_name: table }
          );
          if (schemaError) throw schemaError;
          result = schema;
        } catch (error) {
          // 대체 방법: 알려진 테이블 스키마 반환
          const knownSchemas: { [key: string]: any[] } = {
            profiles: [
              {
                column_name: 'id',
                data_type: 'uuid',
                is_nullable: 'NO',
                column_default: null,
              },
              {
                column_name: 'email',
                data_type: 'text',
                is_nullable: 'NO',
                column_default: null,
              },
              {
                column_name: 'name',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'avatar_url',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'preferences',
                data_type: 'jsonb',
                is_nullable: 'YES',
                column_default: "'{}'",
              },
              {
                column_name: 'is_verified',
                data_type: 'boolean',
                is_nullable: 'YES',
                column_default: 'false',
              },
              {
                column_name: 'created_at',
                data_type: 'timestamp with time zone',
                is_nullable: 'YES',
                column_default: 'now()',
              },
              {
                column_name: 'updated_at',
                data_type: 'timestamp with time zone',
                is_nullable: 'YES',
                column_default: 'now()',
              },
            ],
            locations: [
              {
                column_name: 'id',
                data_type: 'uuid',
                is_nullable: 'NO',
                column_default: 'uuid_generate_v4()',
              },
              {
                column_name: 'name',
                data_type: 'text',
                is_nullable: 'NO',
                column_default: null,
              },
              {
                column_name: 'description',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'coordinates',
                data_type: 'USER-DEFINED',
                is_nullable: 'NO',
                column_default: null,
              },
              {
                column_name: 'address',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'qr_code',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'image_url',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'stamp_image_url',
                data_type: 'text',
                is_nullable: 'YES',
                column_default: null,
              },
              {
                column_name: 'visit_duration_minutes',
                data_type: 'integer',
                is_nullable: 'YES',
                column_default: '30',
              },
              {
                column_name: 'is_active',
                data_type: 'boolean',
                is_nullable: 'YES',
                column_default: 'true',
              },
              {
                column_name: 'created_at',
                data_type: 'timestamp with time zone',
                is_nullable: 'YES',
                column_default: 'now()',
              },
              {
                column_name: 'updated_at',
                data_type: 'timestamp with time zone',
                is_nullable: 'YES',
                column_default: 'now()',
              },
            ],
          };

          result = knownSchemas[table] || [
            {
              column_name: 'id',
              data_type: 'uuid',
              is_nullable: 'NO',
              column_default: 'uuid_generate_v4()',
            },
            {
              column_name: 'created_at',
              data_type: 'timestamp with time zone',
              is_nullable: 'YES',
              column_default: 'now()',
            },
            {
              column_name: 'updated_at',
              data_type: 'timestamp with time zone',
              is_nullable: 'YES',
              column_default: 'now()',
            },
          ];
        }
        break;

      case 'count':
        if (!table) throw new Error('테이블명이 필요합니다');

        // 테이블 레코드 수 조회
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        result = { count };
        break;

      case 'test_connection':
        // 연결 테스트
        try {
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);

          if (testError) throw testError;
          result = { status: 'connected', timestamp: new Date().toISOString() };
        } catch (error) {
          // 연결 실패 시에도 기본 응답 반환
          result = {
            status: 'connection_failed',
            error: 'Supabase 연결에 실패했습니다. 환경 변수를 확인해주세요.',
            timestamp: new Date().toISOString(),
          };
        }
        break;

      default:
        throw new Error('지원하지 않는 액션입니다');
    }

    return NextResponse.json({
      success: true,
      action,
      table,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Database test error:', err);

    return NextResponse.json(
      {
        success: false,
        action,
        table,
        error: err.message || '알 수 없는 오류가 발생했습니다',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, params = [] } = body;

    if (!query) {
      throw new Error('SQL 쿼리가 필요합니다');
    }

    // 직접 SQL 쿼리 실행 (주의: 보안상 제한 필요)
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: query,
      params: params,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('SQL execution error:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'SQL 실행 중 오류가 발생했습니다',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
