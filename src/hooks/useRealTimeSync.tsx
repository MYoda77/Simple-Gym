import { useEffect, useState } from "react";
import { realtimeAPI } from "@/lib/supabase-api";

/**
 * useRealTimeSync - Custom hook for managing real-time subscriptions
 *
 * Note: Real-time sync is already built into the individual hooks:
 * - useCustomExercises
 * - useWorkoutTemplates
 * - useProgressTracking
 * - useSchedule
 *
 * This hook provides additional flexibility for custom real-time subscriptions
 * if needed for specific components.
 */

interface UseRealTimeSyncOptions {
  onCustomExerciseChange?: (payload: any) => void;
  onWorkoutChange?: (payload: any) => void;
  onProgressChange?: (payload: any) => void;
  onScheduleChange?: (payload: any) => void;
}

export function useRealTimeSync(options: UseRealTimeSyncOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscriptions: any[] = [];

    // Subscribe to custom exercises changes
    if (options.onCustomExerciseChange) {
      const sub = realtimeAPI.subscribeToCustomExercises(
        options.onCustomExerciseChange
      );
      subscriptions.push(sub);
    }

    // Subscribe to workouts changes
    if (options.onWorkoutChange) {
      const sub = realtimeAPI.subscribeToWorkouts(options.onWorkoutChange);
      subscriptions.push(sub);
    }

    // Subscribe to progress changes
    if (options.onProgressChange) {
      const sub = realtimeAPI.subscribeToProgress(options.onProgressChange);
      subscriptions.push(sub);
    }

    // Subscribe to schedule changes
    if (options.onScheduleChange) {
      const sub = realtimeAPI.subscribeToSchedule(options.onScheduleChange);
      subscriptions.push(sub);
    }

    setIsConnected(subscriptions.length > 0);

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((sub) => {
        realtimeAPI.unsubscribe(sub);
      });
      setIsConnected(false);
    };
  }, [
    options.onCustomExerciseChange,
    options.onWorkoutChange,
    options.onProgressChange,
    options.onScheduleChange,
  ]);

  return {
    isConnected,
  };
}

/**
 * Example usage:
 *
 * const { isConnected } = useRealTimeSync({
 *   onWorkoutChange: (payload) => {
 *     console.log('Workout changed:', payload);
 *     // Custom logic here
 *   },
 *   onScheduleChange: (payload) => {
 *     console.log('Schedule changed:', payload);
 *     // Custom logic here
 *   },
 * });
 */
