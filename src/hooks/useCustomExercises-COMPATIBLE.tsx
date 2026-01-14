// src/hooks/useCustomExercises-COMPATIBLE.tsx
import { useState, useEffect } from "react";
import { Exercise } from "@/types/gym";
import { customExercisesAPI, authAPI } from "@/lib/supabase-api";
import type { CustomExercise } from "@/lib/supabase-config";

export const useCustomExercises = () => {
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom exercises from Supabase or localStorage
  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await authAPI.getCurrentUser();
      if (user) {
        // Load from Supabase when logged in
        const exercises = await customExercisesAPI.getAll();
        setCustomExercises(exercises);
      } else {
        // Load from localStorage when not logged in
        const stored = localStorage.getItem("local_custom_exercises");
        const localExercises = stored ? JSON.parse(stored) : [];
        setCustomExercises(localExercises);
      }
    } catch (err) {
      console.error("Failed to load custom exercises:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load exercises";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load exercises when user changes or component mounts
  useEffect(() => {
    loadExercises();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authAPI.onAuthStateChange((newUser) => {
      loadExercises();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addCustomExercise = async (exerciseData: Omit<Exercise, "id">) => {
    const user = await authAPI.getCurrentUser();

    // If user is logged in, save to Supabase
    if (user) {
      try {
        const createData = {
          name: exerciseData.name,
          equipment: exerciseData.equipment,
          difficulty: exerciseData.difficulty,
          complexity: exerciseData.complexity || "low",
          primary_muscle: exerciseData.primaryMuscle,
          instructions: exerciseData.instructions || "",
        };
        const newExercise = await customExercisesAPI.create(createData);
        if (newExercise) {
          setCustomExercises((prev) => [newExercise, ...prev]);
          return newExercise;
        }
        throw new Error("Failed to create exercise");
      } catch (error) {
        console.error("Failed to add custom exercise:", error);
        throw error;
      }
    } else {
      // If user is not logged in, save to local storage
      try {
        const localExercise: CustomExercise = {
          id: `local_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "local_user",
          name: exerciseData.name,
          equipment: exerciseData.equipment,
          difficulty: exerciseData.difficulty,
          complexity: exerciseData.complexity || "low",
          primary_muscle: exerciseData.primaryMuscle,
          instructions: exerciseData.instructions || "",
        };

        setCustomExercises((prev) => [localExercise, ...prev]);

        // Save to localStorage for persistence
        const stored = localStorage.getItem("local_custom_exercises");
        const localExercises = stored ? JSON.parse(stored) : [];
        localExercises.unshift(localExercise);
        localStorage.setItem(
          "local_custom_exercises",
          JSON.stringify(localExercises)
        );

        return localExercise;
      } catch (error) {
        console.error("Failed to add local custom exercise:", error);
        throw error;
      }
    }
  };

  const updateCustomExercise = async (
    id: string,
    exerciseData: Partial<Omit<Exercise, "id">>
  ) => {
    const user = await authAPI.getCurrentUser();

    if (user && !id.startsWith("local_")) {
      // Update in Supabase for logged-in users with remote exercises
      try {
        const updateData: any = {};
        if (exerciseData.name) updateData.name = exerciseData.name;
        if (exerciseData.equipment)
          updateData.equipment = exerciseData.equipment;
        if (exerciseData.difficulty)
          updateData.difficulty = exerciseData.difficulty;
        if (exerciseData.complexity)
          updateData.complexity = exerciseData.complexity;
        if (exerciseData.primaryMuscle)
          updateData.primary_muscle = exerciseData.primaryMuscle;
        if (exerciseData.instructions)
          updateData.instructions = exerciseData.instructions;

        const updatedExercise = await customExercisesAPI.update(id, updateData);
        if (updatedExercise) {
          setCustomExercises((prev) =>
            prev.map((exercise) =>
              exercise.id === id ? updatedExercise : exercise
            )
          );
          return updatedExercise;
        }
        throw new Error("Failed to update exercise");
      } catch (error) {
        console.error("Failed to update custom exercise:", error);
        throw error;
      }
    } else {
      // Update in localStorage for local exercises
      try {
        setCustomExercises((prev) =>
          prev.map((exercise) => {
            if (exercise.id === id) {
              const updated = {
                ...exercise,
                updated_at: new Date().toISOString(),
              };
              if (exerciseData.name) updated.name = exerciseData.name;
              if (exerciseData.equipment)
                updated.equipment = exerciseData.equipment;
              if (exerciseData.difficulty)
                updated.difficulty = exerciseData.difficulty;
              if (exerciseData.complexity)
                updated.complexity = exerciseData.complexity;
              if (exerciseData.primaryMuscle)
                updated.primary_muscle = exerciseData.primaryMuscle;
              if (exerciseData.instructions)
                updated.instructions = exerciseData.instructions;
              return updated;
            }
            return exercise;
          })
        );

        // Update localStorage
        const stored = localStorage.getItem("local_custom_exercises");
        const localExercises = stored ? JSON.parse(stored) : [];
        const updatedLocalExercises = localExercises.map(
          (exercise: CustomExercise) => {
            if (exercise.id === id) {
              const updated = {
                ...exercise,
                updated_at: new Date().toISOString(),
              };
              if (exerciseData.name) updated.name = exerciseData.name;
              if (exerciseData.equipment)
                updated.equipment = exerciseData.equipment;
              if (exerciseData.difficulty)
                updated.difficulty = exerciseData.difficulty;
              if (exerciseData.primaryMuscle)
                updated.primary_muscle = exerciseData.primaryMuscle;
              return updated;
            }
            return exercise;
          }
        );
        localStorage.setItem(
          "local_custom_exercises",
          JSON.stringify(updatedLocalExercises)
        );

        return true;
      } catch (error) {
        console.error("Failed to update local custom exercise:", error);
        throw error;
      }
    }
  };

  const deleteCustomExercise = async (id: string) => {
    const user = await authAPI.getCurrentUser();

    if (user && !id.startsWith("local_")) {
      // Delete from Supabase for logged-in users with remote exercises
      try {
        await customExercisesAPI.delete(id);
        setCustomExercises((prev) =>
          prev.filter((exercise) => exercise.id !== id)
        );
        return true;
      } catch (error) {
        console.error("Failed to delete custom exercise:", error);
        throw error;
      }
    } else {
      // Delete from localStorage for local exercises
      try {
        setCustomExercises((prev) =>
          prev.filter((exercise) => exercise.id !== id)
        );

        // Update localStorage
        const stored = localStorage.getItem("local_custom_exercises");
        const localExercises = stored ? JSON.parse(stored) : [];
        const filteredLocalExercises = localExercises.filter(
          (exercise: CustomExercise) => exercise.id !== id
        );
        localStorage.setItem(
          "local_custom_exercises",
          JSON.stringify(filteredLocalExercises)
        );

        return true;
      } catch (error) {
        console.error("Failed to delete local custom exercise:", error);
        throw error;
      }
    }
  };

  const getCustomCategories = () => {
    const categories = new Set(customExercises.map((ex) => ex.primary_muscle));
    return Array.from(categories);
  };

  const getCustomEquipmentTypes = () => {
    const equipment = new Set(customExercises.map((ex) => ex.equipment));
    return Array.from(equipment);
  };

  // Refresh function for manual reload
  const refresh = () => {
    loadExercises();
  };

  return {
    customExercises,
    loading,
    error,
    addCustomExercise,
    updateCustomExercise,
    deleteCustomExercise,
    getCustomCategories,
    getCustomEquipmentTypes,
    refresh,
  };
};
