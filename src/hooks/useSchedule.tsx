// src/hooks/useSchedule.tsx
import { useState, useEffect } from "react";
import { scheduleAPI, auth, ScheduleRecord } from "@/lib/pocketbase";
import { useToast } from "@/hooks/use-toast";

// Use PocketBase record type directly
export type ScheduleEntry = ScheduleRecord;

export const useSchedule = () => {
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load schedule from PocketBase
  const loadSchedule = async () => {
    if (!auth.isLoggedIn) {
      setScheduleEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const scheduleData = await scheduleAPI.getAll();
      // Use the full PocketBase records directly
      setScheduleEntries(scheduleData);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load schedule";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load schedule when user changes or component mounts
  useEffect(() => {
    loadSchedule();

    // Listen for auth changes
    const unsubscribe = auth.onChange((token, model) => {
      if (model) {
        loadSchedule();
      } else {
        setScheduleEntries([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Schedule a workout for a specific date
  const scheduleWorkout = async (date: string, workoutName: string) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to schedule workouts");
    }

    try {
      const result = await scheduleAPI.schedule(date, workoutName);
      if (result) {
        // Use the PocketBase record directly
        // Update or add the entry
        setScheduleEntries((prev) => {
          const existingIndex = prev.findIndex((s) => s.date === date);
          if (existingIndex >= 0) {
            // Update existing entry
            const updated = [...prev];
            updated[existingIndex] = result;
            return updated;
          } else {
            // Add new entry
            return [...prev, result];
          }
        });

        toast({
          title: "Success",
          description: `Workout scheduled for ${formatDate(date)}`,
        });
        return result;
      }
      throw new Error("Failed to schedule workout");
    } catch (error) {
      console.error("Failed to schedule workout:", error);
      toast({
        title: "Error",
        description: "Failed to schedule workout",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Remove a workout from the schedule
  const unscheduleWorkout = async (date: string) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to unschedule workouts");
    }

    try {
      const success = await scheduleAPI.unschedule(date);
      if (success) {
        setScheduleEntries((prev) => prev.filter((s) => s.date !== date));
        toast({
          title: "Success",
          description: `Workout removed from ${formatDate(date)}`,
        });
        return true;
      }
      throw new Error("Failed to unschedule workout");
    } catch (error) {
      console.error("Failed to unschedule workout:", error);
      toast({
        title: "Error",
        description: "Failed to unschedule workout",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mark a scheduled workout as completed
  const markCompleted = async (date: string, completed = true) => {
    const entry = scheduleEntries.find((s) => s.date === date);
    if (!entry) {
      throw new Error("No workout scheduled for this date");
    }

    try {
      const result = await scheduleAPI.schedule(date, entry.workoutName);
      if (result) {
        // Update the entry in state
        setScheduleEntries((prev) =>
          prev.map((s) => (s.date === date ? { ...s, completed } : s))
        );

        toast({
          title: completed ? "Workout Completed!" : "Workout Uncompleted",
          description: `${entry.workoutName} on ${formatDate(date)}`,
        });
        return true;
      }
      throw new Error("Failed to update workout status");
    } catch (error) {
      console.error("Failed to mark workout as completed:", error);
      toast({
        title: "Error",
        description: "Failed to update workout status",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Get workout for a specific date
  const getWorkoutForDate = (date: string): ScheduleEntry | null => {
    return scheduleEntries.find((s) => s.date === date) || null;
  };

  // Get workouts for a date range
  const getWorkoutsInRange = (
    startDate: string,
    endDate: string
  ): ScheduleEntry[] => {
    return scheduleEntries.filter(
      (s) => s.date >= startDate && s.date <= endDate
    );
  };

  // Get today's workout
  const getTodaysWorkout = (): ScheduleEntry | null => {
    const today = new Date().toISOString().split("T")[0];
    return getWorkoutForDate(today);
  };

  // Get this week's workouts
  const getWeeklyWorkouts = (): ScheduleEntry[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const startDateStr = startOfWeek.toISOString().split("T")[0];
    const endDateStr = endOfWeek.toISOString().split("T")[0];

    return getWorkoutsInRange(startDateStr, endDateStr);
  };

  // Get schedule statistics
  const getScheduleStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyEntries = scheduleEntries.filter(
      (s) => new Date(s.date) >= oneWeekAgo && new Date(s.date) <= now
    );

    const monthlyEntries = scheduleEntries.filter(
      (s) => new Date(s.date) >= oneMonthAgo && new Date(s.date) <= now
    );

    return {
      totalScheduled: scheduleEntries.length,
      totalCompleted: scheduleEntries.filter((s) => s.completed).length,
      weeklyScheduled: weeklyEntries.length,
      weeklyCompleted: weeklyEntries.filter((s) => s.completed).length,
      monthlyScheduled: monthlyEntries.length,
      monthlyCompleted: monthlyEntries.filter((s) => s.completed).length,
      completionRate:
        scheduleEntries.length > 0
          ? (scheduleEntries.filter((s) => s.completed).length /
              scheduleEntries.length) *
            100
          : 0,
    };
  };

  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    scheduleEntries,
    loading,
    error,
    scheduleWorkout,
    unscheduleWorkout,
    markCompleted,
    getWorkoutForDate,
    getWorkoutsInRange,
    getTodaysWorkout,
    getWeeklyWorkouts,
    getScheduleStats,
    formatDate,
    refresh: loadSchedule,
  };
};
