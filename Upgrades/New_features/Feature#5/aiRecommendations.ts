// AI Workout Recommendation Engine
// Analyzes workout patterns and provides intelligent suggestions

import { WorkoutRecord, Exercise } from '@/types/gym';
import { UserStats } from '@/utils/achievementSystem';

/**
 * Recommendation types
 */
export type RecommendationType = 
  | 'next-workout'        // What to do next
  | 'muscle-balance'      // Fix imbalances
  | 'recovery'           // Rest day suggestion
  | 'progression'        // Progressive overload
  | 'variety'            // Try new exercises
  | 'volume'             // Adjust training volume
  | 'frequency'          // Training frequency adjustment
  | 'deload';            // Deload week needed

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Recommendation structure
 */
export interface WorkoutRecommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  reasoning: string[];
  action: {
    type: 'workout' | 'rest' | 'adjust' | 'explore';
    details: any;
  };
  confidence: number; // 0-100
  expiresAt?: Date;
  dismissable: boolean;
}

/**
 * Training analysis data
 */
interface TrainingAnalysis {
  // Volume metrics
  totalSetsLastWeek: number;
  totalSetsLastMonth: number;
  avgSetsPerWorkout: number;
  volumeTrend: 'increasing' | 'stable' | 'decreasing';
  
  // Frequency
  workoutsLastWeek: number;
  workoutsLastMonth: number;
  avgWorkoutsPerWeek: number;
  
  // Muscle group balance
  muscleGroupDistribution: Record<string, number>;
  undertrainedMuscles: string[];
  overtrainedMuscles: string[];
  
  // Recovery indicators
  daysSinceLastWorkout: number;
  consecutiveWorkoutDays: number;
  restDaysLastWeek: number;
  
  // Progression
  prCount: number;
  daysSinceLastPR: number;
  progressionRate: 'fast' | 'normal' | 'slow' | 'stalled';
  
  // Variety
  uniqueExercisesLastMonth: number;
  mostFrequentExercises: string[];
  leastRecentExercises: string[];
  
  // Patterns
  preferredWorkoutDays: string[];
  preferredWorkoutTime: string;
  avgWorkoutDuration: number;
}

/**
 * AI Recommendation Engine
 */
export class WorkoutRecommendationEngine {
  private workoutHistory: WorkoutRecord[];
  private personalRecords: Record<string, number>;
  private exerciseDatabase: Exercise[];
  private userStats: UserStats;

  constructor(
    workoutHistory: WorkoutRecord[],
    personalRecords: Record<string, number>,
    exerciseDatabase: Exercise[],
    userStats: UserStats
  ) {
    this.workoutHistory = workoutHistory;
    this.personalRecords = personalRecords;
    this.exerciseDatabase = exerciseDatabase;
    this.userStats = userStats;
  }

