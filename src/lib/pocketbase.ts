// src/lib/pocketbase.ts
import PocketBase from "pocketbase";
import { Exercise } from "../types/gym";

// Initialize PocketBase
const pb = new PocketBase("http://localhost:8090");

// Enable auto cancellation for requests
pb.autoCancellation(false);

// Base PocketBase record interface
interface BaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  expand?: Record<string, unknown>;
}

// Generic API response types for better TypeScript support
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

// Enhanced error types
export interface PocketBaseError {
  code: number;
  message: string;
  data?: Record<string, unknown>;
}

// Types for PocketBase records
export interface CustomExerciseRecord extends Omit<Exercise, "id">, BaseRecord {
  user: string;
  isCustom: true;
}

export interface WorkoutExerciseData {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
}

export interface WorkoutRecord extends BaseRecord {
  name: string;
  exercises: WorkoutExerciseData[];
  duration: string;
  user: string;
}

export interface ProgressRecord extends BaseRecord {
  weight: number;
  bodyFat?: number;
  date: string;
  notes?: string;
  user: string;
}

// NEW: Add WorkoutHistoryRecord type
export interface WorkoutHistoryRecord extends BaseRecord {
  workoutName: string;
  duration: number;
  exercises: number;
  totalSets: number;
  completedAt: string;
  user: string;
}

// NEW: Add ScheduleRecord type
export interface ScheduleRecord extends BaseRecord {
  date: string;
  workoutName: string;
  completed: boolean;
  user: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Auth functions
export const auth = {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      return { success: true, user: authData.record as unknown as AuthUser };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      return { success: false, error: errorMessage };
    }
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    try {
      // Create user
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name,
        emailVisibility: true,
      });

      // Auto login after registration
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      return { success: true, user: authData.record as unknown as AuthUser };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      return { success: false, error: errorMessage };
    }
  },

  logout(): void {
    pb.authStore.clear();
  },

  get currentUser(): AuthUser | null {
    return pb.authStore.model as AuthUser | null;
  },

  get isLoggedIn(): boolean {
    return pb.authStore.isValid;
  },

  // Subscribe to auth changes
  onChange(
    callback: (token: string, model: AuthUser | null) => void
  ): () => void {
    return pb.authStore.onChange((token, record) => {
      callback(token, record as AuthUser | null);
    });
  },
};

