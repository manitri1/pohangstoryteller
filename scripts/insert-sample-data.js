const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 생성
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_role_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// 샘플 사용자 데이터
const sampleUsers = [
  {
    id: 'user-1',
    name: '포항여행러',
    avatar: 'https://picsum.photos/100/100?random=1',
    verified: true,
  },
  {
    id: 'user-2',
    name: '포항맛집탐방',
    avatar: 'https://picsum.photos/100/100?random=2',
    verified: false,
  },
  {
    id: 'user-3',
    name: '포항역사탐방',
    avatar: 'https://picsum.photos/100/100?random=3',
    verified: true,
  },
  {
    id: 'user-4',
    name: '포항사진작가',
    avatar: 'https://picsum.photos/100/100?random=4',
    verified: false,
  },
  {
    id: 'user-5',
    name: '포항가족여행',
    avatar: 'https://picsum.photos/100/100?random=5',
    verified: false,
  },
];

// 샘플 게시물 데이터
const samplePosts = [
  {
    author_id: 'user-1',
    content:
      '포항 영일대 해수욕장에서의 아름다운 일출을 담았습니다! 🌅\n\n새벽 5시에 일어나서 해변으로 향했는데, 정말 값진 경험이었어요. 포항의 바다는 정말 아름답네요!',
    media_urls: [
      'https://picsum.photos/800/600?random=10',
      'https://picsum.photos/800/600?random=11',
    ],
    hashtags: ['일출', '해변', '포항', '자연', '영일대'],
    location_data: {
      name: '영일대 해수욕장',
      coordinates: [129.3656, 36.0194],
    },
    mood: 'peaceful',
    is_public: true,
  },
  {
    author_id: 'user-2',
    content:
      '포항 대표 맛집들을 돌아다니며 맛본 음식들! 🍽️\n\n특히 포항의 대표 음식인 과메기를 처음 먹어봤는데, 정말 맛있었어요. 다음에 또 와야겠습니다!',
    media_urls: [
      'https://picsum.photos/800/600?random=12',
      'https://picsum.photos/800/600?random=13',
      'https://picsum.photos/800/600?random=14',
    ],
    hashtags: ['맛집', '과메기', '포항', '음식', '여행'],
    location_data: {
      name: '포항 시내',
      coordinates: [129.3656, 36.0194],
    },
    mood: 'happy',
    is_public: true,
  },
  {
    author_id: 'user-3',
    content:
      '포항의 역사적 의미를 담은 장소들을 둘러보았습니다.\n\n포항의 발전 과정과 역사를 알 수 있는 좋은 기회였어요. 특히 포항제철소의 역사는 정말 인상적이었습니다.',
    media_urls: [],
    hashtags: ['역사', '포항제철소', '문화', '교육', '탐방'],
    location_data: {
      name: '포항제철소',
      coordinates: [129.3656, 36.0194],
    },
    mood: 'amazed',
    is_public: true,
  },
  {
    author_id: 'user-4',
    content:
      '포항의 숨겨진 보석 같은 카페를 발견했습니다! ☕\n\n조용하고 아늑한 분위기에서 포항의 일상을 느낄 수 있어서 정말 좋았어요. 커피도 맛있고 분위기도 최고!',
    media_urls: ['https://picsum.photos/800/600?random=15'],
    hashtags: ['카페', '포항', '일상', '휴식', '커피'],
    location_data: {
      name: '포항 시내 카페',
      coordinates: [129.3656, 36.0194],
    },
    mood: 'relaxed',
    is_public: true,
  },
  {
    author_id: 'user-5',
    content:
      '가족과 함께 포항 여행을 다녀왔습니다! 👨‍👩‍👧‍👦\n\n아이들이 정말 좋아했어요. 특히 해변에서 모래성 만들기와 조개 줍기가 최고였습니다. 포항은 가족 여행지로도 완벽해요!',
    media_urls: [
      'https://picsum.photos/800/600?random=16',
      'https://picsum.photos/800/600?random=17',
    ],
    hashtags: ['가족여행', '포항', '해변', '아이들', '추억'],
    location_data: {
      name: '포항 해변',
      coordinates: [129.3656, 36.0194],
    },
    mood: 'happy',
    is_public: true,
  },
];

