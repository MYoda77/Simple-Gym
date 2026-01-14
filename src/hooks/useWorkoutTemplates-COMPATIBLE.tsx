// src/hooks/useWorkoutTemplates.tsx
import { useState, useEffect, useCallback } from "react";
import { workoutsAPI } from "@/lib/supabase-api";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Workout, WorkoutExercise } from "@/lib/supabase-config";

// Use Supabase record type directly
export type WorkoutTemplate = Workout;
export type WorkoutExerciseData = WorkoutExercise;

export const useWorkoutTemplates = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load workout templates from Supabase
  const loadTemplates = useCallback(async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const workouts = await workoutsAPI.getAll();
      // Use the full workout records directly
      setTemplates(workouts);
    } catch (err) {
      console.error("Failed to load workout templates:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load templates";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load workout templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load templates when user changes or component mounts
  useEffect(() => {
    loadTemplates();
  }, [user, loadTemplates]);

  const createTemplate = async (
    name: string,
    exercises: WorkoutExerciseData[],
    duration = "45-60 mins"
  ) => {
    if (!user) {
      throw new Error("Must be logged in to create templates");
    }

    try {
      const newWorkout = await workoutsAPI.create(name, exercises, duration);
      if (newWorkout) {
        // Use the Supabase record directly
        setTemplates((prev) => [newWorkout, ...prev]);
        toast({
          title: "Success",
          description: "Workout template created successfully",
        });
        return newWorkout;
      }
      throw new Error("Failed to create workout template");
    } catch (error) {
      console.error("Failed to create workout template:", error);
      toast({
        title: "Error",
        description: "Failed to create workout template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (
    id: string,
    updates: Partial<{
      name: string;
      exercises: WorkoutExerciseData[];
      duration: string;
    }>
  ) => {
    if (!user) {
      throw new Error("Must be logged in to update templates");
    }

    try {
      const updatedWorkout = await workoutsAPI.update(id, updates);
      if (updatedWorkout) {
        // Use the Supabase record directly
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? updatedWorkout : t))
        );
        toast({
          title: "Success",
          description: "Workout template updated successfully",
        });
        return updatedWorkout;
      }
      throw new Error("Failed to update workout template");
    } catch (error) {
      console.error("Failed to update workout template:", error);
      toast({
        title: "Error",
        description: "Failed to update workout template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) {
      throw new Error("Must be logged in to delete templates");
    }

    try {
      await workoutsAPI.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Workout template deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Failed to delete workout template:", error);
      toast({
        title: "Error",
        description: "Failed to delete workout template",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Initialize with default templates if none exist
  const initializeDefaultTemplates = async () => {
    if (templates.length > 0) return;

    const defaultTemplates = [
      {
        name: "Push Day",
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8, weight: 0, rest: 180 },
          { name: "Overhead Press", sets: 3, reps: 10, weight: 0, rest: 120 },
          {
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: 12,
            weight: 0,
            rest: 90,
          },
          { name: "Tricep Dips", sets: 3, reps: 15, weight: 0, rest: 60 },
        ],
        duration: "60 mins",
      },
      {
        name: "Pull Day",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: 8, weight: 0, rest: 120 },
          { name: "Barbell Rows", sets: 4, reps: 8, weight: 0, rest: 120 },
          { name: "Lat Pulldowns", sets: 3, reps: 12, weight: 0, rest: 90 },
          { name: "Bicep Curls", sets: 3, reps: 15, weight: 0, rest: 60 },
        ],
        duration: "55 mins",
      },
      {
        name: "Leg Day",
        exercises: [
          { name: "Squats", sets: 4, reps: 8, weight: 0, rest: 180 },
          {
            name: "Romanian Deadlifts",
            sets: 3,
            reps: 10,
            weight: 0,
            rest: 120,
          },
          { name: "Leg Press", sets: 3, reps: 15, weight: 0, rest: 90 },
          { name: "Calf Raises", sets: 4, reps: 20, weight: 0, rest: 60 },
        ],
        duration: "65 mins",
      },
    ];

    try {
      for (const template of defaultTemplates) {
        await createTemplate(
          template.name,
          template.exercises,
          template.duration
        );
      }
    } catch (error) {
      console.error("Failed to initialize default templates:", error);
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    initializeDefaultTemplates,
    refresh: loadTemplates,
  };
};
