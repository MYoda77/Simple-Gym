// src/hooks/useProgressTracking.tsx
import { useState, useEffect } from "react";
import {
  progressAPI,
  historyAPI,
  auth,
  ProgressRecord,
  WorkoutHistoryRecord,
} from "@/lib/pocketbase";
import { useToast } from "@/hooks/use-toast";

// Use PocketBase record types directly instead of duplicating them
export type ProgressEntry = ProgressRecord;
export type WorkoutHistoryEntry = WorkoutHistoryRecord;

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

  // Load progress data from PocketBase
  const loadProgressData = async () => {
    if (!auth.isLoggedIn) {
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
        historyAPI.getAll(),
      ]);

      // Use the full PocketBase records directly
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
    const unsubscribe = auth.onChange((token, model) => {
      if (model) {
        loadProgressData();
      } else {
        setProgressEntries([]);
        setWorkoutHistory([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Log progress entry (weight, body fat, notes)
  const logProgress = async (
    weight: number,
    bodyFat?: number,
    notes?: string,
    date?: string
  ) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to log progress");
    }

    try {
      const newEntry = await progressAPI.log(weight, bodyFat, notes, date);
      if (newEntry) {
        // Use the PocketBase record directly
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
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to log workout");
    }

    try {
      const newEntry = await historyAPI.log(
        workoutName,
        duration,
        exercisesCount,
        totalSets
      );
      if (newEntry) {
        // Use the PocketBase record directly
        setWorkoutHistory((prev) => [newEntry, ...prev]);
        toast({
          title: "Success",
          description: "Workout logged successfully",
        });
        return newEntry;
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
        ? workoutHistory.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts
        : 0;

    // Recent workouts (last week)
    const weeklyWorkouts = workoutHistory.filter(
      (w) => new Date(w.completedAt) >= oneWeekAgo
    ).length;

    // Weight statistics
    const sortedProgress = [...progressEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentWeight =
      sortedProgress.length > 0 ? sortedProgress[0].weight : null;
    const previousWeight =
      sortedProgress.length > 1 ? sortedProgress[1].weight : null;
    const weightChange =
      currentWeight && previousWeight ? currentWeight - previousWeight : null;

    // Body fat statistics
    const entriesWithBodyFat = sortedProgress.filter((p) => p.bodyFat != null);
    const currentBodyFat =
      entriesWithBodyFat.length > 0 &&
      typeof entriesWithBodyFat[0].bodyFat === "number"
        ? entriesWithBodyFat[0].bodyFat
        : null;
    const previousBodyFat =
      entriesWithBodyFat.length > 1 &&
      typeof entriesWithBodyFat[1].bodyFat === "number"
        ? entriesWithBodyFat[1].bodyFat
        : null;
    const bodyFatChange =
      currentBodyFat !== null && previousBodyFat !== null
        ? currentBodyFat - previousBodyFat
        : null;

    // Calculate workout streak
    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].completedAt);
      const daysDiff =
        i === 0
          ? 0
          : Math.floor(
              (new Date(sortedWorkouts[i - 1].completedAt).getTime() -
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
      weightData: sortedProgress.map((p) => ({
        date: p.date,
        weight: p.weight,
      })),
      bodyFatData: sortedProgress
        .filter((p) => p.bodyFat != null)
        .map((p) => ({
          date: p.date,
          bodyFat: p.bodyFat,
        })),
      workoutFrequency: workoutHistory.reduce((acc, w) => {
        const date = w.completedAt.split("T")[0]; // Get date part only
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
