// Achievement Rarity System
// Adds tiers (Bronze/Silver/Gold/Platinum), points, and rarity mechanics

import { Achievement } from "@/utils/achievementSystem";

/**
 * Achievement rarity tiers
 */
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

/**
 * Enhanced achievement with rarity
 */
export interface RarityAchievement extends Achievement {
  rarity: AchievementRarity;
  points: number;
  unlockRate?: number; // % of users who have this (0-100)
  tier?: AchievementTier;
}

/**
 * Achievement tiers (Bronze, Silver, Gold, Platinum)
 */
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * Tier thresholds
 */
export interface TierProgress {
  currentTier: AchievementTier;
  nextTier: AchievementTier | null;
  currentPoints: number;
  pointsForNextTier: number;
  progress: number; // 0-100
}

/**
 * Points required for each tier
 */
export const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 100,
  gold: 500,
  platinum: 1500,
};

/**
 * Points awarded based on rarity
 */
export const RARITY_POINTS = {
  common: 5,
  rare: 15,
  epic: 30,
  legendary: 100,
};

/**
 * Color schemes for each rarity
 */
export const RARITY_COLORS = {
  common: {
    bg: "from-slate-500 to-slate-600",
    border: "border-slate-400",
    text: "text-slate-100",
    glow: "shadow-slate-500/50",
    icon: "⚪",
  },
  rare: {
    bg: "from-blue-500 to-blue-600",
    border: "border-blue-400",
    text: "text-blue-100",
    glow: "shadow-blue-500/50",
    icon: "🔵",
  },
  epic: {
    bg: "from-purple-500 to-purple-600",
    border: "border-purple-400",
    text: "text-purple-100",
    glow: "shadow-purple-500/50",
    icon: "🟣",
  },
  legendary: {
    bg: "from-amber-400 via-yellow-500 to-amber-600",
    border: "border-yellow-400",
    text: "text-yellow-100",
    glow: "shadow-yellow-500/50",
    icon: "🟡",
    gradient: "animate-gradient-x",
  },
};

/**
 * Tier colors and badges
 */
export const TIER_CONFIG = {
  bronze: {
    name: "Bronze",
    color: "from-amber-700 to-amber-800",
    icon: "🥉",
    borderColor: "border-amber-600",
  },
  silver: {
    name: "Silver",
    color: "from-gray-300 to-gray-400",
    icon: "🥈",
    borderColor: "border-gray-300",
  },
  gold: {
    name: "Gold",
    color: "from-yellow-400 to-yellow-600",
    icon: "🥇",
    borderColor: "border-yellow-400",
  },
  platinum: {
    name: "Platinum",
    color: "from-cyan-300 to-blue-400",
    icon: "💎",
    borderColor: "border-cyan-300",
    special: "animate-shimmer",
  },
};

/**
 * Enhanced achievement definitions with rarity
 */
export const ACHIEVEMENT_RARITY_DEFINITIONS = [
  // COMMON ACHIEVEMENTS (Everyone gets these)
  {
    id: "first-workout",
    rarity: "common" as AchievementRarity,
    unlockRate: 100,
  },
  {
    id: "first-pr",
    rarity: "common" as AchievementRarity,
    unlockRate: 95,
  },
  {
    id: "weight-logged",
    rarity: "common" as AchievementRarity,
    unlockRate: 90,
  },
  {
    id: "workouts-5",
    rarity: "common" as AchievementRarity,
    unlockRate: 85,
  },
  {
    id: "streak-3",
    rarity: "common" as AchievementRarity,
    unlockRate: 80,
  },

  // RARE ACHIEVEMENTS (Most dedicated users)
  {
    id: "workouts-10",
    rarity: "rare" as AchievementRarity,
    unlockRate: 70,
  },
  {
    id: "workouts-25",
    rarity: "rare" as AchievementRarity,
    unlockRate: 50,
  },
  {
    id: "streak-7",
    rarity: "rare" as AchievementRarity,
    unlockRate: 60,
  },
  {
    id: "prs-5",
    rarity: "rare" as AchievementRarity,
    unlockRate: 55,
  },
  {
    id: "weekly-3",
    rarity: "rare" as AchievementRarity,
    unlockRate: 65,
  },
  {
    id: "prs-10",
    rarity: "rare" as AchievementRarity,
    unlockRate: 40,
  },

  // EPIC ACHIEVEMENTS (Very committed users)
  {
    id: "workouts-50",
    rarity: "epic" as AchievementRarity,
    unlockRate: 25,
  },
  {
    id: "streak-14",
    rarity: "epic" as AchievementRarity,
    unlockRate: 30,
  },
  {
    id: "weekly-5",
    rarity: "epic" as AchievementRarity,
    unlockRate: 35,
  },
  {
    id: "prs-25",
    rarity: "epic" as AchievementRarity,
    unlockRate: 20,
  },
  {
    id: "variety-10",
    rarity: "epic" as AchievementRarity,
    unlockRate: 28,
  },
  {
    id: "month-30",
    rarity: "epic" as AchievementRarity,
    unlockRate: 22,
  },

  // LEGENDARY ACHIEVEMENTS (Elite users only)
  {
    id: "workouts-100",
    rarity: "legendary" as AchievementRarity,
    unlockRate: 10,
  },
  {
    id: "streak-30",
    rarity: "legendary" as AchievementRarity,
    unlockRate: 8,
  },
  {
    id: "variety-25",
    rarity: "legendary" as AchievementRarity,
    unlockRate: 12,
  },
  {
    id: "ultimate-dedication",
    rarity: "legendary" as AchievementRarity,
    unlockRate: 5,
  },
];

