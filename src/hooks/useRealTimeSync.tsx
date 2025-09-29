// src/hooks/useRealTimeSync.tsx
import { useEffect, useRef, useCallback } from "react";
import { subscriptions, auth } from "@/lib/pocketbase";
import { useToast } from "@/hooks/use-toast";

export interface RealtimeEvent {
  collection: string;
  action: "create" | "update" | "delete";
  record: Record<string, unknown>;
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

  const setupSubscriptions = useCallback(async () => {
    if (!auth.isLoggedIn) return;

    try {
      // Clear existing subscriptions
      cleanup();

      const unsubscribers: (() => void)[] = [];

      // Subscribe to custom exercises changes
      if (callbacks.onCustomExerciseChange) {
        const unsubscribe = await subscriptions.subscribeToCustomExercises(
          (data) => {
            const event: RealtimeEvent = {
              collection: "custom_exercises",
              action: data.action,
              record: data.record,
            };
            callbacks.onCustomExerciseChange!(event);

            // Show toast notification for changes from other devices
            if (data.action === "create") {
              toast({
                title: "New Custom Exercise",
                description: `"${data.record.name}" was added from another device`,
              });
            } else if (data.action === "update") {
              toast({
                title: "Exercise Updated",
                description: `"${data.record.name}" was updated from another device`,
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
      if (callbacks.onWorkoutChange) {
        const unsubscribe = await subscriptions.subscribeToWorkouts((data) => {
          const event: RealtimeEvent = {
            collection: "workouts",
            action: data.action,
            record: data.record,
          };
          callbacks.onWorkoutChange!(event);

          // Show toast notification
          if (data.action === "create") {
            toast({
              title: "New Workout Template",
              description: `"${data.record.name}" was created from another device`,
            });
          } else if (data.action === "update") {
            toast({
              title: "Workout Updated",
              description: `"${data.record.name}" was updated from another device`,
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

      // You could add more subscriptions for progress and schedule
      // Example for progress (would need to add to pocketbase.ts subscriptions):
      /*
      if (callbacks.onProgressChange) {
        const unsubscribe = await subscriptions.subscribeToProgress((data) => {
          const event: RealtimeEvent = {
            collection: 'progress',
            action: data.action,
            record: data.record
          };
          callbacks.onProgressChange!(event);
          
          if (data.action === 'create') {
            toast({
              title: "Progress Updated",
              description: "New progress entry added from another device"
            });
          }
        });
        unsubscribers.push(unsubscribe);
      }
      */

      unsubscribeFunctions.current = unsubscribers;
      isConnected.current = true;

      // Show connection success
      toast({
        title: "Real-time Sync Connected",
        description: "Changes will sync across your devices",
      });
    } catch (error) {
      console.error("Failed to setup real-time subscriptions:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to real-time sync";

      if (callbacks.onError) {
        callbacks.onError(errorMessage);
      }

      toast({
        title: "Sync Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [callbacks, toast]);

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
  }, [
    callbacks.onCustomExerciseChange,
    callbacks.onWorkoutChange,
    callbacks.onProgressChange,
    callbacks.onScheduleChange,
    callbacks.onError,
    setupSubscriptions,
  ]);

  return {
    isConnected: isConnected.current,
    reconnect,
    disconnect: cleanup,
  };
};
