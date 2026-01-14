import { useState, useEffect, useCallback } from "react";
import { personalRecordsAPI } from "@/lib/supabase-api";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface PersonalRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  exercise_name: string;
  weight_kg: number;
  reps?: number;
  achieved_at: string;
  notes?: string;
}

export const usePersonalRecords = () => {
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load personal records from Supabase
  const loadRecords = useCallback(async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await personalRecordsAPI.getAll();
      setRecords(data || []);
    } catch (err) {
      console.error("Failed to load personal records:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load personal records";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load records when user changes
  useEffect(() => {
    loadRecords();
  }, [user, loadRecords]);

  // Create or update a personal record
  const upsertRecord = async (
    exerciseName: string,
    weightKg: number,
    reps?: number,
    notes?: string
  ) => {
    if (!user) {
      throw new Error("Must be logged in to save personal records");
    }

    try {
      const record = await personalRecordsAPI.upsert(
        exerciseName,
        weightKg,
        reps,
        notes
      );

      // Update local state
      setRecords((prev) => {
        const existing = prev.find((r) => r.exercise_name === exerciseName);
        if (existing) {
          return prev.map((r) =>
            r.exercise_name === exerciseName ? record : r
          );
        } else {
          return [record, ...prev];
        }
      });

      return record;
    } catch (error) {
      console.error("Failed to save personal record:", error);
      toast({
        title: "Error",
        description: "Failed to save personal record",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Get personal record for a specific exercise
  const getRecordByExercise = useCallback(
    (exerciseName: string): PersonalRecord | null => {
      return (
        records.find(
          (r) => r.exercise_name.toLowerCase() === exerciseName.toLowerCase()
        ) || null
      );
    },
    [records]
  );

  // Convert to legacy format (exercise name -> weight)
  const asLegacyFormat = useCallback((): Record<string, number> => {
    const legacy: Record<string, number> = {};
    records.forEach((record) => {
      legacy[record.exercise_name] = record.weight_kg;
    });
    return legacy;
  }, [records]);

  // Delete a personal record
  const deleteRecord = async (exerciseName: string) => {
    if (!user) {
      throw new Error("Must be logged in to delete personal records");
    }

    try {
      await personalRecordsAPI.delete(exerciseName);
      setRecords((prev) =>
        prev.filter((r) => r.exercise_name !== exerciseName)
      );
      toast({
        title: "Success",
        description: "Personal record deleted",
      });
    } catch (error) {
      console.error("Failed to delete personal record:", error);
      toast({
        title: "Error",
        description: "Failed to delete personal record",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    records,
    loading,
    error,
    upsertRecord,
    getRecordByExercise,
    asLegacyFormat,
    deleteRecord,
    refresh: loadRecords,
  };
};
