// src/hooks/useRealTimeSync.tsx
import { useEffect, useRef } from "react";
import { subscriptions, auth } from "@/lib/pocketbase";
import { useToast } from "@/hooks/use-toast";

export interface RealtimeEvent {
  collection: string;
  action: "create" | "update" | "delete";
  record: unknown;
}

export interface SyncCallbacks {
  onCustomExerciseChange?: (event: RealtimeEvent) => void;
  onWorkoutChange?: (event: RealtimeEvent) => void;
  onProgressChange?: (event: RealtimeEvent) => void;
  onScheduleChange?: (event: RealtimeEvent) => void;
  onError?: (error: string) => void;
}

export const useRealTimeSync = (callbacks: SyncCallbacks = {}) => {
  const { toast } = useToast();
  const unsubscribeFunctions = useRef<(() => void)[]>([]);
  const isConnected = useRef(false);
  const hasShownConnectedToast = useRef(false); // Prevent toast spam
  const callbacksRef = useRef(callbacks); // Store callbacks in ref to avoid dependency issues

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const cleanup = () => {
    unsubscribeFunctions.current.forEach((unsubscribe) => {
      try {
        subscriptions.unsubscribe(unsubscribe);
      } catch (error) {
        console.warn("Failed to unsubscribe:", error);
      }
    });
    unsubscribeFunctions.current = [];
    isConnected.current = false;
  };

  const setupSubscriptions = async () => {
    if (!auth.isLoggedIn) return;

    try {
      // Clear existing subscriptions
      cleanup();

      const unsubscribers: (() => void)[] = [];

      // Subscribe to custom exercises changes
      if (callbacksRef.current.onCustomExerciseChange) {
        const unsubscribe = await subscriptions.subscribeToCustomExercises(
          (data) => {
            const event: RealtimeEvent = {
              collection: "custom_exercises",
              action: data.action,
              record: data.record,
            };
            callbacksRef.current.onCustomExerciseChange?.(event);

            // Show toast notification for changes from other devices
            const recordName =
              (data.record as { name?: string })?.name || "Exercise";
            if (data.action === "create") {
              toast({
                title: "New Custom Exercise",
                description: `"${recordName}" was added from another device`,
              });
            } else if (data.action === "update") {
              toast({
                title: "Exercise Updated",
                description: `"${recordName}" was updated from another device`,
              });
            } else if (data.action === "delete") {
              toast({
                title: "Exercise Deleted",
                description: "An exercise was deleted from another device",
                variant: "destructive",
              });
            }
          }
        );
        unsubscribers.push(unsubscribe);
      }

      // Subscribe to workout template changes
      if (callbacksRef.current.onWorkoutChange) {
        const unsubscribe = await subscriptions.subscribeToWorkouts((data) => {
          const event: RealtimeEvent = {
            collection: "workouts",
            action: data.action,
            record: data.record,
          };
          callbacksRef.current.onWorkoutChange?.(event);

          // Show toast notification
          const workoutName =
            (data.record as { name?: string })?.name || "Workout";
          if (data.action === "create") {
            toast({
              title: "New Workout Template",
              description: `"${workoutName}" was created from another device`,
            });
          } else if (data.action === "update") {
            toast({
              title: "Workout Updated",
              description: `"${workoutName}" was updated from another device`,
            });
          } else if (data.action === "delete") {
            toast({
              title: "Workout Deleted",
              description: "A workout template was deleted from another device",
              variant: "destructive",
            });
          }
        });
        unsubscribers.push(unsubscribe);
      }

      unsubscribeFunctions.current = unsubscribers;
      isConnected.current = true;

      // Only show connection toast ONCE per session
      if (!hasShownConnectedToast.current) {
        hasShownConnectedToast.current = true;
        toast({
          title: "Real-time Sync Active",
          description: "Changes will sync across your devices",
        });
      }
    } catch (error) {
      console.error("Failed to setup real-time subscriptions:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to real-time sync";

      if (callbacksRef.current.onError) {
        callbacksRef.current.onError(errorMessage);
      }

      toast({
        title: "Sync Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const reconnect = async () => {
    cleanup();
    await setupSubscriptions();
  };

  useEffect(() => {
    // Setup subscriptions when user is logged in
    if (auth.isLoggedIn) {
      setupSubscriptions();
    }

    // Listen for auth changes
    const unsubscribeAuth = auth.onChange((token, model) => {
      if (model) {
        setupSubscriptions();
      } else {
        cleanup();
      }
    });

    return () => {
      unsubscribeAuth();
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // FIXED: Empty dependency array - only run once on mount

  return {
    isConnected: isConnected.current,
    reconnect,
    disconnect: cleanup,
  };
};
