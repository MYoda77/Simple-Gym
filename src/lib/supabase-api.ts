import { supabase } from "./supabase-config";
import type {
  CustomExercise,
  Workout,
  Progress,
  Schedule,
  WorkoutSession,
  WorkoutExercise,
  SessionExercise,
  User,
} from "./supabase-config";

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};

// ============================================
// CUSTOM EXERCISES API
// ============================================

export const customExercisesAPI = {
  // Get all custom exercises for the current user
  async getAll() {
    const { data, error } = await supabase
      .from("custom_exercises")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CustomExercise[];
  },

  // Get a single custom exercise by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("custom_exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as CustomExercise;
  },

  // Create a new custom exercise
  async create(
    exercise: Omit<
      CustomExercise,
      "id" | "created_at" | "updated_at" | "user_id"
    >
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("custom_exercises")
      .insert({
        ...exercise,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as CustomExercise;
  },

  // Update an existing custom exercise
  async update(
    id: string,
    exercise: Partial<
      Omit<CustomExercise, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) {
    const { data, error } = await supabase
      .from("custom_exercises")
      .update(exercise)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as CustomExercise;
  },

  // Delete a custom exercise
  async delete(id: string) {
    const { error } = await supabase
      .from("custom_exercises")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Search custom exercises by name
  async search(query: string) {
    const { data, error } = await supabase
      .from("custom_exercises")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CustomExercise[];
  },
};

// ============================================
// WORKOUTS API
// ============================================

export const workoutsAPI = {
  // Get all workouts for the current user
  async getAll() {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Workout[];
  },

  // Get a single workout by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Workout;
  },

  // Create a new workout
  async create(
    name: string,
    exercises: WorkoutExercise[],
    description?: string,
    durationMinutes?: number,
    difficulty?: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        name,
        exercises,
        description,
        duration_minutes: durationMinutes,
        difficulty,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Workout;
  },

  // Update an existing workout
  async update(
    id: string,
    updates: Partial<
      Omit<Workout, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) {
    const { data, error } = await supabase
      .from("workouts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Workout;
  },

  // Delete a workout
  async delete(id: string) {
    const { error } = await supabase.from("workouts").delete().eq("id", id);

    if (error) throw error;
  },

  // Duplicate a workout
  async duplicate(id: string) {
    const workout = await this.getById(id);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        name: `${workout.name} (Copy)`,
        description: workout.description,
        duration_minutes: workout.duration_minutes,
        difficulty: workout.difficulty,
        exercises: workout.exercises,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Workout;
  },
};

// ============================================
// PROGRESS API
// ============================================

export const progressAPI = {
  // Get all progress entries for the current user
  async getAll() {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data as Progress[];
  },

  // Get progress entries within a date range
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) throw error;
    return data as Progress[];
  },

  // Get progress entry by date
  async getByDate(date: string) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
    return data as Progress | null;
  },

  // Create a new progress entry
  async create(progressData: Omit<Progress, "id" | "created_at" | "user_id">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("progress")
      .insert({
        ...progressData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Progress;
  },

  // Update an existing progress entry
  async update(
    id: string,
    updates: Partial<Omit<Progress, "id" | "created_at" | "user_id">>
  ) {
    const { data, error } = await supabase
      .from("progress")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Progress;
  },

  // Delete a progress entry
  async delete(id: string) {
    const { error } = await supabase.from("progress").delete().eq("id", id);

    if (error) throw error;
  },

  // Get latest progress entry
  async getLatest() {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as Progress | null;
  },
};

// ============================================
// SCHEDULE API
// ============================================

export const scheduleAPI = {
  // Get all scheduled workouts for the current user
  async getAll() {
    const { data, error } = await supabase
      .from("schedule")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description,
          duration_minutes,
          difficulty,
          exercises
        )
      `
      )
      .order("scheduled_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get scheduled workouts within a date range
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("schedule")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description,
          duration_minutes,
          difficulty,
          exercises
        )
      `
      )
      .gte("scheduled_date", startDate)
      .lte("scheduled_date", endDate)
      .order("scheduled_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get scheduled workout by date
  async getByDate(date: string) {
    const { data, error } = await supabase
      .from("schedule")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description,
          duration_minutes,
          difficulty,
          exercises
        )
      `
      )
      .eq("scheduled_date", date);

    if (error) throw error;
    return data;
  },

  // Schedule a workout
  async create(workoutId: string, scheduledDate: string, notes?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Ensure date is in YYYY-MM-DD format only (no time component)
    let dateOnly: string;

    if (scheduledDate.includes("T")) {
      // If it's an ISO datetime, extract just the date part
      dateOnly = scheduledDate.split("T")[0];
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) {
      // Already in correct YYYY-MM-DD format
      dateOnly = scheduledDate;
    } else {
      // Try to parse and format
      const date = new Date(scheduledDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      dateOnly = date.toISOString().split("T")[0];
    }

    console.log("📅 Scheduling workout with date:", dateOnly); // Debug log

    const { data, error } = await supabase
      .from("schedule")
      .insert({
        workout_id: workoutId,
        scheduled_date: dateOnly, // ✅ Correct - always YYYY-MM-DD
        notes,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Schedule creation error:", error);
      throw error;
    }
    return data as Schedule;
  },

  // Update a scheduled workout
  async update(
    id: string,
    updates: Partial<
      Omit<Schedule, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) {
    const { data, error } = await supabase
      .from("schedule")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Schedule;
  },

  // Mark workout as completed
  async markCompleted(id: string) {
    const { data, error } = await supabase
      .from("schedule")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Schedule;
  },

  // Delete a scheduled workout
  async delete(id: string) {
    const { error } = await supabase.from("schedule").delete().eq("id", id);

    if (error) throw error;
  },
};

// ============================================
// WORKOUT SESSIONS API
// ============================================

export const workoutSessionsAPI = {
  // Get all workout sessions for the current user
  async getAll() {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description
        )
      `
      )
      .order("started_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get workout sessions within a date range
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description
        )
      `
      )
      .gte("started_at", startDate)
      .lte("started_at", endDate)
      .order("started_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single workout session by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workouts (
          id,
          name,
          description,
          exercises
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Start a new workout session
  async start(workoutId: string, scheduleId?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({
        workout_id: workoutId,
        schedule_id: scheduleId,
        started_at: new Date().toISOString(),
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutSession;
  },

  // Complete a workout session
  async complete(
    id: string,
    exercisesCompleted: SessionExercise[],
    notes?: string
  ) {
    const session = await this.getById(id);
    const startedAt = new Date(session.started_at);
    const completedAt = new Date();
    const durationMinutes = Math.round(
      (completedAt.getTime() - startedAt.getTime()) / 60000
    );

    const { data, error } = await supabase
      .from("workout_sessions")
      .update({
        completed_at: completedAt.toISOString(),
        duration_minutes: durationMinutes,
        exercises_completed: exercisesCompleted,
        notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutSession;
  },

  // Update workout session progress
  async updateProgress(id: string, exercisesCompleted: SessionExercise[]) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .update({
        exercises_completed: exercisesCompleted,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutSession;
  },

  // Delete a workout session
  async delete(id: string) {
    const { error } = await supabase
      .from("workout_sessions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const realtimeAPI = {
  // Subscribe to custom exercises changes
  subscribeToCustomExercises(callback: (payload: unknown) => void) {
    return supabase
      .channel("custom_exercises_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "custom_exercises" },
        callback
      )
      .subscribe();
  },

  // Subscribe to workouts changes
  subscribeToWorkouts(callback: (payload: unknown) => void) {
    return supabase
      .channel("workouts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workouts" },
        callback
      )
      .subscribe();
  },

  // Subscribe to schedule changes
  subscribeToSchedule(callback: (payload: unknown) => void) {
    return supabase
      .channel("schedule_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule" },
        callback
      )
      .subscribe();
  },

  // Subscribe to progress changes
  subscribeToProgress(callback: (payload: unknown) => void) {
    return supabase
      .channel("progress_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "progress" },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from a channel
  unsubscribe(subscription: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return supabase.removeChannel(subscription as any);
  },
};
