import { useState, useEffect, useCallback } from "react";
import { scheduleAPI, realtimeAPI } from "@/lib/supabase-api";
import type { Schedule } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

export function useSchedule() {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all scheduled workouts
  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const data = await scheduleAPI.getAll();
      setScheduledWorkouts(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch schedule by date range
  const fetchScheduleByDateRange = async (
    startDate: string,
    endDate: string
  ) => {
    try {
      const data = await scheduleAPI.getByDateRange(startDate, endDate);
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load schedule for date range";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return [];
    }
  };

  // Get schedule by specific date
  const getScheduleByDate = async (date: string) => {
    try {
      return await scheduleAPI.getByDate(date);
    } catch (err: unknown) {
      return [];
    }
  };

  // Schedule a new workout
  const scheduleWorkout = async (
    workoutId: string,
    scheduledDate: string,
    notes?: string
  ) => {
    try {
      const newSchedule = await scheduleAPI.create(
        workoutId,
        scheduledDate,
        notes
      );
      // Fetch updated schedule to include workout details
      await fetchSchedule();
      toast({
        title: "Success",
        description: "Workout scheduled successfully",
      });
      return newSchedule;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to schedule workout";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update a scheduled workout
  const updateSchedule = async (
    id: string,
    updates: Partial<
      Omit<Schedule, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) => {
    try {
      await scheduleAPI.update(id, updates);
      // Refresh to get updated data with workout details
      await fetchSchedule();
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update schedule";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Mark workout as completed
  const markWorkoutCompleted = async (id: string) => {
    try {
      await scheduleAPI.markCompleted(id);
      setScheduledWorkouts((prev) =>
        prev.map((schedule) =>
          schedule.id === id
            ? {
                ...schedule,
                completed: true,
                completed_at: new Date().toISOString(),
              }
            : schedule
        )
      );
      toast({
        title: "Success",
        description: "Workout marked as completed",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to mark workout as completed";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete a scheduled workout
  const deleteSchedule = async (id: string) => {
    try {
      await scheduleAPI.delete(id);
      setScheduledWorkouts((prev) =>
        prev.filter((schedule) => schedule.id !== id)
      );
      toast({
        title: "Success",
        description: "Scheduled workout deleted successfully",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete schedule";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get workouts for a specific week
  const getWeekSchedule = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return scheduledWorkouts.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduled_date);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });
  };

  // Get today's workouts
  const getTodayWorkouts = () => {
    const today = new Date().toISOString().split("T")[0];
    return scheduledWorkouts.filter(
      (schedule) => schedule.scheduled_date === today
    );
  };

  // Get upcoming workouts
  const getUpcomingWorkouts = (days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return scheduledWorkouts.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduled_date);
      return (
        scheduleDate >= today &&
        scheduleDate <= futureDate &&
        !schedule.completed
      );
    });
  };

  // Initial load
  useEffect(() => {
    fetchSchedule();

    // Subscribe to real-time changes
    const subscription = realtimeAPI.subscribeToSchedule((payload) => {
      console.log("Schedule change:", payload);

      // Refresh entire schedule to get workout details
      fetchSchedule();
    });

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [fetchSchedule]);

  // Return both new and old API names for backward compatibility
  return {
    // New API names
    scheduledWorkouts,
    loading,
    error,
    scheduleWorkout,
    updateSchedule,
    markWorkoutCompleted,
    deleteSchedule,
    getScheduleByDate,
    fetchScheduleByDateRange,
    getWeekSchedule,
    getTodayWorkouts,
    getUpcomingWorkouts,
    refreshSchedule: fetchSchedule,

    // OLD API names for backward compatibility
    scheduleEntries: scheduledWorkouts,
    unscheduleWorkout: deleteSchedule,
  };
}
