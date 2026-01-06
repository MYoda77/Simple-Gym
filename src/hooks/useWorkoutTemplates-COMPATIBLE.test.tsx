import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates-COMPATIBLE";
import { mockWorkout, mockWorkoutExercise } from "@/__tests__/fixtures";

// Use the automatic mock from __mocks__ directory
jest.mock("@/lib/supabase-api");

// Create a stable toast mock to prevent infinite re-renders
const mockToast = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock("@/lib/supabase-config", () => ({
  supabase: {},
}));

// Import the mocked API
import { workoutsAPI, realtimeAPI } from "@/lib/supabase-api";

type RealtimeSubscription = {
  unsubscribe: () => void;
};

const mockWorkoutsAPI = workoutsAPI as jest.Mocked<typeof workoutsAPI>;
const mockRealtimeAPI = realtimeAPI as jest.Mocked<typeof realtimeAPI>;

describe("useWorkoutTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();

    // Properly mock workoutsAPI.getAll with default value
    mockWorkoutsAPI.getAll.mockResolvedValue([]);

    // Mock subscribeToWorkouts to return a proper subscription object
    mockRealtimeAPI.subscribeToWorkouts.mockImplementation(() => {
      const subscription: RealtimeSubscription = {
        unsubscribe: jest.fn(),
      };
      return subscription as unknown as ReturnType<
        typeof mockRealtimeAPI.subscribeToWorkouts
      >;
    });
  });

  it("should fetch workouts on mount", async () => {
    const mockWorkouts = [mockWorkout];
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
    mockWorkoutsAPI.getAll.mockResolvedValue([]);
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
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
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
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
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
    mockWorkoutsAPI.getAll.mockRejectedValue(error);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error.message);
  });
});