/**
 * Get achievement rarity data
 */
export function getAchievementRarity(achievementId: string): {
  rarity: AchievementRarity;
  points: number;
  unlockRate: number;
} {
  const definition = ACHIEVEMENT_RARITY_DEFINITIONS.find(
    (def) => def.id === achievementId
  );

  if (!definition) {
    return {
      rarity: "common",
      points: RARITY_POINTS.common,
      unlockRate: 100,
    };
  }

  return {
    rarity: definition.rarity,
    points: RARITY_POINTS[definition.rarity],
    unlockRate: definition.unlockRate || 50,
  };
}

/**
 * Calculate total achievement points
 */
export function calculateTotalPoints(achievements: Achievement[]): number {
  return achievements.reduce((total, achievement) => {
    const { points } = getAchievementRarity(achievement.id);
    return total + points;
  }, 0);
}

/**
 * Calculate current tier and progress
 */
export function calculateTierProgress(totalPoints: number): TierProgress {
  let currentTier: AchievementTier = "bronze";
  let nextTier: AchievementTier | null = "silver";
  let pointsForNextTier = TIER_THRESHOLDS.silver;

  if (totalPoints >= TIER_THRESHOLDS.platinum) {
    currentTier = "platinum";
    nextTier = null;
    pointsForNextTier = TIER_THRESHOLDS.platinum;
  } else if (totalPoints >= TIER_THRESHOLDS.gold) {
    currentTier = "gold";
    nextTier = "platinum";
    pointsForNextTier = TIER_THRESHOLDS.platinum;
  } else if (totalPoints >= TIER_THRESHOLDS.silver) {
    currentTier = "silver";
    nextTier = "gold";
    pointsForNextTier = TIER_THRESHOLDS.gold;
  }

  const currentTierPoints = TIER_THRESHOLDS[currentTier];
  const pointsInCurrentTier = totalPoints - currentTierPoints;
  const pointsNeededForNext = pointsForNextTier - currentTierPoints;
  const progress = nextTier
    ? Math.round((pointsInCurrentTier / pointsNeededForNext) * 100)
    : 100;

  return {
    currentTier,
    nextTier,
    currentPoints: totalPoints,
    pointsForNextTier,
    progress,
  };
}

/**
 * Get rarity distribution of achievements
 */
export function getRarityDistribution(achievements: Achievement[]): {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
} {
  const distribution = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };

  achievements.forEach((achievement) => {
    const { rarity } = getAchievementRarity(achievement.id);
    distribution[rarity]++;
  });

  return distribution;
}

/**
 * Get rarest achievement
 */
export function getRarestAchievement(
  achievements: Achievement[]
): RarityAchievement | null {
  if (achievements.length === 0) return null;

  let rarest: RarityAchievement | null = null;
  let lowestUnlockRate = 101; // Start above 100 to ensure first achievement is captured

  achievements.forEach((achievement) => {
    const rarityData = getAchievementRarity(achievement.id);
    if (rarityData.unlockRate < lowestUnlockRate) {
      lowestUnlockRate = rarityData.unlockRate;
      rarest = {
        ...achievement,
        ...rarityData,
      };
    }
  });

  return rarest;
}

/**
 * Sort achievements by rarity (legendary first)
 */
export function sortByRarity(achievements: Achievement[]): RarityAchievement[] {
  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };

  return achievements
    .map((achievement) => ({
      ...achievement,
      ...getAchievementRarity(achievement.id),
    }))
    .sort((a, b) => {
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    });
}

/**
 * Get achievements by rarity
 */
export function getAchievementsByRarity(
  achievements: Achievement[],
  rarity: AchievementRarity
): RarityAchievement[] {
  return achievements
    .filter((achievement) => {
      const { rarity: achRarity } = getAchievementRarity(achievement.id);
      return achRarity === rarity;
    })
    .map((achievement) => ({
      ...achievement,
      ...getAchievementRarity(achievement.id),
    }));
}

/**
 * Calculate achievement completion percentage by rarity
 */
