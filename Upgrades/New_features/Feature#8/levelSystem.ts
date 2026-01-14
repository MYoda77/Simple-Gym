// Level & XP System
// RPG-style progression with rewards and unlocks

export interface UserLevel {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  totalXP: number;
  progress: number; // 0-100
}

export interface XPSource {
  action: string;
  amount: number;
  timestamp: Date;
}

export interface LevelReward {
  level: number;
  unlocks: string[];
  points: number;
  title?: string;
}

/**
 * XP earnings from different actions
 */
export const XP_REWARDS = {
  // Workouts
  workoutComplete: 100,
  workoutStreak: 50,
  firstWorkoutOfDay: 25,
  
  // Volume
  perSet: 5,
  perRep: 1,
  
  // PRs
  personalRecord: 150,
  weightIncrease: 75,
  
  // Achievements
  achievementCommon: 50,
  achievementRare: 150,
  achievementEpic: 300,
  achievementLegendary: 1000,
  
  // Challenges
  dailyChallengeComplete: 50,
  weeklyChallengeComplete: 200,
  allDailiesComplete: 100, // Bonus
  
  // Social
  workoutShared: 20,
  commentReceived: 10,
  
  // Misc
  formTipsViewed: 5,
  exerciseAdded: 10,
};

/**
 * Calculate XP needed for level (exponential curve)
 */
