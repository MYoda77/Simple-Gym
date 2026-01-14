// src/hooks/useProgressTracking.tsx
import { useState, useEffect } from "react";
import {
  progressAPI,
  workoutSessionsAPI,
  workoutsAPI,
  authAPI,
} from "@/lib/supabase-api";
import type { Progress, WorkoutSession } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

// Use Supabase record types directly instead of duplicating them
export type ProgressEntry = Progress;
export type WorkoutHistoryEntry = WorkoutSession;

export interface ProgressStats {
  totalWorkouts: number;
  averageWorkoutDuration: number;
  currentWeight: number | null;
  weightChange: number | null;
  currentBodyFat: number | null;
  bodyFatChange: number | null;
  weeklyWorkouts: number;
  longestStreak: number;
}

export const useProgressTracking = () => {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load progress data from Supabase
  const loadProgressData = async () => {
    const user = await authAPI.getCurrentUser();
    if (!user) {
      setProgressEntries([]);
      setWorkoutHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load progress entries and workout history in parallel
      const [progressData, historyData] = await Promise.all([
        progressAPI.getAll(),
        workoutSessionsAPI.getAll(),
      ]);

      // Use the full Supabase records directly
      setProgressEntries(progressData);
      setWorkoutHistory(historyData);
    } catch (err) {
      console.error("Failed to load progress data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load progress data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes or component mounts
  useEffect(() => {
    loadProgressData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authAPI.onAuthStateChange((user) => {
      if (user) {
        loadProgressData();
      } else {
        setProgressEntries([]);
        setWorkoutHistory([]);
        setLoading(false);
      }
    });

    const unsubscribe = () => subscription?.unsubscribe();

    return unsubscribe;
  }, []);

  // Log progress entry (weight, body fat, notes)
  const logProgress = async (
    weight: number,
    bodyFat?: number,
    notes?: string,
    date?: string
  ) => {
    const user = await authAPI.getCurrentUser();
    if (!user) {
      throw new Error("Must be logged in to log progress");
    }

    try {
      const newEntry = await progressAPI.create({
        weight,
        body_fat_percentage: bodyFat,
        notes: notes || undefined,
        date: date || new Date().toISOString().split("T")[0],
      });
      if (newEntry) {
        // Use the Supabase record directly
        setProgressEntries((prev) => [newEntry, ...prev]);
        toast({
          title: "Success",
          description: "Progress logged successfully",
        });
        return newEntry;
      }
      throw new Error("Failed to log progress");
    } catch (error) {
      console.error("Failed to log progress:", error);
      toast({
        title: "Error",
        description: "Failed to log progress",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Log completed workout
  const logWorkout = async (
    workoutName: string,
    duration: number,
    exercisesCount: number,
    totalSets: number
  ) => {
    const user = await authAPI.getCurrentUser();
    if (!user) {
      throw new Error("Must be logged in to log workout");
    }

    try {
      // Look up the workout template by name to get its UUID
      const workouts = await workoutsAPI.getAll();
      const workoutTemplate = workouts.find((w) => w.name === workoutName);

      if (!workoutTemplate) {
        // If no template exists with this name, we can't create a session
        // Workout sessions require a valid workout template ID
        throw new Error(
          `Workout template "${workoutName}" not found. Please create the template first.`
        );
      }

      // Calculate the started_at time based on duration
      const completedAt = new Date();
      const startedAt = new Date(completedAt.getTime() - duration * 60 * 1000);

      // Start a workout session (without custom start time)
      const session = await workoutSessionsAPI.start(
        workoutTemplate.id,
        undefined
      );

      // Create exercise data for the session
      const exercisesCompleted = Array.from(
        { length: exercisesCount },
        (_, i) => ({
          exercise_id: `exercise-${i}`,
          sets_completed: Array.from(
            { length: Math.floor(totalSets / exercisesCount) || 1 },
            (_, j) => ({
              reps: 0,
              weight: 0,
              completed_at: new Date(
                startedAt.getTime() + (i * 60000 + j * 30000)
              ).toISOString(),
            })
          ),
        })
      );

      // Complete the session and manually update started_at and duration
      const newEntry = await workoutSessionsAPI.complete(
        session.id,
        exercisesCompleted,
        `${workoutName}: ${exercisesCount} exercises, ${totalSets} sets`
      );

      // Manually update the started_at and duration to reflect actual workout time
      if (newEntry) {
        // Update the session with correct started_at and duration
        const { data: updatedEntry } = await (
          await import("@/lib/supabase-config")
        ).supabase
          .from("workout_sessions")
          .update({
            started_at: startedAt.toISOString(),
            duration_minutes: duration,
          })
          .eq("id", session.id)
          .select()
          .single();

        const finalEntry = updatedEntry || newEntry;
        setWorkoutHistory((prev) => [finalEntry, ...prev]);
        toast({
          title: "Success",
          description: "Workout logged successfully",
        });
        return finalEntry;
      }
      throw new Error("Failed to log workout");
    } catch (error) {
      console.error("Failed to log workout:", error);
      toast({
        title: "Error",
        description: "Failed to log workout",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Calculate progress statistics
  const calculateStats = (): ProgressStats => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Workout statistics
    const totalWorkouts = workoutHistory.length;
    const averageWorkoutDuration =
      totalWorkouts > 0
        ? workoutHistory.reduce(
            (sum, w) => sum + (w.duration_minutes || 0),
            0
          ) / totalWorkouts
        : 0;

    // Recent workouts (last week)
    const weeklyWorkouts = workoutHistory.filter(
      (w) => new Date(w.completed_at || w.started_at) >= oneWeekAgo
    ).length;

    // Weight statistics
    const sortedProgress = [...progressEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentWeight =
      sortedProgress.length > 0 && sortedProgress[0].weight != null
        ? sortedProgress[0].weight
        : null;
    const previousWeight =
      sortedProgress.length > 1 && sortedProgress[1].weight != null
        ? sortedProgress[1].weight
        : null;
    const weightChange =
      currentWeight && previousWeight ? currentWeight - previousWeight : null;

    // Body fat statistics
    const entriesWithBodyFat = sortedProgress.filter(
      (p) => p.body_fat_percentage != null || p.bodyFat != null
    );
    const currentBodyFat =
      entriesWithBodyFat.length > 0
        ? entriesWithBodyFat[0].body_fat_percentage ??
          entriesWithBodyFat[0].bodyFat ??
          null
        : null;
    const previousBodyFat =
      entriesWithBodyFat.length > 1
        ? entriesWithBodyFat[1].body_fat_percentage ??
          entriesWithBodyFat[1].bodyFat ??
          null
        : null;
    const bodyFatChange =
      currentBodyFat !== null && previousBodyFat !== null
        ? currentBodyFat - previousBodyFat
        : null;

    // Calculate workout streak
    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) =>
        new Date(b.completed_at || b.started_at).getTime() -
        new Date(a.completed_at || a.started_at).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(
        sortedWorkouts[i].completed_at || sortedWorkouts[i].started_at
      );
      const daysDiff =
        i === 0
          ? 0
          : Math.floor(
              (new Date(
                sortedWorkouts[i - 1].completed_at ||
                  sortedWorkouts[i - 1].started_at
              ).getTime() -
                workoutDate.getTime()) /
                (24 * 60 * 60 * 1000)
            );

      if (daysDiff <= 2) {
        // Allow for 1 rest day
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return {
      totalWorkouts,
      averageWorkoutDuration,
      currentWeight,
      weightChange,
      currentBodyFat,
      bodyFatChange,
      weeklyWorkouts,
      longestStreak,
    };
  };

  // Get progress data for charts
  const getChartData = () => {
    const sortedProgress = [...progressEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      weightData: sortedProgress
        .filter((p) => p.weight != null)
        .map((p) => ({
          date: p.date,
          weight: p.weight!,
        })),
      bodyFatData: sortedProgress
        .filter((p) => p.body_fat_percentage != null || p.bodyFat != null)
        .map((p) => ({
          date: p.date,
          bodyFat: p.body_fat_percentage ?? p.bodyFat!,
        })),
      workoutFrequency: workoutHistory.reduce((acc, w) => {
        const date = (w.completed_at || w.started_at).split("T")[0]; // Get date part only
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  };

  return {
    progressEntries,
    workoutHistory,
    loading,
    error,
    logProgress,
    logWorkout,
    calculateStats,
    getChartData,
    refresh: loadProgressData,
  };
};
