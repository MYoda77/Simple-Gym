// ============================================
// UPDATED assignWorkout Function with Rest Day Support
// Replace lines 1297-1312 in Index.tsx
// ============================================

const assignWorkout = async (workoutName: string) => {
  const dateKey = formatDateKey(selectedDate);
  
  try {
    // Handle Rest Day (no workout template needed)
    if (workoutName === "Rest Day") {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Create schedule entry without workout_id
      const { error } = await supabase
        .from('schedule')
        .insert({
          scheduled_date: dateKey,
          workout_id: null, // ✅ NULL for Rest Days
          notes: "Recovery and stretching",
          rest_day_type: "complete", // Default rest day type
          user_id: user.id,
          completed: false,
        });
      
      if (error) throw error;
      
      // Note: Real-time sync should automatically refresh the schedule
      // If it doesn't appear immediately, you may need to manually call refreshSchedule()
      
      toast({
        title: "Rest Day Scheduled",
        description: `Rest day scheduled for ${selectedDate.toLocaleDateString()}`,
      });
      return;
    }

    // Handle regular workouts
    // Find the workout template by name to get its ID
    const workoutTemplate = workoutTemplates.find(
      (template) => template.name === workoutName
    );

    if (!workoutTemplate) {
      toast({
        title: "Error",
        description: `Workout "${workoutName}" not found`,
        variant: "destructive",
      });
      return;
    }

    // Call scheduleWorkout with correct parameters: (workoutId, date)
    await scheduleWorkout(workoutTemplate.id, dateKey);
    
    toast({
      title: "Workout Scheduled",
      description: `${workoutName} has been scheduled for ${selectedDate.toLocaleDateString()}`,
    });
    
  } catch (error: any) {
    console.error("Failed to schedule:", error);
    toast({
      title: "Error Scheduling",
      description: error.message || "Failed to schedule. Please try again.",
      variant: "destructive",
    });
  }
};
