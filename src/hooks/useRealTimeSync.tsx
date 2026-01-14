// src/hooks/useRealTimeSync.tsx
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-config";
import { authAPI } from "@/lib/supabase-api";
import { useToast } from "@/hooks/use-toast";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeEvent {
  collection: string;
  action: "INSERT" | "UPDATE" | "DELETE";
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
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const isConnected = useRef(false);
  const hasShownConnectedToast = useRef(false);
  const callbacksRef = useRef(callbacks);

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const cleanup = () => {
    channelsRef.current.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
    isConnected.current = false;
  };

  const setupSubscriptions = async () => {
    const user = await authAPI.getCurrentUser();
    if (!user) return;

    try {
      cleanup();
      const channels: RealtimeChannel[] = [];

      // Subscribe to custom exercises changes
      if (callbacksRef.current.onCustomExerciseChange) {
        const customExercisesChannel = supabase
          .channel("custom-exercises-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "custom_exercises",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const event: RealtimeEvent = {
                collection: "custom_exercises",
                action: payload.eventType,
                record: payload.new || payload.old,
              };
              callbacksRef.current.onCustomExerciseChange?.(event);

              const recordName =
                (payload.new as { name?: string })?.name || "Exercise";
              if (payload.eventType === "INSERT") {
                toast({
                  title: "New Custom Exercise",
                  description: `"${recordName}" was added from another device`,
                });
              } else if (payload.eventType === "UPDATE") {
                toast({
                  title: "Exercise Updated",
                  description: `"${recordName}" was updated from another device`,
                });
              } else if (payload.eventType === "DELETE") {
                toast({
                  title: "Exercise Deleted",
                  description: "An exercise was deleted from another device",
                  variant: "destructive",
                });
              }
            }
          )
          .subscribe();
        channels.push(customExercisesChannel);
      }

      // Subscribe to workout template changes
      if (callbacksRef.current.onWorkoutChange) {
        const workoutsChannel = supabase
          .channel("workouts-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "workouts",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const event: RealtimeEvent = {
                collection: "workouts",
                action: payload.eventType,
                record: payload.new || payload.old,
              };
              callbacksRef.current.onWorkoutChange?.(event);

              const workoutName =
                (payload.new as { name?: string })?.name || "Workout";
              if (payload.eventType === "INSERT") {
                toast({
                  title: "New Workout Template",
                  description: `"${workoutName}" was created from another device`,
                });
              } else if (payload.eventType === "UPDATE") {
                toast({
                  title: "Workout Updated",
                  description: `"${workoutName}" was updated from another device`,
                });
              } else if (payload.eventType === "DELETE") {
                toast({
                  title: "Workout Deleted",
                  description:
                    "A workout template was deleted from another device",
                  variant: "destructive",
                });
              }
            }
          )
          .subscribe();
        channels.push(workoutsChannel);
      }

      channelsRef.current = channels;
      isConnected.current = true;

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
    setupSubscriptions();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authAPI.onAuthStateChange((newUser) => {
      if (newUser) {
        setupSubscriptions();
      } else {
        cleanup();
      }
    });

    return () => {
      subscription.unsubscribe();
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected: isConnected.current,
    reconnect,
    disconnect: cleanup,
  };
};
