import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates-COMPATIBLE";
import { mockWorkout, mockWorkoutExercise } from "@/__tests__/fixtures";

// Mock the API - must define inline in jest.mock for hoisting
jest.mock("@/lib/supabase-api", () => ({
  workoutsAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    duplicate: jest.fn(),
  },
  realtimeAPI: {
    subscribeToWorkouts: jest.fn(),
  },
}));

// Import the mocked API after jest.mock
import { workoutsAPI, realtimeAPI } from "@/lib/supabase-api";
const mockWorkoutsAPI = workoutsAPI as jest.Mocked<typeof workoutsAPI>;
const mockRealtimeAPI = realtimeAPI as jest.Mocked<typeof realtimeAPI>;

// Mock useToast
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("useWorkoutTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch workouts on mount", async () => {
    const mockWorkouts = [mockWorkout];
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.getAll.mockResolvedValue(mockWorkouts);

    const { result } = renderHook(() => useWorkoutTemplates());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workouts).toEqual(mockWorkouts);
    expect(mockWorkoutsAPI.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new workout", async () => {
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.getAll.mockResolvedValue([]);
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.create.mockResolvedValue(mockWorkout);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.createWorkout(
      "Push Day",
      [mockWorkoutExercise],
      "Chest workout"
    );

    expect(mockWorkoutsAPI.create).toHaveBeenCalledWith(
      "Push Day",
      [mockWorkoutExercise],
      "Chest workout",
      undefined,
      undefined
    );
  });

  it("should update an existing workout", async () => {
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.update.mockResolvedValue({
      ...mockWorkout,
      name: "Updated Workout",
    });

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updateWorkout(mockWorkout.id, {
      name: "Updated Workout",
    });

    expect(mockWorkoutsAPI.update).toHaveBeenCalledWith(mockWorkout.id, {
      name: "Updated Workout",
    });
  });

  it("should delete a workout", async () => {
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteWorkout(mockWorkout.id);

    expect(mockWorkoutsAPI.delete).toHaveBeenCalledWith(mockWorkout.id);
  });

  it("should handle errors when fetching workouts", async () => {
    const error = new Error("Failed to fetch");
    // @ts-expect-error - Jest mock typing
    mockWorkoutsAPI.getAll.mockRejectedValue(error);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error.message);
  });
});
