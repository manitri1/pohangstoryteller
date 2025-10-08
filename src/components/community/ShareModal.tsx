'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Copy,
  ExternalLink,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Link,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareModalProps {
  post: {
    id: string;
    content: string;
    author: {
      name: string;
    };
    location?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ post, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const postUrl = `${window.location.origin}/community/post/${post.id}`;
  const shareText = `${post.author.name}님이 공유한 포항 스토리텔러 게시물: ${post.content.substring(0, 100)}...`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: '링크 복사 완료',
        description: '게시물 링크가 클립보드에 복사되었습니다.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: '복사 실패',
        description: '링크 복사에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleShareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleShareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleShareToKakao = () => {
    // 카카오톡 공유는 실제 구현 시 Kakao SDK 사용
    toast({
      title: '카카오톡 공유',
      description: '카카오톡 공유 기능은 준비 중입니다.',
    });
  };

  const handleShareToEmail = () => {
    const subject = encodeURIComponent(`포항 스토리텔러 게시물 공유`);
    const body = encodeURIComponent(`${shareText}\n\n링크: ${postUrl}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    onClose();
  };

  const handleShareToSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(`${shareText}\n${postUrl}`)}`;
    window.location.href = smsUrl;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>게시물 공유</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 게시물 미리보기 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {post.location || '포항'}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
          </div>

          {/* 링크 복사 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              링크 복사
            </label>
            <div className="flex items-center space-x-2">
              <Input value={postUrl} readOnly className="flex-1 text-sm" />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'default' : 'outline'}
                size="sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied ? '복사됨' : '복사'}
              </Button>
            </div>
          </div>

          {/* 공유 옵션 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              다른 방법으로 공유
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleShareToFacebook}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                onClick={handleShareToTwitter}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button
                onClick={handleShareToKakao}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-yellow-500" />
                카카오톡
              </Button>
              <Button
                onClick={handleShareToEmail}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                이메일
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={handleShareToSMS}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                문자 메시지
              </Button>
            </div>
          </div>

          {/* 외부 링크 */}
          <div className="pt-2 border-t">
            <Button
              onClick={() => {
                window.open(postUrl, '_blank');
                onClose();
              }}
              variant="ghost"
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />새 탭에서 열기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