export function calculateRarityCompletion(
  achievements: Achievement[]
): Record<
  AchievementRarity,
  { unlocked: number; total: number; percentage: number }
> {
  const totals = {
    common: ACHIEVEMENT_RARITY_DEFINITIONS.filter((d) => d.rarity === "common")
      .length,
    rare: ACHIEVEMENT_RARITY_DEFINITIONS.filter((d) => d.rarity === "rare")
      .length,
    epic: ACHIEVEMENT_RARITY_DEFINITIONS.filter((d) => d.rarity === "epic")
      .length,
    legendary: ACHIEVEMENT_RARITY_DEFINITIONS.filter(
      (d) => d.rarity === "legendary"
    ).length,
  };

  const distribution = getRarityDistribution(achievements);

  return {
    common: {
      unlocked: distribution.common,
      total: totals.common,
      percentage:
        totals.common > 0
          ? Math.round((distribution.common / totals.common) * 100)
          : 0,
    },
    rare: {
      unlocked: distribution.rare,
      total: totals.rare,
      percentage:
        totals.rare > 0
          ? Math.round((distribution.rare / totals.rare) * 100)
          : 0,
    },
    epic: {
      unlocked: distribution.epic,
      total: totals.epic,
      percentage:
        totals.epic > 0
          ? Math.round((distribution.epic / totals.epic) * 100)
          : 0,
    },
    legendary: {
      unlocked: distribution.legendary,
      total: totals.legendary,
      percentage:
        totals.legendary > 0
          ? Math.round((distribution.legendary / totals.legendary) * 100)
          : 0,
    },
  };
}

/**
 * Get next legendary achievement to unlock
 */
export function getNextLegendary(
  achievements: Achievement[]
): { id: string; rarity: AchievementRarity; points: number } | null {
  const unlockedIds = achievements.map((a) => a.id);
  const nextLegendary = ACHIEVEMENT_RARITY_DEFINITIONS.find(
    (def) => def.rarity === "legendary" && !unlockedIds.includes(def.id)
  );

  if (!nextLegendary) return null;

  return {
    id: nextLegendary.id,
    rarity: nextLegendary.rarity,
    points: RARITY_POINTS[nextLegendary.rarity],
  };
}

/**
 * Calculate points until next tier
 */
export function getPointsUntilNextTier(currentPoints: number): {
  pointsNeeded: number;
  nextTier: AchievementTier | null;
} {
  const tierProgress = calculateTierProgress(currentPoints);

  if (!tierProgress.nextTier) {
    return { pointsNeeded: 0, nextTier: null };
  }

  return {
    pointsNeeded: tierProgress.pointsForNextTier - currentPoints,
    nextTier: tierProgress.nextTier,
  };
}

/**
 * Get tier badge for display
 */
export function getTierBadge(tier: AchievementTier): {
  name: string;
  icon: string;
  color: string;
} {
  const config = TIER_CONFIG[tier];
  return {
    name: config.name,
    icon: config.icon,
    color: config.color,
  };
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  tier: AchievementTier;
  achievementCount: number;
  legendaryCount: number;
  rank: number;
}

/**
 * Generate mock leaderboard (replace with real data)
 */
export function generateLeaderboard(
  currentUser: {
    totalPoints: number;
    achievementCount: number;
    legendaryCount: number;
  },
  limit: number = 10
): LeaderboardEntry[] {
  // In real app, fetch from database
  // This is mock data for demonstration
  const mockUsers: Omit<LeaderboardEntry, "rank">[] = [
    {
      userId: "current",
      username: "You",
      totalPoints: currentUser.totalPoints,
      tier: calculateTierProgress(currentUser.totalPoints).currentTier,
      achievementCount: currentUser.achievementCount,
      legendaryCount: currentUser.legendaryCount,
    },
    {
      userId: "1",
      username: "FitnessPro",
      totalPoints: 2500,
      tier: "platinum",
      achievementCount: 20,
      legendaryCount: 4,
    },
    {
      userId: "2",
      username: "GymWarrior",
      totalPoints: 1800,
      tier: "platinum",
      achievementCount: 18,
      legendaryCount: 3,
    },
    {
      userId: "3",
      username: "IronHeart",
      totalPoints: 1200,
      tier: "gold",
      achievementCount: 15,
      legendaryCount: 2,
    },
    {
      userId: "4",
      username: "StrengthSeeker",
      totalPoints: 800,
      tier: "gold",
      achievementCount: 12,
      legendaryCount: 1,
    },
    {
      userId: "5",
      username: "FlexMaster",
      totalPoints: 600,
      tier: "gold",
      achievementCount: 10,
      legendaryCount: 1,
    },
  ];

  // Sort by points and assign ranks
  const sorted = mockUsers
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }))
    .slice(0, limit);

  return sorted;
}
