// src/hooks/useCustomExercises.tsx
import { useState, useEffect } from "react";
import { Exercise } from "@/types/gym";
import {
  customExercisesAPI,
  CustomExerciseRecord,
  auth,
} from "@/lib/pocketbase";

export const useCustomExercises = () => {
  const [customExercises, setCustomExercises] = useState<
    CustomExerciseRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom exercises from PocketBase or localStorage
  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      if (auth.isLoggedIn) {
        // Load from PocketBase when logged in
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
    const unsubscribe = auth.onChange((token, model) => {
      if (model) {
        // User logged in - load from PocketBase
        loadExercises();
      } else {
        // User logged out - load from localStorage
        loadExercises();
      }
    });

    return unsubscribe;
  }, []);

  const addCustomExercise = async (exerciseData: Omit<Exercise, "id">) => {
    // If user is logged in, save to database
    if (auth.isLoggedIn) {
      try {
        const newExercise = await customExercisesAPI.create(exerciseData);
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
        const localExercise: CustomExerciseRecord = {
          ...exerciseData,
          id: `local_${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          collectionId: "local",
          collectionName: "custom_exercises",
          user: "local_user",
          isCustom: true,
        };

        setCustomExercises((prev) => [localExercise, ...prev]);

        // Save to localStorage for persistence across page reloads
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
    if (auth.isLoggedIn && !id.startsWith("local_")) {
      // Update in PocketBase for logged-in users with remote exercises
      try {
        const updatedExercise = await customExercisesAPI.update(
          id,
          exerciseData
        );
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
                ...exerciseData,
                updated: new Date().toISOString(),
              };
              return updated;
            }
            return exercise;
          })
        );

        // Update localStorage
        const stored = localStorage.getItem("local_custom_exercises");
        const localExercises = stored ? JSON.parse(stored) : [];
        const updatedLocalExercises = localExercises.map(
          (exercise: CustomExerciseRecord) => {
            if (exercise.id === id) {
              return {
                ...exercise,
                ...exerciseData,
                updated: new Date().toISOString(),
              };
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
    if (auth.isLoggedIn && !id.startsWith("local_")) {
      // Delete from PocketBase for logged-in users with remote exercises
      try {
        const success = await customExercisesAPI.delete(id);
        if (success) {
          setCustomExercises((prev) =>
            prev.filter((exercise) => exercise.id !== id)
          );
          return true;
        }
        throw new Error("Failed to delete exercise");
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
          (exercise: CustomExerciseRecord) => exercise.id !== id
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
    const categories = new Set(customExercises.map((ex) => ex.primaryMuscle));
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
