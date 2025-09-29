export interface Exercise {
  id: number;
  name: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // Keep for backwards compatibility
  complexity: 'low' | 'medium' | 'high';
  primaryMuscle: string;
  instructions: string;
  movementPattern?: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'isolation';
  requiresSpotter?: boolean;
  prerequisites?: string[];
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
}

export interface Workout {
  duration: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutRecord {
  date: string;
  name: string;
  duration: number;
  exercises: number;
  totalSets: number;
}

export interface ProgressData {
  date: string;
  weight: number;
  bodyFat: number;
}

export type ViewType = 'dashboard' | 'schedule' | 'workouts' | 'exercises' | 'workout';

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'triceps' | 'biceps' | 'arms' | 'all';