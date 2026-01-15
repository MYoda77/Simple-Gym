// ============================================
// UPDATED Schedule Interface
// Add this to src/lib/supabase-config.ts
// ============================================

export interface Schedule {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  workout_id: string | null; // ✅ Now optional - null for Rest Days
  scheduled_date: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  rest_day_type?: string | null; // ✅ NEW: For different rest day types
  workouts?: Workout; // Joined workout data (only if workout_id exists)
}

// Optional: Add Rest Day configuration type for future use
export interface RestDayConfig {
  type: 'complete' | 'active' | 'stretching' | 'custom';
  activities?: string[];
  duration_minutes?: number;
  notes?: string;
}
