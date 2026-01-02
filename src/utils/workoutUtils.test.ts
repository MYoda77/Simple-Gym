import { describe, it, expect } from "@jest/globals";
import {
  calculateWorkoutMetrics,
  formatDuration,
  getDifficultyColor,
  getComplexityColor,
} from "@/utils/workoutUtils";
import type { Workout } from "@/types/gym";

describe("workoutUtils", () => {
  describe("calculateWorkoutMetrics", () => {
    it("should calculate basic workout metrics correctly", () => {
      const workout: Workout = {
        duration: "60min",
        exercises: [
          {
            name: "Bench Press",
            sets: 3,
            reps: 10,
            weight: 135,
            rest: 90,
          },
          {
            name: "Squats",
            sets: 4,
            reps: 8,
            weight: 185,
            rest: 120,
          },
        ],
      };

      const metrics = calculateWorkoutMetrics(workout);

      expect(metrics.totalExercises).toBe(2);
      expect(metrics.totalSets).toBe(7); // 3 + 4
      expect(metrics.totalReps).toBe(62); // (3*10) + (4*8)
      expect(metrics.totalDuration).toBeGreaterThan(0);
    });

    it("should handle workout with single exercise", () => {
      const workout: Workout = {
        duration: "20min",
        exercises: [
          {
            name: "Push-ups",
            sets: 3,
            reps: 15,
            weight: 0,
            rest: 60,
          },
        ],
      };

      const metrics = calculateWorkoutMetrics(workout);

      expect(metrics.totalExercises).toBe(1);
      expect(metrics.totalSets).toBe(3);
      expect(metrics.totalReps).toBe(45); // 3*15
    });

    it("should handle empty workout", () => {
      const workout: Workout = {
        duration: "0min",
        exercises: [],
      };

      const metrics = calculateWorkoutMetrics(workout);

      expect(metrics.totalExercises).toBe(0);
      expect(metrics.totalSets).toBe(0);
      expect(metrics.totalReps).toBe(0);
      expect(metrics.primaryMuscles).toHaveLength(0);
      expect(metrics.equipmentNeeded).toHaveLength(0);
    });

    it("should collect unique primary muscles", () => {
      const workout: Workout = {
        duration: "45min",
        exercises: [
          { name: "Bench Press", sets: 3, reps: 10, weight: 135, rest: 90 },
          { name: "Dumbbell Flyes", sets: 3, reps: 12, weight: 30, rest: 60 },
          { name: "Squats", sets: 3, reps: 10, weight: 185, rest: 120 },
        ],
      };

      const metrics = calculateWorkoutMetrics(workout);

      expect(metrics.primaryMuscles.length).toBeGreaterThan(0);
    });

    it("should collect unique equipment needed", () => {
      const workout: Workout = {
        duration: "45min",
        exercises: [
          { name: "Bench Press", sets: 3, reps: 10, weight: 135, rest: 90 },
          { name: "Dumbbell Curls", sets: 3, reps: 12, weight: 30, rest: 60 },
        ],
      };

      const metrics = calculateWorkoutMetrics(workout);

      expect(metrics.equipmentNeeded.length).toBeGreaterThan(0);
    });
  });

  describe("formatDuration", () => {
    it("should format minutes correctly", () => {
      expect(formatDuration(30)).toBe("30min");
      expect(formatDuration(45)).toBe("45min");
      expect(formatDuration(59)).toBe("59min");
    });

    it("should format hours correctly", () => {
      expect(formatDuration(60)).toBe("1h");
      expect(formatDuration(120)).toBe("2h");
      expect(formatDuration(180)).toBe("3h");
    });

    it("should format hours and minutes correctly", () => {
      expect(formatDuration(75)).toBe("1h 15min");
      expect(formatDuration(90)).toBe("1h 30min");
      expect(formatDuration(135)).toBe("2h 15min");
    });

    it("should handle zero", () => {
      expect(formatDuration(0)).toBe("0min");
    });
  });

  describe("getDifficultyColor", () => {
    it("should return correct color classes for beginner", () => {
      const color = getDifficultyColor("beginner");
      expect(color).toContain("success");
    });

    it("should return correct color classes for intermediate", () => {
      const color = getDifficultyColor("intermediate");
      expect(color).toContain("warning");
    });

    it("should return correct color classes for advanced", () => {
      const color = getDifficultyColor("advanced");
      expect(color).toContain("destructive");
    });

    it("should return default color classes for unknown difficulty", () => {
      const color = getDifficultyColor("unknown");
      expect(color).toContain("muted");
    });
  });

  describe("getComplexityColor", () => {
    it("should return correct color classes for low", () => {
      const color = getComplexityColor("low");
      expect(color).toContain("success");
    });

    it("should return correct color classes for medium", () => {
      const color = getComplexityColor("medium");
      expect(color).toContain("warning");
    });

    it("should return correct color classes for high", () => {
      const color = getComplexityColor("high");
      expect(color).toContain("destructive");
    });

    it("should return default color classes for unknown complexity", () => {
      const color = getComplexityColor("unknown");
      expect(color).toContain("muted");
    });
  });
});
