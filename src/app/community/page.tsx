'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
} from 'lucide-react';
import FeatureAccess from '@/components/auth/feature-access';
import { PostWriterModal } from '@/components/community/post-writer-modal';
import CommentModal from '@/components/community/CommentModal';
import {
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost,
  createComment,
  getComments,
} from '@/features/community/api';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

// 실제 데이터베이스에서 posts 가져오기
async function fetchPosts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles!author_id (
        id,
        name,
        avatar_url
      ),
      likes:likes(count),
      comments:comments(count),
      bookmarks:bookmarks(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Posts 조회 오류:', error);
    return [];
  }

  return data?.map(post => ({
    id: post.id,
    author: post.profiles?.name || '익명',
    avatar: post.profiles?.avatar_url || 'https://picsum.photos/40/40?random=1',
    title: post.title,
    content: post.content,
    image: post.image_url,
    likes: post.likes?.[0]?.count || 0,
    comments: post.comments?.[0]?.count || 0,
    bookmarks: post.bookmarks?.[0]?.count || 0,
    tags: post.tags || [],
    createdAt: new Date(post.created_at).toLocaleDateString(),
    isLiked: false, // TODO: 사용자별 좋아요 상태 확인
    isBookmarked: false, // TODO: 사용자별 북마크 상태 확인
  })) || [];
}

// 실제 데이터베이스에서 생성된 posts의 ID 사용
const mockPosts = [
  {
    id: 'd1fc3358-a0f5-489d-9b13-0f2c988c4448', // 실제 DB의 첫 번째 post ID
    author: '포항여행러',
    avatar: 'https://picsum.photos/40/40?random=1',
    title: '포항 호미곶 일출 정말 아름다웠어요!',
    content:
      '새벽 5시에 일어나서 호미곶에 갔는데 정말 환상적이었습니다. 동해의 첫 일출을 보는 순간 모든 피로가 사라졌어요.',
    image: 'https://picsum.photos/400/300?random=1',
    likes: 24,
    comments: 8,
    bookmarks: 12,
    tags: ['일출', '호미곶', '포항여행'],
    createdAt: '2024-01-15',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '99a649b7-48c6-4053-9226-42352ab0a22b', // 실제 DB의 두 번째 post ID
    author: '맛집탐방러',
    avatar: 'https://picsum.photos/40/40?random=2',
    title: '포항 과메기 맛집 추천해주세요!',
    content:
      '포항에 처음 왔는데 과메기 맛집을 찾고 있어요. 현지인들이 추천하는 곳이 있나요?',
    image: null,
    likes: 15,
    comments: 23,
    bookmarks: 7,
    tags: ['맛집', '과메기', '포항'],
    createdAt: '2024-01-14',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: '7f97a5bf-578e-4f4b-a543-d9192bc30037', // 실제 DB의 세 번째 post ID
    author: '역사탐방러',
    avatar: 'https://picsum.photos/40/40?random=3',
    title: '포항 역사박물관 방문 후기',
    content:
      '포항의 역사를 한눈에 볼 수 있는 박물관이었습니다. 특히 조선시대 포항의 모습이 인상적이었어요.',
    image: 'https://picsum.photos/400/300?random=3',
    likes: 18,
    comments: 5,
    bookmarks: 9,
    tags: ['역사', '박물관', '문화'],
    createdAt: '2024-01-13',
    isLiked: false,
    isBookmarked: true,
  },
];

export default function CommunityPage() {
  return (
    <FeatureAccess
      featureName="커뮤니티"
      description="다른 여행자들과 경험을 공유하고 소통해보세요."
      requireAuth={true}
    >
      <CommunityContent />
    </FeatureAccess>
  );
}

function CommunityContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 실제 데이터베이스에서 posts 로드
  useEffect(() => {
    async function loadPosts() {
      try {
        const fetchedPosts = await fetchPosts();
        if (fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        } else {
          // 데이터가 없으면 mockPosts 사용
          console.log('데이터베이스에 posts가 없어서 mockPosts 사용');
          setPosts(mockPosts);
        }
      } catch (error) {
        console.error('Posts 로드 실패:', error);
        // 실패 시 mockPosts 사용
        console.log('데이터베이스 연결 실패로 mockPosts 사용');
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('전체');
  const [showPostWriter, setShowPostWriter] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.isLiked) {
        // 좋아요 취소
        const { error } = await unlikePost(postId);
        if (error) throw error;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: false,
                  likes: p.likes - 1,
                }
              : p
          )
        );
      } else {
        // 좋아요 추가
        const { error } = await likePost(postId);
        if (error) throw error;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: true,
                  likes: p.likes + 1,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      toast({
        title: '오류가 발생했습니다',
        description: '좋아요 처리 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleBookmark = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.isBookmarked) {
        // 북마크 취소
        const { error } = await unbookmarkPost(postId);
        if (error) throw error;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isBookmarked: false,
                  bookmarks: p.bookmarks - 1,
                }
              : p
          )
        );
      } else {
        // 북마크 추가
        const { error } = await bookmarkPost(postId);
        if (error) throw error;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isBookmarked: true,
                  bookmarks: p.bookmarks + 1,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('북마크 처리 오류:', error);
      toast({
        title: '오류가 발생했습니다',
        description: '북마크 처리 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handlePostCreated = () => {
    // TODO: 실제로는 서버에서 최신 게시글을 가져와야 함
    console.log('새 게시글이 작성되었습니다.');
  };

  // 댓글 모달 열기
  const handleOpenCommentModal = async (postId: string) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);

    try {
      // 댓글 목록 가져오기
      const { data, error } = await getComments(postId);
      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      toast({
        title: '오류가 발생했습니다',
        description: '댓글을 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 댓글 추가
  const handleAddComment = async (postId: string, content: string) => {
    try {
      const { data, error } = await createComment({
        post_id: postId,
        content: content,
      });

      if (error) throw error;

      // 댓글 목록에 새 댓글 추가
      setComments((prev) => [data, ...prev]);

      // 게시글의 댓글 수 증가
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );

      return data;
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      throw error;
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === '전체' || post.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">게시글을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
            <p className="text-gray-600">포항 여행자들과 경험을 공유해보세요</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowPostWriter(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === '전체' ? 'default' : 'outline'}
              onClick={() => setFilter('전체')}
            >
              전체
            </Button>
            <Button
              variant={filter === '일출' ? 'default' : 'outline'}
              onClick={() => setFilter('일출')}
            >
              일출
            </Button>
            <Button
              variant={filter === '맛집' ? 'default' : 'outline'}
              onClick={() => setFilter('맛집')}
            >
              맛집
            </Button>
            <Button
              variant={filter === '역사' ? 'default' : 'outline'}
              onClick={() => setFilter('역사')}
            >
              역사
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">활성 사용자</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">오늘 게시글</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">인기 태그</p>
                  <p className="text-2xl font-bold">일출</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.createdAt}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={post.isLiked ? 'text-red-500' : ''}
                    >
                      <Heart
                        className={`w-4 h-4 mr-1 ${
                          post.isLiked ? 'fill-current' : ''
                        }`}
                      />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenCommentModal(post.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post.id)}
                      className={post.isBookmarked ? 'text-blue-500' : ''}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-1 ${
                          post.isBookmarked ? 'fill-current' : ''
                        }`}
                      />
                      {post.bookmarks}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 게시글 작성 모달 */}
      <PostWriterModal
        isOpen={showPostWriter}
        onClose={() => setShowPostWriter(false)}
        onPostCreated={handlePostCreated}
      />

      {/* 댓글 모달 */}
      {selectedPostId && (
        <CommentModal
          postId={selectedPostId}
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedPostId(null);
            setComments([]);
          }}
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={() => {}} // TODO: 댓글 좋아요 기능 구현
        />
      )}
    </div>
  );
}
