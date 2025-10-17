'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlbumList } from '@/components/albums/album-list';
import { Album } from '@/features/albums/api';
import FeatureAccess from '@/components/auth/feature-access';

export default function AlbumsPage() {
  return (
    <FeatureAccess
      featureName="나의 앨범"
      description="여행의 추억을 담은 앨범을 관리하세요."
      requireAuth={true}
    >
      <AlbumsContent />
    </FeatureAccess>
  );
}

function AlbumsContent() {
  const router = useRouter();

  const handleAlbumSelect = (album: Album) => {
    router.push(`/albums/${album.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AlbumList onAlbumSelect={handleAlbumSelect} />
    </div>
  );
}
