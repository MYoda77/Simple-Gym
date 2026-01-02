import { useState, useEffect, useCallback } from "react";
import { workoutsAPI, realtimeAPI } from "@/lib/supabase-api";
import type { Workout, WorkoutExercise } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

export function useWorkoutTemplates() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all workouts
  // Fetch all workouts
  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workoutsAPI.getAll();
      setWorkouts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load workouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new workout
  const createWorkout = async (
    name: string,
    exercises: WorkoutExercise[],
    description?: string,
    durationMinutes?: number,
    difficulty?: string
  ) => {
    try {
      const newWorkout = await workoutsAPI.create(
        name,
        exercises,
        description,
        durationMinutes,
        difficulty
      );
      setWorkouts((prev) => [newWorkout, ...prev]);
      toast({
        title: "Success",
        description: "Workout created successfully",
      });
      return newWorkout;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create workout",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an existing workout
  const updateWorkout = async (
    id: string,
    updates: Partial<
      Omit<Workout, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) => {
    try {
      const updatedWorkout = await workoutsAPI.update(id, updates);
      setWorkouts((prev) =>
        prev.map((workout) => (workout.id === id ? updatedWorkout : workout))
      );
      toast({
        title: "Success",
        description: "Workout updated successfully",
      });
      return updatedWorkout;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update workout",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete a workout
  const deleteWorkout = async (id: string) => {
    try {
      await workoutsAPI.delete(id);
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete workout",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get workout by ID
  const getWorkoutById = async (id: string) => {
    try {
      return await workoutsAPI.getById(id);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to get workout",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Duplicate a workout
  const duplicateWorkout = async (id: string) => {
    try {
      const duplicated = await workoutsAPI.duplicate(id);
      setWorkouts((prev) => [duplicated, ...prev]);
      toast({
        title: "Success",
        description: "Workout duplicated successfully",
      });
      return duplicated;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to duplicate workout",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Initialize default templates (for backward compatibility - does nothing now)
  const initializeDefaultTemplates = async () => {
    // No-op for backward compatibility
    // In Supabase, we don't have default templates - users create their own
    console.log(
      "initializeDefaultTemplates called - no action needed with Supabase"
    );
  };

  // Initial load
  useEffect(() => {
    fetchWorkouts();

    // Subscribe to real-time changes
    const subscription = realtimeAPI.subscribeToWorkouts((payload) => {
      console.log("Workout change:", payload);

      if (payload.eventType === "INSERT") {
        setWorkouts((prev) => [payload.new as Workout, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setWorkouts((prev) =>
          prev.map((workout) =>
            workout.id === payload.new.id ? (payload.new as Workout) : workout
          )
        );
      } else if (payload.eventType === "DELETE") {
        setWorkouts((prev) =>
          prev.filter((workout) => workout.id !== payload.old.id)
        );
      }
    });

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [fetchWorkouts]);

  // Return both new and old API names for backward compatibility
  return {
    // New API names
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    refreshWorkouts: fetchWorkouts,

    // OLD API names for backward compatibility
    templates: workouts,
    createTemplate: createWorkout,
    updateTemplate: updateWorkout,
    deleteTemplate: deleteWorkout,
    refresh: fetchWorkouts,
    initializeDefaultTemplates,
  };
}