  /**
   * Generate all recommendations
   */
  generateRecommendations(): WorkoutRecommendation[] {
    const analysis = this.analyzeTraining();
    const recommendations: WorkoutRecommendation[] = [];

    // Generate different types of recommendations
    recommendations.push(...this.generateNextWorkoutRecommendations(analysis));
    recommendations.push(...this.generateMuscleBalanceRecommendations(analysis));
    recommendations.push(...this.generateRecoveryRecommendations(analysis));
    recommendations.push(...this.generateProgressionRecommendations(analysis));
    recommendations.push(...this.generateVarietyRecommendations(analysis));
    recommendations.push(...this.generateVolumeRecommendations(analysis));
    recommendations.push(...this.generateDeloadRecommendations(analysis));

    // Sort by priority and confidence
    return recommendations
      .filter(r => r.confidence >= 60) // Only show confident recommendations
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      })
      .slice(0, 10); // Top 10 recommendations
  }

  /**
   * Analyze training patterns
   */
  private analyzeTraining(): TrainingAnalysis {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Recent workouts
    const lastWeekWorkouts = this.workoutHistory.filter(w => 
      new Date(w.date) >= oneWeekAgo
    );
    const lastMonthWorkouts = this.workoutHistory.filter(w => 
      new Date(w.date) >= oneMonthAgo
    );

    // Volume calculations
    const totalSetsLastWeek = lastWeekWorkouts.reduce((sum, w) => sum + (w.totalSets || 0), 0);
    const totalSetsLastMonth = lastMonthWorkouts.reduce((sum, w) => sum + (w.totalSets || 0), 0);

    // Muscle group distribution
    const muscleGroupCounts: Record<string, number> = {};
    lastMonthWorkouts.forEach(workout => {
      const exercise = this.exerciseDatabase.find(e => e.name === workout.name);
      if (exercise?.primaryMuscle) {
        muscleGroupCounts[exercise.primaryMuscle] = 
          (muscleGroupCounts[exercise.primaryMuscle] || 0) + 1;
      }
    });

    // Find imbalances
    const avgCount = Object.values(muscleGroupCounts).reduce((a, b) => a + b, 0) / 
                     Math.max(Object.keys(muscleGroupCounts).length, 1);
    const undertrainedMuscles = Object.entries(muscleGroupCounts)
      .filter(([_, count]) => count < avgCount * 0.5)
      .map(([muscle]) => muscle);
    const overtrainedMuscles = Object.entries(muscleGroupCounts)
      .filter(([_, count]) => count > avgCount * 1.5)
      .map(([muscle]) => muscle);

    // Recovery metrics
    const sortedWorkouts = [...this.workoutHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const daysSinceLastWorkout = sortedWorkouts.length > 0
      ? Math.floor((now.getTime() - new Date(sortedWorkouts[0].date).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Consecutive workout days
    let consecutiveWorkoutDays = 0;
    const workoutDates = new Set(
      this.workoutHistory.map(w => new Date(w.date).toDateString())
    );
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      if (workoutDates.has(checkDate.toDateString())) {
        consecutiveWorkoutDays++;
      } else {
        break;
      }
    }

    // PR analysis
    const daysSinceLastPR = this.calculateDaysSinceLastPR();
    const progressionRate = this.calculateProgressionRate();

    // Exercise variety
    const uniqueExercises = new Set(lastMonthWorkouts.map(w => w.name));
    const exerciseCounts: Record<string, number> = {};
    lastMonthWorkouts.forEach(w => {
      exerciseCounts[w.name] = (exerciseCounts[w.name] || 0) + 1;
    });
    const mostFrequentExercises = Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    return {
      totalSetsLastWeek,
      totalSetsLastMonth,
      avgSetsPerWorkout: lastWeekWorkouts.length > 0 
        ? totalSetsLastWeek / lastWeekWorkouts.length 
        : 0,
      volumeTrend: this.calculateVolumeTrend(),
      workoutsLastWeek: lastWeekWorkouts.length,
      workoutsLastMonth: lastMonthWorkouts.length,
      avgWorkoutsPerWeek: lastMonthWorkouts.length / 4,
      muscleGroupDistribution: muscleGroupCounts,
      undertrainedMuscles,
      overtrainedMuscles,
      daysSinceLastWorkout,
      consecutiveWorkoutDays,
      restDaysLastWeek: 7 - lastWeekWorkouts.length,
      prCount: Object.keys(this.personalRecords).length,
      daysSinceLastPR,
      progressionRate,
      uniqueExercisesLastMonth: uniqueExercises.size,
      mostFrequentExercises,
      leastRecentExercises: this.findLeastRecentExercises(),
      preferredWorkoutDays: this.findPreferredWorkoutDays(),
      preferredWorkoutTime: this.findPreferredWorkoutTime(),
      avgWorkoutDuration: this.calculateAvgWorkoutDuration(),
    };
  }

  /**
   * Next workout recommendations
   */
  private generateNextWorkoutRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Suggest workout based on last trained muscle groups
    if (analysis.daysSinceLastWorkout <= 2 && analysis.undertrainedMuscles.length > 0) {
      const targetMuscle = analysis.undertrainedMuscles[0];
      recommendations.push({
        id: 'next-workout-balance',
        type: 'next-workout',
        priority: 'high',
        title: `Train ${targetMuscle} Next`,
        description: `Your ${targetMuscle.toLowerCase()} haven't been trained as much recently. Focus on them in your next workout.`,
        reasoning: [
          `${targetMuscle} trained only ${analysis.muscleGroupDistribution[targetMuscle] || 0} times this month`,
          'Balanced training prevents imbalances and injury',
          'Weak points respond well to increased frequency',
        ],
        action: {
          type: 'workout',
          details: {
            targetMuscle,
            suggestedExercises: this.findExercisesForMuscle(targetMuscle),
          },
        },
        confidence: 85,
        dismissable: true,
      });
    }

    // Suggest specific workout type based on pattern
    const preferredDay = analysis.preferredWorkoutDays[0];
    if (preferredDay && analysis.daysSinceLastWorkout === 0) {
      recommendations.push({
        id: 'next-workout-pattern',
        type: 'next-workout',
        priority: 'medium',
        title: `${preferredDay} Workout Ready`,
        description: `You typically train on ${preferredDay}s. Here's a workout that fits your pattern.`,
        reasoning: [
          `You've completed ${analysis.workoutsLastMonth} workouts this month`,
          'Consistency builds habits',
          'Your body adapts to regular schedules',
        ],
        action: {
          type: 'workout',
          details: {
            day: preferredDay,
            time: analysis.preferredWorkoutTime,
          },
        },
        confidence: 75,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Muscle balance recommendations
   */
  private generateMuscleBalanceRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Undertrained muscles
    if (analysis.undertrainedMuscles.length > 0) {
      analysis.undertrainedMuscles.forEach((muscle, idx) => {
        if (idx < 2) { // Top 2 undertrained
          recommendations.push({
            id: `balance-undertrained-${muscle}`,
            type: 'muscle-balance',
            priority: idx === 0 ? 'high' : 'medium',
            title: `Increase ${muscle} Training`,
            description: `Your ${muscle.toLowerCase()} are lagging. Add 2-3 more exercises per week.`,
            reasoning: [
              `${muscle} trained ${analysis.muscleGroupDistribution[muscle] || 0}x vs average ${Math.round(Object.values(analysis.muscleGroupDistribution).reduce((a, b) => a + b, 0) / Object.keys(analysis.muscleGroupDistribution).length)}x`,
              'Muscle imbalances can lead to injury',
              'Balanced development improves overall strength',
            ],
            action: {
              type: 'workout',
              details: {
                targetMuscle: muscle,
                suggestedSets: '3-4 sets',
                frequency: '2-3 times per week',
                exercises: this.findExercisesForMuscle(muscle),
              },
            },
            confidence: 90,
            dismissable: true,
          });
        }
      });
    }

    // Overtrained muscles
    if (analysis.overtrainedMuscles.length > 0) {
      const muscle = analysis.overtrainedMuscles[0];
      recommendations.push({
        id: `balance-overtrained-${muscle}`,
        type: 'muscle-balance',
        priority: 'medium',
        title: `Reduce ${muscle} Volume`,
        description: `You're training ${muscle.toLowerCase()} very frequently. Consider reducing volume to allow recovery.`,
        reasoning: [
          `${muscle} trained ${analysis.muscleGroupDistribution[muscle]}x this month`,
          'Overtraining a muscle group can lead to fatigue',
          'Recovery is when muscles grow',
        ],
        action: {
          type: 'adjust',
          details: {
            targetMuscle: muscle,
            recommendation: 'Reduce by 1-2 sessions per week',
          },
        },
        confidence: 80,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Recovery recommendations
   */
  private generateRecoveryRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Too many consecutive workout days
    if (analysis.consecutiveWorkoutDays >= 5) {
      recommendations.push({
        id: 'recovery-consecutive-days',
        type: 'recovery',
        priority: 'urgent',
        title: 'Rest Day Needed',
        description: `You've worked out ${analysis.consecutiveWorkoutDays} days in a row. Take a rest day to recover.`,
        reasoning: [
          'Recovery is crucial for muscle growth',
          'Overtraining can lead to injury and burnout',
          'CNS needs time to recover',
          'Sleep and nutrition optimize during rest',
        ],
        action: {
          type: 'rest',
          details: {
            duration: '1-2 days',
            activities: ['Light stretching', 'Walking', 'Meditation'],
          },
        },
        confidence: 95,
        dismissable: false,
      });
    }

    // No rest days last week
    if (analysis.restDaysLastWeek === 0 && analysis.workoutsLastWeek >= 5) {
      recommendations.push({
        id: 'recovery-no-rest',
        type: 'recovery',
        priority: 'high',
        title: 'Schedule Rest Days',
        description: 'You had no rest days last week. Plan at least 1-2 rest days per week.',
        reasoning: [
          'Muscles grow during rest, not training',
          'Risk of overtraining syndrome',
          'Mental recovery is equally important',
        ],
        action: {
          type: 'rest',
          details: {
            recommendation: '1-2 rest days per week',
          },
        },
        confidence: 88,
        dismissable: true,
      });
    }

    // Been a while since last workout
    if (analysis.daysSinceLastWorkout >= 4 && analysis.daysSinceLastWorkout < 14) {
      recommendations.push({
        id: 'recovery-comeback',
        type: 'recovery',
        priority: 'medium',
        title: 'Welcome Back!',
        description: `It's been ${analysis.daysSinceLastWorkout} days. Start with a lighter workout to ease back in.`,
        reasoning: [
          'After a break, start with 60-70% of normal intensity',
          'Reduces injury risk',
          'Allows body to readapt',
        ],
        action: {
          type: 'workout',
          details: {
            intensity: 'Light to moderate',
            focus: 'Movement quality over weight',
          },
        },
        confidence: 85,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Progressive overload recommendations
   */
  private generateProgressionRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Time for PR attempts
    if (analysis.daysSinceLastPR >= 14 && analysis.progressionRate !== 'stalled') {
      const topExercises = analysis.mostFrequentExercises.slice(0, 2);
      topExercises.forEach(exercise => {
        recommendations.push({
          id: `progression-pr-${exercise}`,
          type: 'progression',
          priority: 'high',
          title: `Try for PR on ${exercise}`,
          description: `It's been ${analysis.daysSinceLastPR} days since your last PR. You're ready!`,
          reasoning: [
            'Consistent training builds strength',
            'Progressive overload drives growth',
            'You\'ve been training regularly',
          ],
          action: {
            type: 'workout',
            details: {
              exercise,
              suggestion: 'Add 2.5-5kg to your current max',
              warmup: 'Do 3-4 warmup sets before PR attempt',
            },
          },
          confidence: 82,
          dismissable: true,
        });
      });
    }

    // Stalled progression
    if (analysis.progressionRate === 'stalled' && analysis.daysSinceLastPR >= 30) {
      recommendations.push({
        id: 'progression-stalled',
        type: 'progression',
        priority: 'high',
        title: 'Break Through Plateau',
        description: 'You haven\'t set a PR in a while. Try these strategies to break through.',
        reasoning: [
          'Plateaus are normal but can be overcome',
          'Changing stimulus can restart progress',
          'Deload week might help',
        ],
        action: {
          type: 'adjust',
          details: {
            strategies: [
              'Try different rep ranges (6-8 instead of 10-12)',
              'Add variation exercises',
              'Increase training frequency',
              'Consider a deload week',
            ],
          },
        },
        confidence: 75,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Exercise variety recommendations
   */
  private generateVarietyRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Low exercise variety
    if (analysis.uniqueExercisesLastMonth < 8) {
      recommendations.push({
        id: 'variety-low',
        type: 'variety',
        priority: 'medium',
        title: 'Add Exercise Variety',
        description: `You've only done ${analysis.uniqueExercisesLastMonth} different exercises this month. Try new movements!`,
        reasoning: [
          'Variety prevents adaptation and plateaus',
          'Different exercises target muscles from new angles',
          'Keeps training interesting',
        ],
        action: {
          type: 'explore',
          details: {
            suggestion: 'Try 2-3 new exercises this week',
            categories: this.suggestNewExerciseCategories(analysis),
          },
        },
        confidence: 70,
        dismissable: true,
      });
    }

    // Exercises not done in a while
    if (analysis.leastRecentExercises.length > 0) {
      const oldExercise = analysis.leastRecentExercises[0];
      recommendations.push({
        id: 'variety-revisit',
        type: 'variety',
        priority: 'low',
        title: `Revisit ${oldExercise}`,
        description: 'You haven\'t done this exercise in a while. Consider adding it back.',
        reasoning: [
          'Rotating exercises provides new stimulus',
          'May have gotten stronger in meantime',
        ],
        action: {
          type: 'workout',
          details: {
            exercise: oldExercise,
          },
        },
        confidence: 65,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Training volume recommendations
   */
  private generateVolumeRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // Volume too low
    if (analysis.avgWorkoutsPerWeek < 2 && this.workoutHistory.length > 4) {
      recommendations.push({
        id: 'volume-increase-frequency',
        type: 'volume',
        priority: 'medium',
        title: 'Increase Training Frequency',
        description: `You're averaging ${analysis.avgWorkoutsPerWeek.toFixed(1)} workouts per week. Aim for 3-4.`,
        reasoning: [
          'More frequency = more muscle growth',
          'Consistency is key to progress',
          '3-4 sessions per week is optimal for most goals',
        ],
        action: {
          type: 'adjust',
          details: {
            target: '3-4 workouts per week',
          },
        },
        confidence: 80,
        dismissable: true,
      });
    }

    // Volume very high
    if (analysis.avgWorkoutsPerWeek > 6) {
      recommendations.push({
        id: 'volume-reduce-frequency',
        type: 'volume',
        priority: 'medium',
        title: 'Consider Reducing Frequency',
        description: `You're training ${analysis.avgWorkoutsPerWeek.toFixed(1)} times per week. Make sure you're recovering.`,
        reasoning: [
          'More isn\'t always better',
          'Recovery is crucial',
          'Risk of overtraining',
        ],
        action: {
          type: 'adjust',
          details: {
            target: '4-5 workouts per week with adequate rest',
          },
        },
        confidence: 75,
        dismissable: true,
      });
    }

    return recommendations;
  }

  /**
   * Deload recommendations
   */
  private generateDeloadRecommendations(
    analysis: TrainingAnalysis
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // High volume for extended period
    const needsDeload = 
      analysis.workoutsLastMonth >= 16 && 
      analysis.consecutiveWorkoutDays >= 3 &&
      analysis.progressionRate === 'stalled';

    if (needsDeload) {
      recommendations.push({
        id: 'deload-needed',
        type: 'deload',
        priority: 'high',
        title: 'Time for Deload Week',
        description: 'You\'ve been training hard. Take a deload week to supercompensate.',
        reasoning: [
          'Accumulated fatigue masks fitness gains',
          'Deload allows body to fully recover',
          'Often leads to PR attempts after',
          'Reduces injury risk',
        ],
        action: {
          type: 'adjust',
          details: {
            protocol: 'Reduce weight by 40-50% but keep exercises',
            duration: '1 week',
            benefit: 'Return stronger and refreshed',
          },
        },
        confidence: 85,
        dismissable: true,
      });
    }

    return recommendations;
  }

  // Helper methods
  private calculateVolumeTrend(): 'increasing' | 'stable' | 'decreasing' {
    // Implement volume trend calculation
    return 'stable';
  }

  private calculateDaysSinceLastPR(): number {
    // Calculate days since last PR was set
    return 7; // Placeholder
  }

  private calculateProgressionRate(): 'fast' | 'normal' | 'slow' | 'stalled' {
    const prCount = Object.keys(this.personalRecords).length;
    const workoutCount = this.workoutHistory.length;
    
    if (workoutCount === 0) return 'normal';
    
    const prRate = prCount / workoutCount;
    
    if (prRate > 0.15) return 'fast';
    if (prRate > 0.08) return 'normal';
    if (prRate > 0.03) return 'slow';
    return 'stalled';
  }

  private findLeastRecentExercises(): string[] {
    // Find exercises not done recently
    return [];
  }

  private findPreferredWorkoutDays(): string[] {
    const dayCounts: Record<string, number> = {};
    this.workoutHistory.forEach(workout => {
      const day = new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    
    return Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);
  }

  private findPreferredWorkoutTime(): string {
    // Analyze workout times
    return 'Evening';
  }

  private calculateAvgWorkoutDuration(): number {
    if (this.workoutHistory.length === 0) return 0;
    const total = this.workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    return Math.round(total / this.workoutHistory.length);
  }

  private findExercisesForMuscle(muscle: string): string[] {
    return this.exerciseDatabase
      .filter(e => e.primaryMuscle === muscle)
      .slice(0, 5)
      .map(e => e.name);
  }

  private suggestNewExerciseCategories(analysis: TrainingAnalysis): string[] {
    // Suggest categories to explore
    return ['Cables', 'Dumbbells', 'Bodyweight'];
  }
}

/**
 * Quick recommendation generator (simplified API)
 */
export function generateWorkoutRecommendations(
  workoutHistory: WorkoutRecord[],
  personalRecords: Record<string, number>,
  exerciseDatabase: Exercise[],
  userStats: UserStats
): WorkoutRecommendation[] {
  const engine = new WorkoutRecommendationEngine(
    workoutHistory,
    personalRecords,
    exerciseDatabase,
    userStats
  );
  
  return engine.generateRecommendations();
}
