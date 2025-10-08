'use client';

import { useState, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text';
  url: string;
  title: string;
  duration?: number;
}

interface LazyMediaViewerProps {
  media: MediaItem[];
  className?: string;
}

export default function LazyMediaViewer({
  media,
  className = '',
}: LazyMediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentMedia = useMemo(
    () => media[currentIndex],
    [media, currentIndex]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  if (!media.length) {
    return (
      <div
        className={`w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">표시할 미디어가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden ${className}`}
    >
      {currentMedia.type === 'image' && (
        <Image
          src={currentMedia.url}
          alt={currentMedia.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={currentIndex === 0}
        />
      )}

      {currentMedia.type === 'video' && (
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            controls={false}
            muted={isMuted}
            autoPlay={isPlaying}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={currentMedia.url} type="video/mp4" />
            비디오를 재생할 수 없습니다.
          </video>

          {/* 비디오 컨트롤 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          {/* 음소거 토글 */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}

      {currentMedia.type === 'text' && (
        <div className="w-full h-full flex items-center justify-center p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{currentMedia.title}</h3>
            <p className="text-gray-600">{currentMedia.url}</p>
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            →
          </button>
        </>
      )}

      {/* 미디어 인디케이터 */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      {/* 미디어 정보 */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
        <h4 className="font-semibold">{currentMedia.title}</h4>
        {currentMedia.duration && (
          <p className="text-sm text-gray-300">
            {Math.floor(currentMedia.duration / 60)}:
            {(currentMedia.duration % 60).toString().padStart(2, '0')}
          </p>
        )}
      </div>
    </div>
  );
}
