'use client';

import { createClient } from '@/lib/supabase/client';

// UUID 형식 검증 및 변환 헬퍼 함수
async function getValidUserId(supabase: any): Promise<string> {
  // 임시로 고정된 테스트 사용자 ID 사용
  const testUserId = '00000000-0000-0000-0000-000000000001';

  console.log('테스트 사용자 ID 사용:', testUserId);
  return testUserId;
}

export interface CreatePostData {
  content: string;
  media_urls?: string[];
  hashtags?: string[];
  location_data?: {
    name: string;
    coordinates: [number, number];
  };
  mood?: string;
  is_public?: boolean;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_id?: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  media_urls: string[];
  hashtags: string[];
  location_data: any;
  mood: string;
  is_public: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// 게시물 생성
export async function createPost(postData: CreatePostData) {
  const supabase = createClient();

  try {
    console.log('createPost 시작:', postData);

    // Supabase 연결 확인
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      'Supabase Anon Key:',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음'
    );

    // Next-Auth 세션 확인
    const { getSession } = await import('next-auth/react');
    const session = await getSession();

    console.log('Next-Auth 세션:', session);

    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다. Next-Auth 세션이 없습니다.');
    }

    // UUID 형식 검증 및 변환
    let userId: string;
    try {
      // Next-Auth ID가 UUID 형식인지 확인
      if (
        session.user.id.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        userId = session.user.id;
      } else {
        // 숫자 ID인 경우 UUID로 변환 (임시 해결책)
        console.warn('Next-Auth ID가 UUID 형식이 아닙니다:', session.user.id);
        // 임시로 첫 번째 사용자 ID 사용
        const { data: firstUser } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
          .single();

        if (!firstUser) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }
        userId = firstUser.id;
      }
    } catch (error) {
      console.error('사용자 ID 처리 오류:', error);
      throw new Error('사용자 인증에 실패했습니다.');
    }

    console.log('게시글 삽입 시작:', {
      author_id: userId,
      content: postData.content,
      media_urls: postData.media_urls || [],
      hashtags: postData.hashtags || [],
      location_data: postData.location_data,
      mood: postData.mood,
      is_public: postData.is_public ?? true,
    });

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: userId,
        content: postData.content,
        media_urls: postData.media_urls || [],
        hashtags: postData.hashtags || [],
        location_data: postData.location_data,
        mood: postData.mood,
        is_public: postData.is_public ?? true,
      })
      .select()
      .single();

    console.log('게시글 삽입 결과:', { data, error });

    if (error) {
      console.error('데이터베이스 오류:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('게시물 생성 오류:', error);
    return { data: null, error };
  }
}

// 게시물 목록 조회
export async function getPosts(limit = 20, offset = 0) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(id, name, avatar, verified)
      `
      )
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    return { data: null, error };
  }
}

// 게시물 상세 조회
export async function getPost(postId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:profiles(id, name, avatar, verified)
      `
      )
      .eq('id', postId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('게시물 상세 조회 오류:', error);
    return { data: null, error };
  }
}

// 게시물 수정
export async function updatePost(
  postId: string,
  postData: Partial<CreatePostData>
) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('author_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('게시물 수정 오류:', error);
    return { data: null, error };
  }
}

// 게시물 삭제
export async function deletePost(postId: string) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id);

    if (error) {
      throw error;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    return { data: null, error };
  }
}

// 게시물 좋아요
export async function likePost(postId: string) {
  const supabase = createClient();

  try {
    // 유효한 사용자 ID 가져오기
    const userId = await getValidUserId(supabase);

    // 좋아요 추가
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 게시물 좋아요 수 증가
    await supabase.rpc('increment_like_count', { post_id: postId });

    return { data, error: null };
  } catch (error) {
    console.error('좋아요 오류:', error);
    return { data: null, error };
  }
}

// 게시물 좋아요 취소
export async function unlikePost(postId: string) {
  const supabase = createClient();

  try {
    // 유효한 사용자 ID 가져오기
    const userId = await getValidUserId(supabase);

    // 좋아요 삭제
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      throw error;
    }

    // 게시물 좋아요 수 감소
    await supabase.rpc('decrement_like_count', { post_id: postId });

    return { data: true, error: null };
  } catch (error) {
    console.error('좋아요 취소 오류:', error);
    return { data: null, error };
  }
}

