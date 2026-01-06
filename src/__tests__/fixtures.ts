import type { User } from "@supabase/supabase-js";
import type {
  CustomExercise,
  Workout,
  WorkoutExercise,
  Progress,
  Schedule,
} from "@/lib/supabase-config";

export const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: { full_name: "Test User" },
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
};

export const mockExercise: CustomExercise = {
  id: "exercise-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  user_id: "test-user-id",
  name: "Bench Press",
  equipment: "Barbell",
  difficulty: "intermediate",
  complexity: "medium",
  primary_muscle: "Chest",
  secondary_muscles: ["Triceps", "Shoulders"],
  instructions: "Lie on bench and press barbell up",
  tips: "Keep elbows at 45 degrees",
};

export const mockWorkoutExercise: WorkoutExercise = {
  name: "Bench Press",
  sets: 3,
  reps: 10,
  weight: 135,
  rest: 90,
  notes: "Focus on form",
};

export const mockWorkout: Workout = {
  id: "workout-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  user_id: "test-user-id",
  name: "Push Day",
  description: "Chest, shoulders, and triceps workout",
  duration_minutes: 60,
  difficulty: "intermediate",
  exercises: [mockWorkoutExercise],
};

export const mockProgress: Progress = {
  id: "progress-1",
  created_at: "2024-01-01T00:00:00Z",
  user_id: "test-user-id",
  date: "2024-01-01",
  weight: 180,
  body_fat_percentage: 15,
  measurements: {
    chest: 42,
    waist: 32,
    arms: 15,
  },
  notes: "Feeling strong",
};

export const mockSchedule: Schedule = {
  id: "schedule-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  user_id: "test-user-id",
  workout_id: "workout-1",
  scheduled_date: "2024-01-15",
  completed: false,
  completed_at: null,
  notes: "Morning workout",
};
