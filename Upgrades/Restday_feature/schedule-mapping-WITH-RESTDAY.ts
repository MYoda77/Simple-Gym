// ============================================
// UPDATED Schedule Mapping with Rest Day Support
// Replace lines 529-535 in Index.tsx
// ============================================

const schedule = useMemo(() => {
  const result: Record<string, string> = {};
  scheduleEntries.forEach((entry) => {
    const dateKey = entry.scheduled_date;
    
    // If no workout_id, it's a Rest Day
    if (!entry.workout_id) {
      result[dateKey] = 'Rest Day';
    } else {
      // Regular workout - get name from joined workout data
      const workoutName = entry.workouts?.name || 'Unknown Workout';
      result[dateKey] = workoutName;
    }
  });
  return result;
}, [scheduleEntries]);
