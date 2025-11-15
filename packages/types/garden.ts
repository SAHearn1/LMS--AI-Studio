export interface Garden {
  id: string;
  studentId: string;
  name: string;
  description?: string;
  plants: Plant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Plant {
  id: string;
  gardenId: string;
  name: string;
  type: string;
  level: number;
  xp: number;
  health: number;
  lastWatered?: Date;
  createdAt: Date;
}

export interface GardenReward {
  id: string;
  studentId: string;
  rewardType: 'seed' | 'fertilizer' | 'decoration' | 'xp';
  amount: number;
  earnedAt: Date;
  reason: string;
}
