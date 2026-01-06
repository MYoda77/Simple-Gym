import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type { User };

// TypeScript types for your database tables
export interface CustomExercise {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  equipment: string;
  difficulty: string;
  complexity: string;
  primary_muscle: string;
  secondary_muscles?: string[];
  instructions: string;
  tips?: string;
  video_url?: string;
  image_url?: string;

  // Optional fields that may exist in the Exercise type
  primaryMuscle?: string; // Alias for primary_muscle
  movementPattern?: string;
  requiresSpotter?: boolean;
  prerequisites?: string[];
}

export interface Workout {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  description?: string;
  duration_minutes?: number;
  difficulty?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exercise_id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  notes?: string;
}

export interface Progress {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  weight?: number;
  body_fat_percentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
  notes?: string;
  photos?: string[];

  // Alias for backward compatibility
  bodyFat?: number;
}

export interface Schedule {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  workout_id: string | null; // ✅ Changed: Now optional
  scheduled_date: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  rest_day_type?: string | null; // ✅ NEW field
  workouts?: Workout; // Joined workout data
}

export interface WorkoutSession {
  id: string;
  created_at: string;
  user_id: string;
  workout_id: string;
  schedule_id?: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  exercises_completed: SessionExercise[];
  notes?: string;
}

export interface SessionExercise {
  exercise_id?: string;
  name: string;
  sets_completed: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];
}

// Database helper types
export type Database = {
  public: {
    Tables: {
      custom_exercises: {
        Row: CustomExercise;
        Insert: Omit<CustomExercise, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CustomExercise, "id" | "created_at" | "user_id">>;
      };
      workouts: {
        Row: Workout;
        Insert: Omit<Workout, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Workout, "id" | "created_at" | "user_id">>;
      };
      progress: {
        Row: Progress;
        Insert: Omit<Progress, "id" | "created_at">;
        Update: Partial<Omit<Progress, "id" | "created_at" | "user_id">>;
      };
      schedule: {
        Row: Schedule;
        Insert: Omit<Schedule, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Schedule, "id" | "created_at" | "user_id">>;
      };
      workout_sessions: {
        Row: WorkoutSession;
        Insert: Omit<WorkoutSession, "id" | "created_at">;
        Update: Partial<Omit<WorkoutSession, "id" | "created_at" | "user_id">>;
      };
    };
  };
};
