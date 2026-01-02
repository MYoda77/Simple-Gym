import { useState, useEffect, useCallback } from "react";
import { customExercisesAPI, realtimeAPI } from "@/lib/supabase-api";
import type { CustomExercise } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

export function useCustomExercises() {
  const [exercises, setExercises] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all exercises
  // Fetch all workouts
  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customExercisesAPI.getAll();
      setExercises(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      toast({
        title: "Error",
        description: "Failed to load workouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new exercise
  const createExercise = async (
    exercise: Omit<
      CustomExercise,
      "id" | "created_at" | "updated_at" | "user_id"
    >
  ) => {
    try {
      const newExercise = await customExercisesAPI.create(exercise);
      setExercises((prev) => [newExercise, ...prev]);
      toast({
        title: "Success",
        description: "Exercise created successfully",
      });
      return newExercise;
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create exercise",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an existing exercise
  const updateExercise = async (
    id: string,
    updates: Partial<
      Omit<CustomExercise, "id" | "created_at" | "updated_at" | "user_id">
    >
  ) => {
    try {
      const updatedExercise = await customExercisesAPI.update(id, updates);
      setExercises((prev) =>
        prev.map((ex) => (ex.id === id ? updatedExercise : ex))
      );
      toast({
        title: "Success",
        description: "Exercise updated successfully",
      });
      return updatedExercise;
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update exercise",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete an exercise
  const deleteExercise = async (id: string) => {
    try {
      await customExercisesAPI.delete(id);
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
      toast({
        title: "Success",
        description: "Exercise deleted successfully",
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete exercise",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Search exercises
  const searchExercises = async (query: string) => {
    try {
      const results = await customExercisesAPI.search(query);
      return results;
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to search exercises",
        variant: "destructive",
      });
      return [];
    }
  };

  // Get exercise by ID
  const getExerciseById = async (id: string) => {
    try {
      return await customExercisesAPI.getById(id);
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to get exercise",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get unique categories from custom exercises
  const getCustomCategories = () => {
    const categories = exercises.map((ex) => ex.primary_muscle);
    return [...new Set(categories)].filter(Boolean);
  };

  // Get unique equipment types from custom exercises
  const getCustomEquipmentTypes = () => {
    const equipment = exercises.map((ex) => ex.equipment);
    return [...new Set(equipment)].filter(Boolean);
  };

  // Initial load
  useEffect(() => {
    fetchExercises();

    // Subscribe to real-time changes
    const subscription = realtimeAPI.subscribeToCustomExercises((payload) => {
      console.log("Custom exercise change:", payload);

      if (payload.eventType === "INSERT") {
        setExercises((prev) => [payload.new as CustomExercise, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setExercises((prev) =>
          prev.map((ex) =>
            ex.id === payload.new.id ? (payload.new as CustomExercise) : ex
          )
        );
      } else if (payload.eventType === "DELETE") {
        setExercises((prev) => prev.filter((ex) => ex.id !== payload.old.id));
      }
    });

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [fetchExercises]);

  // Return both new and old API names for backward compatibility
  return {
    // New API names
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    searchExercises,
    getExerciseById,
    refreshExercises: fetchExercises,

    // OLD API names for backward compatibility with existing code
    customExercises: exercises,
    addCustomExercise: createExercise,
    updateCustomExercise: updateExercise,
    deleteCustomExercise: deleteExercise,
    getCustomCategories,
    getCustomEquipmentTypes,
    refresh: fetchExercises,
  };
}
