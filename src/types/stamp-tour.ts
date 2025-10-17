// 스탬프 투어 관련 타입 정의
export interface StampTour {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // 분 단위
  totalStamps: number;
  collectedStamps: number;
  isCompleted: boolean;
  completionRate: number; // 0-100
  stamps: StampInTour[];
  rewards?: TourReward[];
}

export interface StampInTour {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isCollected: boolean;
  collectedAt?: string;
  order: number; // 투어 내 순서
}

export interface TourReward {
  id: string;
  type: 'badge' | 'coupon' | 'discount' | 'special';
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface TourProgress {
  tourId: string;
  totalStamps: number;
  collectedStamps: number;
  completionRate: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  lastCollectedAt?: string;
}

// 투어 카테고리
export interface TourCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tours: StampTour[];
}