// 게시물 북마크
export async function bookmarkPost(postId: string) {
  const supabase = createClient();

  try {
    // 유효한 사용자 ID 가져오기
    const userId = await getValidUserId(supabase);

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 게시물 북마크 수 증가
    await supabase.rpc('increment_bookmark_count', { post_id: postId });

    return { data, error: null };
  } catch (error) {
    console.error('북마크 오류:', error);
    return { data: null, error };
  }
}

// 게시물 북마크 취소
export async function unbookmarkPost(postId: string) {
  const supabase = createClient();

  try {
    // 유효한 사용자 ID 가져오기
    const userId = await getValidUserId(supabase);

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      throw error;
    }

    // 게시물 북마크 수 감소
    await supabase.rpc('decrement_bookmark_count', { post_id: postId });

    return { data: true, error: null };
  } catch (error) {
    console.error('북마크 취소 오류:', error);
    return { data: null, error };
  }
}

// 댓글 생성
export async function createComment(commentData: CreateCommentData) {
  const supabase = createClient();

  try {
    // 유효한 사용자 ID 가져오기
    const userId = await getValidUserId(supabase);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: commentData.post_id,
        author_id: userId,
        content: commentData.content,
        parent_id: commentData.parent_id,
      })
      .select(
        `
        *,
        profiles!author_id(id, name, avatar_url)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    // 게시물의 댓글 수 증가
    await supabase.rpc('increment_comment_count', {
      post_id: commentData.post_id,
    });

    return { data, error: null };
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    return { data: null, error };
  }
}

// 댓글 목록 조회
export async function getComments(postId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        profiles!author_id(id, name, avatar_url)
      `
      )
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return { data: null, error };
  }
}

// 좋아요 토글
export async function toggleLike(postId: string) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 기존 좋아요 확인
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // 좋아요 취소
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // 게시물 좋아요 수 감소
      await supabase.rpc('decrement_like_count', {
        post_id: postId,
      });

      return { data: { liked: false }, error: null };
    } else {
      // 좋아요 추가
      const { error } = await supabase.from('likes').insert({
        post_id: postId,
        user_id: user.id,
      });

      if (error) throw error;

      // 게시물 좋아요 수 증가
      await supabase.rpc('increment_like_count', {
        post_id: postId,
      });

      return { data: { liked: true }, error: null };
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return { data: null, error };
  }
}

// 좋아요 상태 확인
export async function getLikeStatus(postId: string) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: { liked: false }, error: null };
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { data: { liked: !!data }, error: null };
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
    return { data: null, error };
  }
}

// 공유 추가
export async function addShare(
  postId: string,
  platform: string,
  shareUrl?: string
) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('shares')
      .insert({
        post_id: postId,
        user_id: user.id,
        platform,
        share_url: shareUrl,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 게시물 공유 수 증가
    await supabase.rpc('increment_share_count', {
      post_id: postId,
    });

    return { data, error: null };
  } catch (error) {
    console.error('공유 추가 오류:', error);
    return { data: null, error };
  }
}

// 커뮤니티 통계 조회
export async function getCommunityStats() {
  const supabase = createClient();

  try {
    const [
      { count: totalPosts },
      { count: totalUsers },
      { data: likesData },
      { data: commentsData },
    ] = await Promise.all([
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*'),
      supabase.from('comments').select('*'),
    ]);

    const totalLikes = likesData?.length || 0;
    const totalComments = commentsData?.length || 0;

    // 인기 해시태그 조회
    const { data: hashtagsData } = await supabase
      .from('posts')
      .select('hashtags')
      .eq('is_public', true);

    const allHashtags =
      hashtagsData?.flatMap((post) => post.hashtags || []) || [];
    const hashtagCounts = allHashtags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const trendingTags = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag]) => tag);

    return {
      data: {
        totalPosts: totalPosts || 0,
        totalUsers: totalUsers || 0,
        totalLikes,
        totalComments,
        trendingTags,
      },
      error: null,
    };
  } catch (error) {
    console.error('통계 조회 오류:', error);
    return { data: null, error };
  }
}
