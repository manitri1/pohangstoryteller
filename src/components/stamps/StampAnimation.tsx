'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface StampAnimationProps {
  isVisible: boolean;
  stampData: {
    locationName: string;
    stampImage: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
  };
  onComplete: () => void;
}

export default function StampAnimation({
  isVisible,
  stampData,
  onComplete,
}: StampAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setShowParticles(true);
      }, 500);

      const completeTimer = setTimeout(() => {
        setCurrentStep(2);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '⭐';
      case 'rare':
        return '🌟';
      case 'epic':
        return '💫';
      case 'legendary':
        return '👑';
      default:
        return '⭐';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      >
        {/* 배경 파티클 */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  opacity: 0,
                }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute"
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        )}

        {/* 메인 애니메이션 */}
        <div className="relative">
          {/* 스탬프 획득 알림 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4"
          >
            {/* 헤더 */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"
              >
                <Trophy className="h-8 w-8 text-white" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                스탬프 획득!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-gray-600"
              >
                {stampData.locationName}
              </motion.p>
            </div>

            {/* 스탬프 이미지 */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
              className="relative mb-6"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <Image
                  src={stampData.stampImage}
                  alt={`${stampData.locationName} 스탬프`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* 희귀도 배지 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 }}
                className={`absolute -top-2 -right-2 bg-gradient-to-r ${getRarityColor(stampData.rarity)} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}
              >
                <span>{getRarityIcon(stampData.rarity)}</span>
                <span>{stampData.rarity.toUpperCase()}</span>
              </motion.div>
            </motion.div>

            {/* 포인트 정보 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>+{stampData.points} 포인트 획득!</span>
              </div>
            </motion.div>

            {/* 진행 단계 표시 */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  스탬프가 컬렉션에 추가되었습니다!
                </p>
              </motion.div>
            )}

            {/* 완료 메시지 */}
            {currentStep === 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mt-6 text-center"
              >
                <div className="text-green-600 font-semibold">✅ 완료!</div>
              </motion.div>
            )}
          </motion.div>

          {/* 펄스 효과 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
            }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-xl -z-10"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