export function calculateXPForLevel(level: number): number {
  // Formula: 100 * level^1.5
  // Level 1: 100 XP
  // Level 10: 3,162 XP
  // Level 50: 35,355 XP
  // Level 100: 100,000 XP
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate level from total XP
 */
export function calculateLevelFromXP(totalXP: number): UserLevel {
  let level = 1;
  let xpUsed = 0;
  
  // Find current level
  while (xpUsed + calculateXPForLevel(level) <= totalXP) {
    xpUsed += calculateXPForLevel(level);
    level++;
  }
  
  const currentXP = totalXP - xpUsed;
  const xpForNextLevel = calculateXPForLevel(level);
  const progress = (currentXP / xpForNextLevel) * 100;
  
  return {
    level,
    currentXP,
    xpForNextLevel,
    totalXP,
    progress,
  };
}

/**
 * Add XP and return new level data
 */
export function addXP(currentTotalXP: number, xpToAdd: number): {
  newLevel: UserLevel;
  leveledUp: boolean;
  levelsGained: number;
} {
  const oldLevel = calculateLevelFromXP(currentTotalXP);
  const newLevel = calculateLevelFromXP(currentTotalXP + xpToAdd);
  
  return {
    newLevel,
    leveledUp: newLevel.level > oldLevel.level,
    levelsGained: newLevel.level - oldLevel.level,
  };
}

/**
 * Level titles
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: '🥚 Newbie',
  5: '🌱 Beginner',
  10: '💪 Regular',
  15: '⚡ Committed',
  20: '🔥 Dedicated',
  25: '🏋️ Advanced',
  30: '💎 Expert',
  40: '🏆 Master',
  50: '👑 Champion',
  75: '⭐ Legend',
  100: '🌟 Immortal',
};

/**
 * Get title for level
 */
export function getLevelTitle(level: number): string {
  const titles = Object.entries(LEVEL_TITLES)
    .map(([lvl, title]) => ({ level: parseInt(lvl), title }))
    .sort((a, b) => b.level - a.level);
  
  for (const { level: reqLevel, title } of titles) {
    if (level >= reqLevel) return title;
  }
  
  return LEVEL_TITLES[1];
}

/**
 * Level rewards/unlocks
 */
export const LEVEL_REWARDS: LevelReward[] = [
  { level: 5, unlocks: ['Custom workout templates'], points: 50 },
  { level: 10, unlocks: ['Exercise notes feature'], points: 100 },
  { level: 15, unlocks: ['Advanced analytics'], points: 150 },
  { level: 20, unlocks: ['Custom themes'], points: 200 },
  { level: 25, unlocks: ['Workout sharing'], points: 250 },
  { level: 30, unlocks: ['Premium exercises'], points: 300 },
  { level: 40, unlocks: ['AI training plans'], points: 500 },
  { level: 50, unlocks: ['Master badge', 'Custom profile'], points: 1000 },
  { level: 75, unlocks: ['Legend status'], points: 2000 },
  { level: 100, unlocks: ['Immortal badge', 'Hall of Fame'], points: 5000 },
];

/**
 * Get rewards for level
 */
export function getLevelRewards(level: number): LevelReward | null {
  return LEVEL_REWARDS.find((r) => r.level === level) || null;
}

/**
 * Get next reward
 */
export function getNextReward(currentLevel: number): LevelReward | null {
  return LEVEL_REWARDS.find((r) => r.level > currentLevel) || null;
}

/**
 * Calculate workout XP
 */
export function calculateWorkoutXP(workout: {
  sets: number;
  reps: number;
  isFirstToday: boolean;
  hadPR: boolean;
  streakBonus: boolean;
}): { total: number; breakdown: { source: string; amount: number }[] } {
  const breakdown: { source: string; amount: number }[] = [];
  
  // Base workout XP
  breakdown.push({ source: 'Workout Complete', amount: XP_REWARDS.workoutComplete });
  
  // First workout bonus
  if (workout.isFirstToday) {
    breakdown.push({ source: 'First Workout Today', amount: XP_REWARDS.firstWorkoutOfDay });
  }
  
  // Streak bonus
  if (workout.streakBonus) {
    breakdown.push({ source: 'Streak Bonus', amount: XP_REWARDS.workoutStreak });
  }
  
  // Volume XP
  const setsXP = workout.sets * XP_REWARDS.perSet;
  const repsXP = workout.reps * XP_REWARDS.perRep;
  breakdown.push({ source: `${workout.sets} Sets`, amount: setsXP });
  breakdown.push({ source: `${workout.reps} Reps`, amount: repsXP });
  
  // PR bonus
  if (workout.hadPR) {
    breakdown.push({ source: 'Personal Record!', amount: XP_REWARDS.personalRecord });
  }
  
  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
  
  return { total, breakdown };
}

/**
 * XP multipliers for events
 */
export function getXPMultiplier(): number {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  
  // Weekend bonus (Saturday & Sunday)
  if (day === 0 || day === 6) return 1.5;
  
  // Early bird bonus (5am-8am)
  if (hour >= 5 && hour < 8) return 1.2;
  
  // Night owl bonus (9pm-11pm)
  if (hour >= 21 && hour < 23) return 1.2;
  
  return 1.0;
}

/**
 * Level leaderboard entry
 */
export interface LevelLeaderboard {
  userId: string;
  username: string;
  level: number;
  totalXP: number;
  title: string;
  rank: number;
}

/**
 * Generate mock leaderboard
 */
export function generateLevelLeaderboard(
  currentUser: { level: number; totalXP: number },
  limit: number = 10
): LevelLeaderboard[] {
  const mockUsers = [
    { userId: 'current', username: 'You', level: currentUser.level, totalXP: currentUser.totalXP },
    { userId: '1', username: 'IronGiant', level: 87, totalXP: 450000 },
    { userId: '2', username: 'FlexMaster', level: 72, totalXP: 320000 },
    { userId: '3', username: 'BeastMode', level: 65, totalXP: 280000 },
    { userId: '4', username: 'PowerLift', level: 58, totalXP: 240000 },
    { userId: '5', username: 'FitFreak', level: 52, totalXP: 200000 },
  ];
  
  return mockUsers
    .map((user) => ({
      ...user,
      title: getLevelTitle(user.level),
      rank: 0,
    }))
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((user, index) => ({ ...user, rank: index + 1 }))
    .slice(0, limit);
}

/**
 * Daily XP summary
 */
export interface DailyXPSummary {
  date: string;
  totalXP: number;
  sources: { source: string; amount: number }[];
}

/**
 * Calculate XP from achievement unlock
 */
export function getAchievementXP(rarity: 'common' | 'rare' | 'epic' | 'legendary'): number {
  return XP_REWARDS[`achievement${rarity.charAt(0).toUpperCase() + rarity.slice(1)}` as keyof typeof XP_REWARDS] as number;
}