// Custom Exercises API
export const customExercisesAPI = {
  async getAll(): Promise<CustomExerciseRecord[]> {
    try {
      const records = await pb
        .collection("custom_exercises")
        .getFullList<CustomExerciseRecord>({
          sort: "-created",
          filter: `user.id = "${pb.authStore.model?.id}"`,
        });
      return records;
    } catch (error) {
      console.error("Error fetching custom exercises:", error);
      return [];
    }
  },

  async create(
    exerciseData: Omit<Exercise, "id">
  ): Promise<CustomExerciseRecord | null> {
    try {
      const record = await pb
        .collection("custom_exercises")
        .create<CustomExerciseRecord>({
          ...exerciseData,
          user: pb.authStore.model?.id,
          isCustom: true,
        });
      return record;
    } catch (error) {
      console.error("Error creating custom exercise:", error);
      return null;
    }
  },

  async update(
    id: string,
    exerciseData: Partial<Omit<Exercise, "id">>
  ): Promise<CustomExerciseRecord | null> {
    try {
      const record = await pb
        .collection("custom_exercises")
        .update<CustomExerciseRecord>(id, exerciseData);
      return record;
    } catch (error) {
      console.error("Error updating custom exercise:", error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await pb.collection("custom_exercises").delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting custom exercise:", error);
      return false;
    }
  },
};

// Workouts API
export const workoutsAPI = {
  async getAll(): Promise<WorkoutRecord[]> {
    try {
      return await pb.collection("workouts").getFullList<WorkoutRecord>({
        sort: "-created",
        filter: `user.id = "${pb.authStore.model?.id}"`,
      });
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return [];
    }
  },

  async create(
    name: string,
    exercises: WorkoutExerciseData[],
    duration = "45-60 mins"
  ): Promise<WorkoutRecord | null> {
    try {
      return await pb.collection("workouts").create<WorkoutRecord>({
        name,
        exercises,
        duration,
        user: pb.authStore.model?.id,
      });
    } catch (error) {
      console.error("Error creating workout:", error);
      return null;
    }
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      exercises: WorkoutExerciseData[];
      duration: string;
    }>
  ): Promise<WorkoutRecord | null> {
    try {
      return await pb.collection("workouts").update<WorkoutRecord>(id, data);
    } catch (error) {
      console.error("Error updating workout:", error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await pb.collection("workouts").delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting workout:", error);
      return false;
    }
  },
};

// Progress API
export const progressAPI = {
  async getAll(): Promise<ProgressRecord[]> {
    try {
      return await pb.collection("progress").getFullList<ProgressRecord>({
        sort: "-date",
        filter: `user.id = "${pb.authStore.model?.id}"`,
      });
    } catch (error) {
      console.error("Error fetching progress:", error);
      return [];
    }
  },

  async log(
    weight: number,
    bodyFat?: number,
    notes?: string,
    date?: string
  ): Promise<ProgressRecord | null> {
    try {
      return await pb.collection("progress").create<ProgressRecord>({
        weight,
        bodyFat,
        notes,
        date: date || new Date().toISOString().split("T")[0],
        user: pb.authStore.model?.id,
      });
    } catch (error) {
      console.error("Error logging progress:", error);
      return null;
    }
  },
};

// Workout History API - UPDATED with proper types
export const historyAPI = {
  async getAll(): Promise<WorkoutHistoryRecord[]> {
    try {
      return await pb
        .collection("workout_history")
        .getFullList<WorkoutHistoryRecord>({
          sort: "-completedAt",
          filter: `user.id = "${pb.authStore.model?.id}"`,
        });
    } catch (error) {
      console.error("Error fetching workout history:", error);
      return [];
    }
  },

  async log(
    workoutName: string,
    duration: number,
    exercises: number,
    totalSets: number
  ): Promise<WorkoutHistoryRecord | null> {
    try {
      return await pb
        .collection("workout_history")
        .create<WorkoutHistoryRecord>({
          workoutName,
          duration,
          exercises,
          totalSets,
          completedAt: new Date().toISOString(),
          user: pb.authStore.model?.id,
        });
    } catch (error) {
      console.error("Error logging workout:", error);
      return null;
    }
  },
};

// Schedule API - UPDATED with proper types
export const scheduleAPI = {
  async getAll(): Promise<ScheduleRecord[]> {
    try {
      return await pb.collection("schedule").getFullList<ScheduleRecord>({
        sort: "date",
        filter: `user.id = "${pb.authStore.model?.id}"`,
      });
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return [];
    }
  },

  async schedule(
    date: string,
    workoutName: string
  ): Promise<ScheduleRecord | null> {
    try {
      // Check if already scheduled for this date
      const existing = await pb
        .collection("schedule")
        .getFirstListItem<ScheduleRecord>(
          `user.id = "${pb.authStore.model?.id}" && date = "${date}"`
        )
        .catch(() => null);

      if (existing) {
        // Update existing
        return await pb
          .collection("schedule")
          .update<ScheduleRecord>(existing.id, {
            workoutName,
            completed: false,
          });
      } else {
        // Create new
        return await pb.collection("schedule").create<ScheduleRecord>({
          date,
          workoutName,
          completed: false,
          user: pb.authStore.model?.id,
        });
      }
    } catch (error) {
      console.error("Error scheduling workout:", error);
      return null;
    }
  },

  async unschedule(date: string): Promise<boolean> {
    try {
      const existing = await pb
        .collection("schedule")
        .getFirstListItem<ScheduleRecord>(
          `user.id = "${pb.authStore.model?.id}" && date = "${date}"`
        );
      await pb.collection("schedule").delete(existing.id);
      return true;
    } catch (error) {
      console.error("Error unscheduling workout:", error);
      return false;
    }
  },
};

import type { RecordSubscription } from "pocketbase";

export interface SubscriptionCallback<T = Record<string, unknown>> {
  action: "create" | "update" | "delete";
  record: T;
}

// Type-specific subscription callback interfaces
export type CustomExerciseSubscriptionCallback =
  SubscriptionCallback<CustomExerciseRecord>;
export type WorkoutSubscriptionCallback = SubscriptionCallback<WorkoutRecord>;
export type ProgressSubscriptionCallback = SubscriptionCallback<ProgressRecord>;
export type HistorySubscriptionCallback =
  SubscriptionCallback<WorkoutHistoryRecord>;
export type ScheduleSubscriptionCallback = SubscriptionCallback<ScheduleRecord>;

// Real-time subscriptions (optional, for live updates)
export const subscriptions = {
  async subscribeToCustomExercises(
    callback: (data: CustomExerciseSubscriptionCallback) => void
  ): Promise<() => void> {
    return pb
      .collection("custom_exercises")
      .subscribe("*", (data: RecordSubscription<CustomExerciseRecord>) => {
        callback({
          action: data.action as "create" | "update" | "delete",
          record: data.record as CustomExerciseRecord,
        });
      });
  },

  async subscribeToWorkouts(
    callback: (data: WorkoutSubscriptionCallback) => void
  ): Promise<() => void> {
    return pb
      .collection("workouts")
      .subscribe("*", (data: RecordSubscription<WorkoutRecord>) => {
        callback({
          action: data.action as "create" | "update" | "delete",
          record: data.record as WorkoutRecord,
        });
      });
  },

  async subscribeToProgress(
    callback: (data: ProgressSubscriptionCallback) => void
  ): Promise<() => void> {
    return pb
      .collection("progress")
      .subscribe("*", (data: RecordSubscription<ProgressRecord>) => {
        callback({
          action: data.action as "create" | "update" | "delete",
          record: data.record as ProgressRecord,
        });
      });
  },

  async subscribeToWorkoutHistory(
    callback: (data: HistorySubscriptionCallback) => void
  ): Promise<() => void> {
    return pb
      .collection("workout_history")
      .subscribe("*", (data: RecordSubscription<WorkoutHistoryRecord>) => {
        callback({
          action: data.action as "create" | "update" | "delete",
          record: data.record as WorkoutHistoryRecord,
        });
      });
  },

  async subscribeToSchedule(
    callback: (data: ScheduleSubscriptionCallback) => void
  ): Promise<() => void> {
    return pb
      .collection("schedule")
      .subscribe("*", (data: RecordSubscription<ScheduleRecord>) => {
        callback({
          action: data.action as "create" | "update" | "delete",
          record: data.record as ScheduleRecord,
        });
      });
  },

  unsubscribe(unsubscribeFunc: () => void): void {
    unsubscribeFunc();
  },
};

export default pb;
