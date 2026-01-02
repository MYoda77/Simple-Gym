import { useState, useEffect, useCallback } from "react";
import { progressAPI, realtimeAPI } from "@/lib/supabase-api";
import type { Progress } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

export function useProgressTracking() {
  const [progressEntries, setProgressEntries] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all progress entries
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const data = await progressAPI.getAll();
      setProgressEntries(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch progress by date range
  const fetchProgressByDateRange = async (
    startDate: string,
    endDate: string
  ) => {
    try {
      const data = await progressAPI.getByDateRange(startDate, endDate);
      return data;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load progress for date range",
        variant: "destructive",
      });
      return [];
    }
  };

  // Get progress by specific date
  const getProgressByDate = async (date: string) => {
    try {
      return await progressAPI.getByDate(date);
    } catch (err: any) {
      return null;
    }
  };

  // Create a new progress entry
  const createProgress = async (
    progressData: Omit<Progress, "id" | "created_at" | "user_id">
  ) => {
    try {
      const newProgress = await progressAPI.create(progressData);
      setProgressEntries((prev) =>
        [newProgress, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      toast({
        title: "Success",
        description: "Progress logged successfully",
      });
      return newProgress;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to log progress",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an existing progress entry
  const updateProgress = async (
    id: string,
    updates: Partial<Omit<Progress, "id" | "created_at" | "user_id">>
  ) => {
    try {
      const updatedProgress = await progressAPI.update(id, updates);
      setProgressEntries((prev) =>
        prev.map((entry) => (entry.id === id ? updatedProgress : entry))
      );
      toast({
        title: "Success",
        description: "Progress updated successfully",
      });
      return updatedProgress;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update progress",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete a progress entry
  const deleteProgress = async (id: string) => {
    try {
      await progressAPI.delete(id);
      setProgressEntries((prev) => prev.filter((entry) => entry.id !== id));
      toast({
        title: "Success",
        description: "Progress entry deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete progress",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get latest progress entry
  const getLatestProgress = async () => {
    try {
      return await progressAPI.getLatest();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to get latest progress",
        variant: "destructive",
      });
      return null;
    }
  };

  // Calculate progress statistics
  const calculateStats = () => {
    if (progressEntries.length < 2) return null;

    const sortedEntries = [...progressEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstEntry = sortedEntries[0];
    const latestEntry = sortedEntries[sortedEntries.length - 1];

    const stats = {
      totalEntries: progressEntries.length,
      weightChange:
        firstEntry.weight && latestEntry.weight
          ? latestEntry.weight - firstEntry.weight
          : null,
      bodyFatChange:
        firstEntry.body_fat_percentage && latestEntry.body_fat_percentage
          ? latestEntry.body_fat_percentage - firstEntry.body_fat_percentage
          : null,
      firstDate: firstEntry.date,
      latestDate: latestEntry.date,
    };

    return stats;
  };

  // Log workout (for backward compatibility)
  const logWorkout = async (workoutData: any) => {
    // For backward compatibility - this was used to log workout history
    // In the new system, this is handled separately by workout sessions
    console.log(
      "logWorkout called - workout tracking is now handled by workout sessions"
    );
  };

  // Initial load
  useEffect(() => {
    fetchProgress();

    // Subscribe to real-time changes
    const subscription = realtimeAPI.subscribeToProgress((payload) => {
      console.log("Progress change:", payload);

      if (payload.eventType === "INSERT") {
        setProgressEntries((prev) =>
          [payload.new as Progress, ...prev].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } else if (payload.eventType === "UPDATE") {
        setProgressEntries((prev) =>
          prev.map((entry) =>
            entry.id === payload.new.id ? (payload.new as Progress) : entry
          )
        );
      } else if (payload.eventType === "DELETE") {
        setProgressEntries((prev) =>
          prev.filter((entry) => entry.id !== payload.old.id)
        );
      }
    });

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [fetchProgress]);

  // Return both new and old API names for backward compatibility
  return {
    // New API names
    progressEntries,
    loading,
    error,
    createProgress,
    updateProgress,
    deleteProgress,
    getProgressByDate,
    getLatestProgress,
    fetchProgressByDateRange,
    calculateStats,
    refreshProgress: fetchProgress,

    // OLD API names for backward compatibility
    workoutHistory: progressEntries, // Using progress entries as workout history for now
    logProgress: createProgress,
    logWorkout,
  };
}
