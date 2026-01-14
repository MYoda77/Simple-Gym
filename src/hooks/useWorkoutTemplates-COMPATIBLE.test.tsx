import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates-COMPATIBLE";
import {
  mockWorkout,
  mockWorkoutExercise,
  mockUser,
} from "@/__tests__/fixtures";

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

// Mock useAuth
jest.mock("@/lib/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Import the mocked API and hooks
import { workoutsAPI, realtimeAPI } from "@/lib/supabase-api";
import { useAuth } from "@/lib/useAuth";

type RealtimeSubscription = {
  unsubscribe: () => void;
};

const mockWorkoutsAPI = workoutsAPI as jest.Mocked<typeof workoutsAPI>;
const mockRealtimeAPI = realtimeAPI as jest.Mocked<typeof realtimeAPI>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("useWorkoutTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();

    // Mock useAuth to return a user
    mockUseAuth.mockReturnValue({
      user: mockUser,
      signUp: jest.fn() as any,
      signIn: jest.fn() as any,
      signOut: jest.fn() as any,
      resetPassword: jest.fn() as any,
      loading: false,
    });

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

  it("should fetch templates on mount", async () => {
    const mockWorkouts = [mockWorkout];
    mockWorkoutsAPI.getAll.mockResolvedValue(mockWorkouts);

    const { result } = renderHook(() => useWorkoutTemplates());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.templates).toEqual(mockWorkouts);
    expect(mockWorkoutsAPI.getAll).toHaveBeenCalledTimes(1);
  });

  it("should create a new template", async () => {
    mockWorkoutsAPI.getAll.mockResolvedValue([]);
    mockWorkoutsAPI.create.mockResolvedValue(mockWorkout);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.createTemplate(
      "Push Day",
      [mockWorkoutExercise],
      "45-60 mins"
    );

    expect(mockWorkoutsAPI.create).toHaveBeenCalledWith(
      "Push Day",
      [mockWorkoutExercise],
      "45-60 mins"
    );
  });

  it("should update an existing template", async () => {
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
    mockWorkoutsAPI.update.mockResolvedValue({
      ...mockWorkout,
      name: "Updated Workout",
    });

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updateTemplate(mockWorkout.id, {
      name: "Updated Workout",
    });

    expect(mockWorkoutsAPI.update).toHaveBeenCalledWith(mockWorkout.id, {
      name: "Updated Workout",
    });
  });

  it("should delete a template", async () => {
    mockWorkoutsAPI.getAll.mockResolvedValue([mockWorkout]);
    mockWorkoutsAPI.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteTemplate(mockWorkout.id);

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