// 샘플 댓글 데이터
const sampleComments = [
  {
    post_id: '', // 첫 번째 게시물 ID로 설정
    author_id: 'user-2',
    content: '정말 아름다운 일출이네요! 저도 다음에 가보고 싶어요 🌅',
  },
  {
    post_id: '', // 첫 번째 게시물 ID로 설정
    author_id: 'user-3',
    content: '포항의 바다 정말 아름답죠! 영일대는 정말 추천하는 곳이에요',
  },
  {
    post_id: '', // 두 번째 게시물 ID로 설정
    author_id: 'user-1',
    content: '과메기 정말 맛있죠! 포항의 대표 음식이에요 🦀',
  },
  {
    post_id: '', // 세 번째 게시물 ID로 설정
    author_id: 'user-4',
    content: '포항제철소 역사 정말 흥미로워요! 다음에 가이드 투어 신청해보세요',
  },
  {
    post_id: '', // 네 번째 게시물 ID로 설정
    author_id: 'user-5',
    content: '어떤 카페인지 궁금해요! 주소 알려주실 수 있나요?',
  },
];

// 샘플 좋아요 데이터
const sampleLikes = [
  { user_id: 'user-2', post_id: '' }, // 첫 번째 게시물
  { user_id: 'user-3', post_id: '' }, // 첫 번째 게시물
  { user_id: 'user-4', post_id: '' }, // 첫 번째 게시물
  { user_id: 'user-1', post_id: '' }, // 두 번째 게시물
  { user_id: 'user-3', post_id: '' }, // 두 번째 게시물
  { user_id: 'user-5', post_id: '' }, // 두 번째 게시물
  { user_id: 'user-1', post_id: '' }, // 세 번째 게시물
  { user_id: 'user-2', post_id: '' }, // 세 번째 게시물
  { user_id: 'user-1', post_id: '' }, // 네 번째 게시물
  { user_id: 'user-3', post_id: '' }, // 네 번째 게시물
  { user_id: 'user-2', post_id: '' }, // 다섯 번째 게시물
  { user_id: 'user-4', post_id: '' }, // 다섯 번째 게시물
];

async function insertSampleData() {
  try {
    console.log('🚀 샘플 데이터 삽입 시작...');

    // 1. 사용자 프로필 생성
    console.log('👥 사용자 프로필 생성 중...');
    for (const user of sampleUsers) {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`사용자 ${user.id} 생성 실패:`, error);
      } else {
        console.log(`✅ 사용자 ${user.name} 생성 완료`);
      }
    }

    // 2. 게시물 생성
    console.log('📝 게시물 생성 중...');
    const postIds = [];

    for (const post of samplePosts) {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...post,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        console.error('게시물 생성 실패:', error);
      } else {
        postIds.push(data.id);
        console.log(`✅ 게시물 생성 완료: ${data.id}`);
      }
    }

    // 3. 댓글 생성 (첫 번째와 두 번째 게시물에)
    console.log('💬 댓글 생성 중...');
    const commentPostIds = [
      postIds[0],
      postIds[1],
      postIds[2],
      postIds[3],
      postIds[4],
    ];

    for (let i = 0; i < sampleComments.length; i++) {
      const comment = sampleComments[i];
      const postId = commentPostIds[i % commentPostIds.length];

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: comment.author_id,
        content: comment.content,
        like_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('댓글 생성 실패:', error);
      } else {
        console.log(`✅ 댓글 생성 완료`);
      }
    }

    // 4. 좋아요 생성
    console.log('❤️ 좋아요 생성 중...');
    for (let i = 0; i < sampleLikes.length; i++) {
      const like = sampleLikes[i];
      const postId = postIds[i % postIds.length];

      const { error } = await supabase.from('likes').insert({
        user_id: like.user_id,
        post_id: postId,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('좋아요 생성 실패:', error);
      } else {
        console.log(`✅ 좋아요 생성 완료`);
      }
    }

    // 5. 게시물 통계 업데이트
    console.log('📊 게시물 통계 업데이트 중...');
    for (const postId of postIds) {
      // 좋아요 수 업데이트
      const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      // 댓글 수 업데이트
      const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      await supabase
        .from('posts')
        .update({
          like_count: likeCount || 0,
          comment_count: commentCount || 0,
        })
        .eq('id', postId);
    }

    console.log('🎉 샘플 데이터 삽입 완료!');
    console.log(`📊 생성된 데이터:`);
    console.log(`- 사용자: ${sampleUsers.length}명`);
    console.log(`- 게시물: ${samplePosts.length}개`);
    console.log(`- 댓글: ${sampleComments.length}개`);
    console.log(`- 좋아요: ${sampleLikes.length}개`);
  } catch (error) {
    console.error('❌ 샘플 데이터 삽입 실패:', error);
  }
}

// 스크립트 실행
insertSampleData();
