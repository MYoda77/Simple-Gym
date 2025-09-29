// src/hooks/useWorkouts.tsx
import { useState, useEffect } from "react";
import { Workout } from "@/types/gym";
import {
  workoutsAPI,
  WorkoutRecord,
  auth,
  WorkoutExerciseData,
} from "@/lib/pocketbase";

// Convert PocketBase record to your app's Workout format
const convertToWorkout = (record: WorkoutRecord): Workout => ({
  duration: record.duration,
  exercises: record.exercises,
});

// Convert your app's Workout to PocketBase format
const convertFromWorkout = (workout: Workout): WorkoutExerciseData[] =>
  workout.exercises;

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Record<string, Workout>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workouts from PocketBase
  const loadWorkouts = async () => {
    if (!auth.isLoggedIn) {
      setWorkouts({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const records = await workoutsAPI.getAll();

      // Convert PocketBase records to your app format
      const workoutsMap: Record<string, Workout> = {};
      records.forEach((record) => {
        workoutsMap[record.name] = convertToWorkout(record);
      });

      setWorkouts(workoutsMap);
    } catch (err) {
      console.error("Failed to load workouts:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load workouts";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load workouts when user changes or component mounts
  useEffect(() => {
    loadWorkouts();

    // Listen for auth changes
    const unsubscribe = auth.onChange((token, model) => {
      if (model) {
        loadWorkouts();
      } else {
        setWorkouts({});
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const createWorkout = async (name: string, workout: Workout) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to create workouts");
    }

    try {
      const exercises = convertFromWorkout(workout);
      const record = await workoutsAPI.create(
        name,
        exercises,
        workout.duration
      );

      if (record) {
        setWorkouts((prev) => ({
          ...prev,
          [name]: workout,
        }));
        return record;
      }
      throw new Error("Failed to create workout");
    } catch (error) {
      console.error("Failed to create workout:", error);
      throw error;
    }
  };

  const updateWorkout = async (
    oldName: string,
    newName: string,
    workout: Workout
  ) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to update workouts");
    }

    try {
      // Find the record by name (we'd need to store record IDs in a real app)
      const records = await workoutsAPI.getAll();
      const record = records.find((r) => r.name === oldName);

      if (!record) {
        throw new Error("Workout not found");
      }

      const exercises = convertFromWorkout(workout);
      const updatedRecord = await workoutsAPI.update(record.id, {
        name: newName,
        exercises,
        duration: workout.duration,
      });

      if (updatedRecord) {
        setWorkouts((prev) => {
          const newWorkouts = { ...prev };
          delete newWorkouts[oldName];
          newWorkouts[newName] = workout;
          return newWorkouts;
        });
        return updatedRecord;
      }
      throw new Error("Failed to update workout");
    } catch (error) {
      console.error("Failed to update workout:", error);
      throw error;
    }
  };

  const deleteWorkout = async (name: string) => {
    if (!auth.isLoggedIn) {
      throw new Error("Must be logged in to delete workouts");
    }

    try {
      // Find the record by name
      const records = await workoutsAPI.getAll();
      const record = records.find((r) => r.name === name);

      if (!record) {
        throw new Error("Workout not found");
      }

      const success = await workoutsAPI.delete(record.id);

      if (success) {
        setWorkouts((prev) => {
          const newWorkouts = { ...prev };
          delete newWorkouts[name];
          return newWorkouts;
        });
        return true;
      }
      throw new Error("Failed to delete workout");
    } catch (error) {
      console.error("Failed to delete workout:", error);
      throw error;
    }
  };

  // Initialize with default workouts if none exist
  const initializeDefaultWorkouts = async () => {
    if (!auth.isLoggedIn || Object.keys(workouts).length > 0) return;

    const defaultWorkouts = {
      "Upper Body Power": {
        duration: "60-75 mins",
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8, weight: 80, rest: 120 },
          { name: "Lat Pulldown", sets: 3, reps: 10, weight: 60, rest: 90 },
          { name: "Overhead Press", sets: 3, reps: 10, weight: 50, rest: 90 },
          { name: "Seated Cable Row", sets: 3, reps: 12, weight: 55, rest: 75 },
          {
            name: "Dumbbell Bicep Curls",
            sets: 3,
            reps: 12,
            weight: 15,
            rest: 60,
          },
          {
            name: "Cable Tricep Pushdowns (Straight Bar)",
            sets: 3,
            reps: 12,
            weight: 30,
            rest: 60,
          },
        ],
      },
      "Lower Body Strength": {
        duration: "60-75 mins",
        exercises: [
          { name: "Back Squats", sets: 4, reps: 8, weight: 100, rest: 150 },
          {
            name: "Romanian Deadlift",
            sets: 3,
            reps: 10,
            weight: 80,
            rest: 120,
          },
          { name: "Leg Press", sets: 3, reps: 15, weight: 150, rest: 90 },
          { name: "Leg Curls", sets: 3, reps: 12, weight: 40, rest: 60 },
          { name: "Dumbbell Lunges", sets: 3, reps: 10, weight: 20, rest: 75 },
        ],
      },
    };

    // Create default workouts
    try {
      for (const [name, workout] of Object.entries(defaultWorkouts)) {
        await createWorkout(name, workout);
      }
    } catch (error) {
      console.error("Failed to initialize default workouts:", error);
    }
  };

  // Refresh function for manual reload
  const refresh = () => {
    loadWorkouts();
  };

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    initializeDefaultWorkouts,
    refresh,
  };
};
