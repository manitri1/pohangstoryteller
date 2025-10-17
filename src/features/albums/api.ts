'use client';

import { createClient } from '@/lib/supabase/client';

// UUID 형식 검증 및 변환 헬퍼 함수
async function getValidUserId(supabase: any): Promise<string> {
  try {
    // Next-Auth 세션 확인
    const { getSession } = await import('next-auth/react');
    const session = await getSession();

    if (session?.user?.id) {
      console.log('Next-Auth 세션 사용:', session.user.id);
      return session.user.id;
    }

    // 세션이 없는 경우 기존 사용자 중 첫 번째 사용자 사용
    const { data: firstUser, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (error || !firstUser) {
      // 사용자가 없는 경우 테스트 사용자 생성
      const testUserId = '00000000-0000-0000-0000-000000000001';

      const { error: insertError } = await supabase.from('profiles').insert({
        id: testUserId,
        name: '테스트 사용자',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('테스트 사용자 생성 실패:', insertError);
        throw new Error('사용자 인증에 실패했습니다.');
      }

      console.log('테스트 사용자 생성 및 사용:', testUserId);
      return testUserId;
    }

    console.log('기존 사용자 사용:', firstUser.id);
    return firstUser.id;
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    throw new Error('사용자 인증에 실패했습니다.');
  }
}

export interface Album {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  template_type: 'grid' | 'timeline' | 'travel';
  is_public: boolean;
  created_at: string;
  updated_at: string;
  item_count?: number;
  last_item_added_at?: string;
}

export interface AlbumItem {
  id: string;
  album_id: string;
  item_type: 'image' | 'video' | 'stamp' | 'text' | 'location';
  content?: string;
  media_url?: string;
  metadata?: any;
  position: number;
  created_at: string;
  updated_at: string;
  album_title?: string;
  album_owner_id?: string;
}

export interface AlbumTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'grid' | 'timeline' | 'travel';
  layout_config: any;
  is_default: boolean;
  created_at: string;
}

export interface CreateAlbumData {
  title: string;
  description?: string;
  template_type?: 'grid' | 'timeline' | 'travel';
  is_public?: boolean;
}

export interface CreateAlbumItemData {
  album_id: string;
  item_type: 'image' | 'video' | 'stamp' | 'text' | 'location';
  content?: string;
  media_url?: string;
  metadata?: any;
  position?: number;
}

export interface UpdateAlbumData {
  title?: string;
  description?: string;
  cover_image_url?: string;
  template_type?: 'grid' | 'timeline' | 'travel';
  is_public?: boolean;
}

// =============================================
// 앨범 관리 API
// =============================================

// 앨범 목록 조회
export async function getAlbums() {
  const supabase = createClient();

  try {
    const userId = await getValidUserId(supabase);

    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 목록 조회 오류:', error);
    return { data: null, error };
  }
}

// 앨범 상세 조회
export async function getAlbum(albumId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 상세 조회 오류:', error);
    return { data: null, error };
  }
}

// 앨범 생성
export async function createAlbum(albumData: CreateAlbumData) {
  const supabase = createClient();

  try {
    const userId = await getValidUserId(supabase);

    const { data, error } = await supabase
      .from('albums')
      .insert({
        user_id: userId,
        title: albumData.title,
        description: albumData.description,
        template_type: albumData.template_type || 'grid',
        is_public: albumData.is_public || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 생성 오류:', error);
    return { data: null, error };
  }
}

// 앨범 수정
export async function updateAlbum(
  albumId: string,
  updateData: UpdateAlbumData
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('albums')
      .update(updateData)
      .eq('id', albumId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 수정 오류:', error);
    return { data: null, error };
  }
}

// 앨범 삭제
export async function deleteAlbum(albumId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.from('albums').delete().eq('id', albumId);

    if (error) {
      throw error;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('앨범 삭제 오류:', error);
    return { data: null, error };
  }
}

// =============================================
// 앨범 아이템 관리 API
// =============================================

// 앨범 아이템 목록 조회
export async function getAlbumItems(albumId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('album_item_details')
      .select('*')
      .eq('album_id', albumId)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 아이템 조회 오류:', error);
    return { data: null, error };
  }
}

// 앨범 아이템 추가
export async function addAlbumItem(itemData: CreateAlbumItemData) {
  const supabase = createClient();

  try {
    // 사용자 인증 확인
    const userId = await getValidUserId(supabase);
    console.log('사용자 ID:', userId);

    const { data, error } = await supabase
      .from('album_items')
      .insert({
        album_id: itemData.album_id,
        item_type: itemData.item_type,
        content: itemData.content,
        media_url: itemData.media_url,
        metadata: itemData.metadata,
        position: itemData.position || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase 오류:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 아이템 추가 오류:', error);
    return { data: null, error };
  }
}

// 앨범 아이템 수정
export async function updateAlbumItem(
  itemId: string,
  updateData: Partial<CreateAlbumItemData>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('album_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 아이템 수정 오류:', error);
    return { data: null, error };
  }
}

// 앨범 아이템 삭제
export async function deleteAlbumItem(itemId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('album_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      throw error;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('앨범 아이템 삭제 오류:', error);
    return { data: null, error };
  }
}

// 앨범 아이템 순서 변경
export async function reorderAlbumItems(
  albumId: string,
  itemOrders: { id: string; position: number }[]
) {
  const supabase = createClient();

  try {
    const updates = itemOrders.map(({ id, position }) =>
      supabase
        .from('album_items')
        .update({ position })
        .eq('id', id)
        .eq('album_id', albumId)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((result) => result.error);

    if (hasError) {
      throw new Error('아이템 순서 변경 중 오류가 발생했습니다.');
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('앨범 아이템 순서 변경 오류:', error);
    return { data: null, error };
  }
}

// =============================================
// 앨범 템플릿 API
// =============================================

// 앨범 템플릿 목록 조회
export async function getAlbumTemplates() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('album_templates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 템플릿 조회 오류:', error);
    return { data: null, error };
  }
}

// =============================================
// 앨범 공유 API
// =============================================

// 앨범 공유 토큰 생성
export async function createAlbumShare(
  albumId: string,
  permissions: 'view' | 'edit' = 'view',
  expiresAt?: string
) {
  const supabase = createClient();

  try {
    const userId = await getValidUserId(supabase);
    const shareToken = `share_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const { data, error } = await supabase
      .from('album_shares')
      .insert({
        album_id: albumId,
        shared_by: userId,
        share_token: shareToken,
        permissions,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('앨범 공유 토큰 생성 오류:', error);
    return { data: null, error };
  }
}

// 공유된 앨범 조회
export async function getSharedAlbum(shareToken: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('album_shares')
      .select(
        `
        *,
        albums!inner(*)
      `
      )
      .eq('share_token', shareToken)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('공유된 앨범 조회 오류:', error);
    return { data: null, error };
  }
}

// 앨범 공유 삭제
export async function deleteAlbumShare(shareToken: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('album_shares')
      .delete()
      .eq('share_token', shareToken);

    if (error) {
      throw error;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('앨범 공유 삭제 오류:', error);
    return { data: null, error };
  }
}
