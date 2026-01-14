import { Workout, WorkoutExercise } from '@/types/gym';
import { exerciseDatabase } from '@/data/exercises';

export interface WorkoutMetrics {
  totalDuration: number; // in minutes
  totalExercises: number;
  totalSets: number;
  totalReps: number;
  primaryMuscles: string[];
  equipmentNeeded: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  complexityLevel: 'low' | 'medium' | 'high';
}

export function calculateWorkoutMetrics(workout: Workout): WorkoutMetrics {
  const allExercises = Object.values(exerciseDatabase).flat();
  
  let totalSets = 0;
  let totalReps = 0;
  let totalRestTime = 0;
  let exerciseTime = 0;
  
  const primaryMuscles = new Set<string>();
  const equipmentNeeded = new Set<string>();
  const difficulties: string[] = [];
  const complexities: string[] = [];

  workout.exercises.forEach((workoutExercise: WorkoutExercise) => {
    const exerciseData = allExercises.find(ex => ex.name === workoutExercise.name);
    
    if (exerciseData) {
      primaryMuscles.add(exerciseData.primaryMuscle);
      equipmentNeeded.add(exerciseData.equipment);
      difficulties.push(exerciseData.difficulty);
      complexities.push(exerciseData.complexity);
    }

    totalSets += workoutExercise.sets;
    totalReps += workoutExercise.sets * workoutExercise.reps;
    
    // Estimate time per rep (3 seconds average)
    exerciseTime += workoutExercise.sets * workoutExercise.reps * 3;
    
    // Rest time between sets (subtract 1 because no rest after last set)
    totalRestTime += (workoutExercise.sets - 1) * workoutExercise.rest;
  });

  // Add time between exercises (1 minute average)
  const timeBetweenExercises = Math.max(0, (workout.exercises.length - 1) * 60);
  
  const totalDuration = Math.ceil((exerciseTime + totalRestTime + timeBetweenExercises) / 60);

  // Determine overall difficulty
  const difficultyScore = difficulties.map(d => 
    d === 'beginner' ? 1 : d === 'intermediate' ? 2 : 3
  ).reduce((a, b) => a + b, 0) / difficulties.length;
  
  const difficultyLevel = difficultyScore <= 1.5 ? 'beginner' : 
                         difficultyScore <= 2.5 ? 'intermediate' : 'advanced';

  // Determine overall complexity
  const complexityScore = complexities.map(c => 
    c === 'low' ? 1 : c === 'medium' ? 2 : 3
  ).reduce((a, b) => a + b, 0) / complexities.length;
  
  const complexityLevel = complexityScore <= 1.5 ? 'low' : 
                         complexityScore <= 2.5 ? 'medium' : 'high';

  return {
    totalDuration,
    totalExercises: workout.exercises.length,
    totalSets,
    totalReps,
    primaryMuscles: Array.from(primaryMuscles),
    equipmentNeeded: Array.from(equipmentNeeded),
    difficultyLevel: difficultyLevel as 'beginner' | 'intermediate' | 'advanced',
    complexityLevel: complexityLevel as 'low' | 'medium' | 'high'
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'bg-success/20 text-success border-success/30';
    case 'intermediate': return 'bg-warning/20 text-warning border-warning/30';
    case 'advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
    default: return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
}

export function getComplexityColor(complexity: string): string {
  switch (complexity) {
    case 'low': return 'bg-success/20 text-success border-success/30';
    case 'medium': return 'bg-warning/20 text-warning border-warning/30';
    case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
    default: return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
}