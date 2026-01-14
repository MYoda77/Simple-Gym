// src/hooks/useSchedule.tsx
import { useState, useEffect, useCallback } from "react";
import { scheduleAPI } from "@/lib/supabase-api";
import { supabase } from "@/lib/supabase-config";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Schedule } from "@/lib/supabase-config";

// Use Supabase record type directly
export type ScheduleEntry = Schedule;

export const useSchedule = () => {
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load schedule from Supabase
  const loadSchedule = useCallback(async () => {
    if (!user) {
      setScheduleEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const scheduleData = await scheduleAPI.getAll();
      // Use the full Supabase records directly
      setScheduleEntries(scheduleData);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load schedule";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load schedule when user changes or component mounts
  useEffect(() => {
    loadSchedule();
  }, [user, loadSchedule]);

  // Schedule a workout for a specific date
  const scheduleWorkout = async (date: string, workoutName: string) => {
    if (!user) {
      throw new Error("Must be logged in to schedule workouts");
    }

    try {
      // Get workout ID from workouts table by name
      const { data: workouts, error: workoutError } = await supabase
        .from("workouts")
        .select("id")
        .eq("name", workoutName)
        .single();

      if (workoutError || !workouts) {
        throw new Error(`Workout "${workoutName}" not found`);
      }

      const result = await scheduleAPI.create(workouts.id, date);
      if (result) {
        // Use the Supabase record directly
        // Update or add the entry
        setScheduleEntries((prev) => {
          const existingIndex = prev.findIndex(
            (s) => s.scheduled_date === date
          );
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
    if (!user) {
      throw new Error("Must be logged in to unschedule workouts");
    }

    try {
      // Find the schedule entry by date
      const entry = scheduleEntries.find((s) => s.scheduled_date === date);
      if (!entry) {
        throw new Error("No workout scheduled for this date");
      }

      await scheduleAPI.delete(entry.id);
      setScheduleEntries((prev) =>
        prev.filter((s) => s.scheduled_date !== date)
      );
      toast({
        title: "Success",
        description: `Workout removed from ${formatDate(date)}`,
      });
      return true;
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
    const entry = scheduleEntries.find((s) => s.scheduled_date === date);
    if (!entry) {
      throw new Error("No workout scheduled for this date");
    }

    try {
      if (completed) {
        const result = await scheduleAPI.markCompleted(entry.id);
        if (result) {
          // Update the entry in state
          setScheduleEntries((prev) =>
            prev.map((s) => (s.scheduled_date === date ? result : s))
          );

          const workoutName = entry.workouts?.name || "Workout";
          toast({
            title: "Workout Completed!",
            description: `${workoutName} on ${formatDate(date)}`,
          });
          return true;
        }
      } else {
        // Uncomplete by updating completed field
        const result = await scheduleAPI.update(entry.id, {
          completed: false,
          completed_at: null,
        });
        if (result) {
          setScheduleEntries((prev) =>
            prev.map((s) => (s.scheduled_date === date ? result : s))
          );

          const workoutName = entry.workouts?.name || "Workout";
          toast({
            title: "Workout Uncompleted",
            description: `${workoutName} on ${formatDate(date)}`,
          });
          return true;
        }
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
    return scheduleEntries.find((s) => s.scheduled_date === date) || null;
  };

  // Get workouts for a date range
  const getWorkoutsInRange = (
    startDate: string,
    endDate: string
  ): ScheduleEntry[] => {
    return scheduleEntries.filter(
      (s) => s.scheduled_date >= startDate && s.scheduled_date <= endDate
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
      (s) =>
        new Date(s.scheduled_date) >= oneWeekAgo &&
        new Date(s.scheduled_date) <= now
    );

    const monthlyEntries = scheduleEntries.filter(
      (s) =>
        new Date(s.scheduled_date) >= oneMonthAgo &&
        new Date(s.scheduled_date) <= now
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
