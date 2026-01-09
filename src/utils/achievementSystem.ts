export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "beginner" | "workout" | "pr" | "streak" | "weekly" | "special";
  condition: (stats: UserStats) => boolean;
  unlockedAt?: string;
  secret?: boolean;
}

export interface UserStats {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  totalPRs: number;
  currentStreak: number;
  maxStreak: number;
  weightLogged: boolean;
  firstWorkoutDate?: string;
  totalWeight?: number;
  uniqueExercises: number;
  earlyMorningWorkouts?: number;
  lateNightWorkouts?: number;
  perfectWeeks?: number;
}

// Define all achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: "first-workout",
    title: "First Steps 🎯",
    description: "Complete your first workout",
    icon: "🎯",
    category: "beginner",
    condition: (stats) => stats.totalWorkouts >= 1,
  },
  {
    id: "first-pr",
    title: "Personal Best 🏆",
    description: "Set your first personal record",
    icon: "🏆",
    category: "beginner",
    condition: (stats) => stats.totalPRs >= 1,
  },
  {
    id: "progress-tracker",
    title: "Progress Tracker ⚖️",
    description: "Log your weight for the first time",
    icon: "⚖️",
    category: "beginner",
    condition: (stats) => stats.weightLogged,
  },

  // Workout Milestones
  {
    id: "5-workouts",
    title: "Getting Started 💪",
    description: "Complete 5 workouts",
    icon: "💪",
    category: "workout",
    condition: (stats) => stats.totalWorkouts >= 5,
  },
  {
    id: "10-workouts",
    title: "Committed 🔥",
    description: "Complete 10 workouts",
    icon: "🔥",
    category: "workout",
    condition: (stats) => stats.totalWorkouts >= 10,
  },
  {
    id: "25-workouts",
    title: "Dedicated ⭐",
    description: "Complete 25 workouts",
    icon: "⭐",
    category: "workout",
    condition: (stats) => stats.totalWorkouts >= 25,
  },
  {
    id: "50-workouts",
    title: "Fitness Enthusiast 🌟",
    description: "Complete 50 workouts",
    icon: "🌟",
    category: "workout",
    condition: (stats) => stats.totalWorkouts >= 50,
  },
  {
    id: "100-workouts",
    title: "Century Club 💯",
    description: "Complete 100 workouts",
    icon: "💯",
    category: "workout",
    condition: (stats) => stats.totalWorkouts >= 100,
  },

  // PR Achievements
  {
    id: "5-prs",
    title: "Record Breaker 📈",
    description: "Set 5 personal records",
    icon: "📈",
    category: "pr",
    condition: (stats) => stats.totalPRs >= 5,
  },
  {
    id: "10-prs",
    title: "PR Machine 🎖️",
    description: "Set 10 personal records",
    icon: "🎖️",
    category: "pr",
    condition: (stats) => stats.totalPRs >= 10,
  },
  {
    id: "25-prs",
    title: "Strength Master 👑",
    description: "Set 25 personal records",
    icon: "👑",
    category: "pr",
    condition: (stats) => stats.totalPRs >= 25,
  },

  // Streak Achievements
  {
    id: "3-day-streak",
    title: "On a Roll 🔥",
    description: "Complete workouts for 3 consecutive days",
    icon: "🔥",
    category: "streak",
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: "7-day-streak",
    title: "Week Warrior ⚡",
    description: "Complete workouts for 7 consecutive days",
    icon: "⚡",
    category: "streak",
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: "14-day-streak",
    title: "Unstoppable 💥",
    description: "Complete workouts for 14 consecutive days",
    icon: "💥",
    category: "streak",
    condition: (stats) => stats.currentStreak >= 14,
  },
  {
    id: "30-day-streak",
    title: "Monthly Mastery 🏅",
    description: "Complete workouts for 30 consecutive days",
    icon: "🏅",
    category: "streak",
    condition: (stats) => stats.currentStreak >= 30,
  },

  // Weekly Achievements
  {
    id: "consistent-week",
    title: "Consistent Week 📅",
    description: "Complete 3 workouts in one week",
    icon: "📅",
    category: "weekly",
    condition: (stats) => stats.thisWeekWorkouts >= 3,
  },
  {
    id: "power-week",
    title: "Power Week ⚡",
    description: "Complete 5 workouts in one week",
    icon: "⚡",
    category: "weekly",
    condition: (stats) => stats.thisWeekWorkouts >= 5,
  },

  // Special Achievements
  {
    id: "one-month",
    title: "One Month Strong 🎊",
    description: "30 days since your first workout",
    icon: "🎊",
    category: "special",
    condition: (stats) => {
      if (!stats.firstWorkoutDate) return false;
      const daysSince = Math.floor(
        (Date.now() - new Date(stats.firstWorkoutDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysSince >= 30;
    },
  },
  {
    id: "10-exercises",
    title: "Exercise Explorer 🗺️",
    description: "Try 10 different exercises",
    icon: "🗺️",
    category: "special",
    condition: (stats) => stats.uniqueExercises >= 10,
  },
  {
    id: "25-exercises",
    title: "Movement Master 🌍",
    description: "Try 25 different exercises",
    icon: "🌍",
    category: "special",
    condition: (stats) => stats.uniqueExercises >= 25,
  },

  // SECRET ACHIEVEMENTS - Hidden until unlocked
  {
    id: "secret-early-bird",
    title: "Early Bird 🌅",
    description: "Complete a workout before 6 AM",
    icon: "🌅",
    category: "special",
    condition: (stats) => (stats.earlyMorningWorkouts || 0) >= 1,
    secret: true,
  },
  {
    id: "secret-night-owl",
    title: "Night Owl 🦉",
    description: "Complete a workout after 10 PM",
    icon: "🦉",
    category: "special",
    condition: (stats) => (stats.lateNightWorkouts || 0) >= 1,
    secret: true,
  },
  {
    id: "secret-perfect-week",
    title: "Perfect Week ⭐",
    description: "Complete all scheduled workouts in a week",
    icon: "⭐",
    category: "special",
    condition: (stats) => (stats.perfectWeeks || 0) >= 1,
    secret: true,
  },
];

/**
 * Check which achievements should be unlocked based on current stats
 * @param stats Current user statistics
 * @param currentAchievements Already unlocked achievement IDs
 * @returns Array of newly unlocked achievements
 */
export function checkAchievements(
  stats: UserStats,
  currentAchievements: Achievement[]
): Achievement[] {
  const unlockedIds = new Set(currentAchievements.map((a) => a.id));
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.has(achievement.id)) continue;

    // Check if condition is met
    if (achievement.condition(stats)) {
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}

/**
 * Calculate current workout streak
 * @param workoutHistory Array of workout records with dates
 * @returns Current consecutive days with workouts
 */
export function calculateStreak(workoutHistory: Array<{ date: string }>): {
  currentStreak: number;
  maxStreak: number;
} {
  if (workoutHistory.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort by date descending (most recent first)
  const sortedHistory = [...workoutHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates
  const uniqueDates = new Set(
    sortedHistory.map((w) => new Date(w.date).toISOString().split("T")[0])
  );
  const dateArray = Array.from(uniqueDates).sort().reverse();

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;
  let previousDate = new Date(dateArray[0]);

  // Check if streak is still active (today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWorkout = new Date(dateArray[0]);
  lastWorkout.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor(
    (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff <= 1) {
    currentStreak = 1;

    // Calculate current streak
    for (let i = 1; i < dateArray.length; i++) {
      const currentDate = new Date(dateArray[i]);
      const diff = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        currentStreak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }
  }

  // Calculate max streak
  tempStreak = 1;
  for (let i = 1; i < dateArray.length; i++) {
    const currentDate = new Date(dateArray[i]);
    const prevDate = new Date(dateArray[i - 1]);
    const diff = Math.floor(
      (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  maxStreak = Math.max(maxStreak, currentStreak);

  return { currentStreak, maxStreak };
}

/**
 * Calculate workouts completed this week
 * @param workoutHistory Array of workout records with dates
 * @returns Number of workouts this week
 */
export function getThisWeekWorkouts(
  workoutHistory: Array<{ date: string }>
): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  return workoutHistory.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= startOfWeek;
  }).length;
}
