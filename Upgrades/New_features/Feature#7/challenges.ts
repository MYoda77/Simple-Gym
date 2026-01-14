// Daily & Weekly Challenges System
// Time-limited goals that reset and reward bonus points

export type ChallengeType = 'daily' | 'weekly';
export type ChallengeCategory = 'volume' | 'frequency' | 'variety' | 'streak' | 'special';
export type ChallengeStatus = 'active' | 'completed' | 'expired';

export interface Challenge {
  id: string;
  type: ChallengeType;
  category: ChallengeCategory;
  title: string;
  description: string;
  icon: string;
  
  // Progress
  target: number;
  current: number;
  progress: number; // 0-100
  
  // Rewards
  points: number;
  xp?: number;
  
  // Timing
  startDate: Date;
  endDate: Date;
  status: ChallengeStatus;
  
  // Completion
  completedAt?: Date;
}

/**
 * Challenge templates
 */
export const DAILY_CHALLENGE_TEMPLATES = [
  {
    id: 'daily-workout',
    category: 'frequency' as ChallengeCategory,
    title: 'Daily Grind',
    description: 'Complete 1 workout today',
    icon: '🏋️',
    target: 1,
    points: 10,
    xp: 50,
  },
  {
    id: 'daily-sets-15',
    category: 'volume' as ChallengeCategory,
    title: 'Volume Beast',
    description: 'Complete 15 sets today',
    icon: '💪',
    target: 15,
    points: 15,
    xp: 75,
  },
  {
    id: 'daily-exercises-5',
    category: 'variety' as ChallengeCategory,
    title: 'Exercise Explorer',
    description: 'Try 5 different exercises',
    icon: '🎯',
    target: 5,
    points: 12,
    xp: 60,
  },
  {
    id: 'daily-pr',
    category: 'special' as ChallengeCategory,
    title: 'Personal Best',
    description: 'Set a new PR',
    icon: '🔥',
    target: 1,
    points: 20,
    xp: 100,
  },
  {
    id: 'daily-cardio',
    category: 'variety' as ChallengeCategory,
    title: 'Cardio King',
    description: 'Do 20 minutes cardio',
    icon: '🏃',
    target: 20,
    points: 10,
    xp: 50,
  },
];

export const WEEKLY_CHALLENGE_TEMPLATES = [
  {
    id: 'weekly-workouts-3',
    category: 'frequency' as ChallengeCategory,
    title: 'Consistency Champion',
    description: 'Complete 3 workouts this week',
    icon: '⭐',
    target: 3,
    points: 30,
    xp: 200,
  },
  {
    id: 'weekly-workouts-5',
    category: 'frequency' as ChallengeCategory,
    title: 'Dedication Master',
    description: 'Complete 5 workouts this week',
    icon: '🏆',
    target: 5,
    points: 50,
    xp: 350,
  },
  {
    id: 'weekly-sets-50',
    category: 'volume' as ChallengeCategory,
    title: 'Volume Warrior',
    description: 'Complete 50 sets this week',
    icon: '💥',
    target: 50,
    points: 40,
    xp: 250,
  },
  {
    id: 'weekly-streak',
    category: 'streak' as ChallengeCategory,
    title: 'Week Streak',
    description: 'Work out 7 days straight',
    icon: '🔥',
    target: 7,
    points: 75,
    xp: 500,
  },
  {
    id: 'weekly-variety',
    category: 'variety' as ChallengeCategory,
    title: 'Exercise Variety',
    description: 'Do 15 different exercises',
    icon: '🎨',
    target: 15,
    points: 35,
    xp: 225,
  },
  {
    id: 'weekly-prs-3',
    category: 'special' as ChallengeCategory,
    title: 'PR Hunter',
    description: 'Set 3 new PRs',
    icon: '🎯',
    target: 3,
    points: 60,
    xp: 400,
  },
];

/**
 * Generate daily challenges (3 random)
 */
export function generateDailyChallenges(): Challenge[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Pick 3 random daily challenges
  const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map((template) => ({
    ...template,
    type: 'daily' as ChallengeType,
    current: 0,
    progress: 0,
    startDate: today,
    endDate: tomorrow,
    status: 'active' as ChallengeStatus,
  }));
}

/**
 * Generate weekly challenges (2 random)
 */
export function generateWeeklyChallenges(): Challenge[] {
  const today = new Date();
  const nextMonday = new Date(today);
  const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  // Pick 2 random weekly challenges
  const shuffled = [...WEEKLY_CHALLENGE_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 2);

  return selected.map((template) => ({
    ...template,
    type: 'weekly' as ChallengeType,
    current: 0,
    progress: 0,
    startDate: today,
    endDate: nextMonday,
    status: 'active' as ChallengeStatus,
  }));
}

/**
 * Update challenge progress
 */
export function updateChallengeProgress(
  challenges: Challenge[],
  workoutData: {
    workoutsToday: number;
    setsToday: number;
    exercisesToday: number;
    prToday: boolean;
    workoutsThisWeek: number;
    setsThisWeek: number;
    exercisesThisWeek: number;
    streakDays: number;
    prsThisWeek: number;
  }
): Challenge[] {
  return challenges.map((challenge) => {
    let current = challenge.current;

    // Update based on challenge ID
    if (challenge.id === 'daily-workout') current = workoutData.workoutsToday;
    if (challenge.id === 'daily-sets-15') current = workoutData.setsToday;
    if (challenge.id === 'daily-exercises-5') current = workoutData.exercisesToday;
    if (challenge.id === 'daily-pr') current = workoutData.prToday ? 1 : 0;
    if (challenge.id === 'weekly-workouts-3') current = workoutData.workoutsThisWeek;
    if (challenge.id === 'weekly-workouts-5') current = workoutData.workoutsThisWeek;
    if (challenge.id === 'weekly-sets-50') current = workoutData.setsThisWeek;
    if (challenge.id === 'weekly-streak') current = workoutData.streakDays;
    if (challenge.id === 'weekly-variety') current = workoutData.exercisesThisWeek;
    if (challenge.id === 'weekly-prs-3') current = workoutData.prsThisWeek;

    const progress = Math.min((current / challenge.target) * 100, 100);
    const status: ChallengeStatus = 
      progress === 100 ? 'completed' : 
      new Date() > challenge.endDate ? 'expired' : 
      'active';

    return {
      ...challenge,
      current,
      progress,
      status,
      completedAt: progress === 100 && !challenge.completedAt ? new Date() : challenge.completedAt,
    };
  });
}

/**
 * Check if challenges need refresh
 */
export function shouldRefreshChallenges(challenges: Challenge[]): boolean {
  const now = new Date();
  return challenges.some((c) => now > c.endDate);
}

/**
 * Get completed challenges count
 */
export function getCompletedCount(challenges: Challenge[]): {
  daily: number;
  weekly: number;
} {
  return {
    daily: challenges.filter((c) => c.type === 'daily' && c.status === 'completed').length,
    weekly: challenges.filter((c) => c.type === 'weekly' && c.status === 'completed').length,
  };
}

/**
 * Calculate total challenge points earned
 */
export function calculateChallengePoints(challenges: Challenge[]): number {
  return challenges
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + c.points, 0);
}

/**
 * Get time remaining
 */
export function getTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 24) {
    return `${hours}h ${minutes}m`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
