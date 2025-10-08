'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostCard } from '@/components/community/post-card';
import CommentModal from '@/components/community/CommentModal';
import ShareModal from '@/components/community/ShareModal';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Tag,
  Image as ImageIcon,
  Video,
  FileText,
  X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  title?: string;
  content: string;
  images?: string[];
  location?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: 'text' | 'image' | 'video' | 'album';
}

interface CommunityStats {
  totalPosts: number;
  totalUsers: number;
  totalLikes: number;
  totalComments: number;
  trendingTags: string[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalLikes: 0,
    totalComments: 0,
    trendingTags: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
    category: '',
    visibility: 'public',
    notifications: true,
    images: [] as File[],
    videos: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});

  // 게시물 데이터 로드
  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      // 실제 API 호출 대신 목업 데이터 사용
      const mockPosts: Post[] = [
        {
          id: '1',
          author: {
            id: 'user1',
            name: '포항여행러',
            avatar: 'https://picsum.photos/100/100?random=4',
            verified: true,
          },
          title: '포항 영일대 해수욕장 일출 감상',
          content:
            '포항 영일대 해수욕장에서의 아름다운 일출을 담았습니다! 🌅\n\n새벽 5시에 일어나서 해변으로 향했는데, 정말 값진 경험이었어요. 포항의 바다는 정말 아름답네요!',
          images: [
            'https://picsum.photos/800/600?random=5',
            'https://picsum.photos/800/600?random=6',
          ],
          location: '영일대 해수욕장',
          tags: ['일출', '해변', '포항', '자연'],
          likes: 24,
          comments: 8,
          shares: 3,
          isLiked: false,
          isBookmarked: false,
          createdAt: new Date('2024-12-19T06:00:00Z'),
          updatedAt: new Date('2024-12-19T06:00:00Z'),
          type: 'image',
        },
        {
          id: '2',
          author: {
            id: 'user2',
            name: '포항맛집탐방',
            avatar: 'https://picsum.photos/100/100?random=7',
            verified: false,
          },
          title: '포항 맛집 투어 후기',
          content:
            '포항 대표 맛집들을 돌아다니며 맛본 음식들! 🍽️\n\n특히 포항의 대표 음식인 과메기를 처음 먹어봤는데, 정말 맛있었어요. 다음에 또 와야겠습니다!',
          images: [
            'https://picsum.photos/800/600?random=1',
            'https://picsum.photos/800/600?random=2',
            'https://picsum.photos/800/600?random=3',
          ],
          location: '포항 시내',
          tags: ['맛집', '과메기', '포항', '음식'],
          likes: 18,
          comments: 12,
          shares: 5,
          isLiked: true,
          isBookmarked: false,
          createdAt: new Date('2024-12-19T12:00:00Z'),
          updatedAt: new Date('2024-12-19T12:00:00Z'),
          type: 'image',
        },
        {
          id: '3',
          author: {
            id: 'user3',
            name: '포항역사탐방',
            avatar: 'https://picsum.photos/100/100?random=8',
            verified: true,
          },
          title: '포항 역사 탐방기',
          content:
            '포항의 역사적 의미를 담은 장소들을 둘러보았습니다. \n\n포항의 발전 과정과 역사를 알 수 있는 좋은 기회였어요. 특히 포항제철소의 역사는 정말 인상적이었습니다.',
          location: '포항제철소',
          tags: ['역사', '포항제철소', '문화', '교육'],
          likes: 15,
          comments: 6,
          shares: 2,
          isLiked: false,
          isBookmarked: true,
          createdAt: new Date('2024-12-19T15:00:00Z'),
          updatedAt: new Date('2024-12-19T15:00:00Z'),
          type: 'text',
        },
      ];

      setPosts(mockPosts);
      updateStats(mockPosts);
    } catch (error) {
      console.error('게시물 데이터 로드 실패:', error);
      toast({
        title: '오류',
        description: '게시물 데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 게시물 데이터 로드
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 필터링 및 정렬
  useEffect(() => {
    let filtered = [...posts];

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter((post) => post.type === typeFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'popular':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        case 'shares':
          return b.shares - a.shares;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, typeFilter, sortBy]);

  // 통계 업데이트
  const updateStats = (posts: Post[]) => {
    const stats: CommunityStats = {
      totalPosts: posts.length,
      totalUsers: new Set(posts.map((post) => post.author.id)).size,
      totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
      totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
      trendingTags: Array.from(
        new Set(posts.flatMap((post) => post.tags))
      ).slice(0, 5),
    };
    setStats(stats);
  };

  // 게시물 좋아요
  const handleLike = (post: Post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  // 게시물 북마크
  const handleBookmark = (post: Post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  // 게시물 공유
  const handleShare = (post: Post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  // 게시물 댓글
  const handleComment = (post: Post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  // 댓글 추가
  const handleAddComment = async (postId: string, content: string) => {
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: {
        id: 'current-user',
        name: '나',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
        verified: false,
      },
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // 게시물의 댓글 수 업데이트
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
  };

  // 댓글 좋아요
  const handleLikeComment = (commentId: string) => {
    if (!selectedPost) return;

    setComments((prev) => ({
      ...prev,
      [selectedPost.id]: (prev[selectedPost.id] || []).map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      ),
    }));
  };

  // 파일 업로드 처리
  const handleFileUpload = (
    files: FileList | null,
    type: 'image' | 'video'
  ) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (type === 'image') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB 제한
      } else {
        return file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024; // 100MB 제한
      }
    });

    if (validFiles.length !== fileArray.length) {
      toast({
        title: '파일 크기 초과',
        description:
          type === 'image'
            ? '이미지는 10MB 이하만 업로드 가능합니다.'
            : '비디오는 100MB 이하만 업로드 가능합니다.',
        variant: 'destructive',
      });
    }

    if (type === 'image') {
      setNewPost((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));

      // 미리보기 생성
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewPost((prev) => ({
        ...prev,
        videos: [...prev.videos, ...validFiles],
      }));

      // 비디오 미리보기 생성
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewVideos((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 파일 제거
  const removeFile = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      setNewPost((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewPost((prev) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index),
      }));
      setPreviewVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // 파일 타입별로 분류
    const imageFiles: File[] = [];
    const videoFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      } else if (file.type.startsWith('video/')) {
        videoFiles.push(file);
      }
    });

    // 이미지와 비디오 처리
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles as any, 'image');
    }
    if (videoFiles.length > 0) {
      handleFileUpload(videoFiles as any, 'video');
    }
  };

  // 새 게시물 작성
  const handleCreatePost = async () => {
    if (!newPost.title.trim()) {
      toast({
        title: '제목을 입력해주세요',
        description: '게시물 제목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!newPost.content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        description: '게시물 내용을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const now = new Date();

      // 게시물 타입 결정
      let postType: 'text' | 'image' | 'video' | 'album' = 'text';
      if (newPost.images.length > 0 && newPost.videos.length > 0) {
        postType = 'album';
      } else if (newPost.videos.length > 0) {
        postType = 'video';
      } else if (newPost.images.length > 0) {
        postType = 'image';
      }

      // 이미지 URL 생성 (실제로는 서버에 업로드 후 URL 반환)
      const imageUrls = newPost.images.map(
        (_, index) =>
          `https://picsum.photos/800/600?random=${Date.now()}-${index}`
      );

      const post: Post = {
        id: `post-${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        author: {
          id: 'current-user',
          name: '나',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
          verified: false,
        },
        title: newPost.title,
        content: newPost.content,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        location: newPost.location,
        tags: newPost.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: now,
        updatedAt: now,
        type: postType,
      };

      setPosts((prev) => [post, ...prev]);
      setNewPost({
        title: '',
        content: '',
        location: '',
        tags: '',
        category: '',
        visibility: 'public',
        notifications: true,
        images: [],
        videos: [],
      });
      setPreviewImages([]);
      setPreviewVideos([]);
      setShowCreatePost(false);

      toast({
        title: '게시물 작성 완료',
        description: '게시물이 성공적으로 작성되었습니다.',
      });
    } catch (error) {
      console.error('게시물 작성 실패:', error);
      toast({
        title: '게시물 작성 실패',
        description: '게시물 작성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
            <p className="text-gray-600 mt-1">
              포항 여행의 소중한 순간들을 공유하고 소통하세요
            </p>
          </div>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            게시물 작성
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalPosts}
              </div>
              <div className="text-sm text-gray-600">총 게시물</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">활성 사용자</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.totalLikes}
              </div>
              <div className="text-sm text-gray-600">총 좋아요</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalComments}
              </div>
              <div className="text-sm text-gray-600">총 댓글</div>
            </CardContent>
          </Card>
        </div>

        {/* 트렌딩 태그 */}
        {stats.trendingTags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                인기 태그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.trendingTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="게시물 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="타입 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="text">텍스트</SelectItem>
              <SelectItem value="image">이미지</SelectItem>
              <SelectItem value="video">비디오</SelectItem>
              <SelectItem value="album">앨범</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
              <SelectItem value="shares">공유순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 게시물 목록 */}
      {filteredPosts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 게시물이 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              첫 번째 게시물을 작성하여 커뮤니티에 참여해보세요!
            </p>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="h-4 w-4 mr-2" />첫 게시물 작성
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              title={post.title}
              content={post.content}
              images={post.images}
              location={post.location}
              hashtags={post.tags}
              createdAt={post.createdAt.toLocaleDateString('ko-KR')}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              isLiked={post.isLiked}
              isBookmarked={post.isBookmarked}
              isOwner={post.author.id === 'current-user'}
              onComment={() => handleComment(post)}
            />
          ))}
        </div>
      )}

      {/* 게시물 작성 모달 */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>새 게시물 작성</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePost(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="게시물 제목을 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 *
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="무엇을 공유하고 싶으신가요?"
                  className="min-h-[120px]"
                />
              </div>

              {/* 카테고리와 공개 설정 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) =>
                      setNewPost((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">여행 후기</SelectItem>
                      <SelectItem value="food">맛집 추천</SelectItem>
                      <SelectItem value="photo">사진 공유</SelectItem>
                      <SelectItem value="question">질문하기</SelectItem>
                      <SelectItem value="event">이벤트</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 설정
                  </label>
                  <Select
                    value={newPost.visibility}
                    onValueChange={(value) =>
                      setNewPost((prev) => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">전체 공개</SelectItem>
                      <SelectItem value="followers">팔로워만</SelectItem>
                      <SelectItem value="private">비공개</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 미디어 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  미디어 업로드
                </label>

                {/* 드래그 앤 드롭 영역 */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-4">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      파일을 여기에 드래그하거나 아래 버튼을 클릭하세요
                    </p>
                    <p className="text-xs text-gray-500">
                      이미지 (최대 10MB), 비디오 (최대 100MB)
                    </p>
                  </div>
                </div>

                {/* 개별 업로드 버튼 */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* 이미지 업로드 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleFileUpload(e.target.files, 'image')
                      }
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        이미지 업로드
                      </span>
                      <span className="text-xs text-gray-500">최대 10MB</span>
                    </label>
                  </div>

                  {/* 비디오 업로드 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) =>
                        handleFileUpload(e.target.files, 'video')
                      }
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Video className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">숏폼 업로드</span>
                      <span className="text-xs text-gray-500">최대 100MB</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 미리보기 섹션 */}
              {(previewImages.length > 0 || previewVideos.length > 0) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    미리보기
                  </label>
                  <div className="space-y-4">
                    {/* 이미지 미리보기 */}
                    {previewImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                          이미지 ({previewImages.length}개)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={preview}
                                alt={`미리보기 ${index + 1}`}
                                width={96}
                                height={96}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeFile(index, 'image')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 비디오 미리보기 */}
                    {previewVideos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                          비디오 ({previewVideos.length}개)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {previewVideos.map((preview, index) => (
                            <div key={index} className="relative group">
                              <video
                                src={preview}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                              <button
                                onClick={() => removeFile(index, 'video')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치 (선택사항)
                </label>
                <Input
                  value={newPost.location}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="위치를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그 (선택사항)
                </label>
                <Input
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="태그를 쉼표로 구분하여 입력하세요"
                />
              </div>

              {/* 알림 설정 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={newPost.notifications}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="notifications"
                  className="text-sm text-gray-700"
                >
                  댓글과 좋아요 알림 받기
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                >
                  취소
                </Button>
                <Button onClick={handleCreatePost}>게시물 작성</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 댓글 모달 */}
      {showCommentModal && selectedPost && (
        <CommentModal
          postId={selectedPost.id}
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedPost(null);
          }}
          comments={comments[selectedPost.id] || []}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {/* 공유 모달 */}
      {showShareModal && selectedPost && (
        <ShareModal
          post={selectedPost}
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}
