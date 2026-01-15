# 🛌 Complete Rest Day Implementation Guide

## Overview
This enables scheduling Rest Days without requiring a workout template, with support for future Rest Day customization.

---

## 🗄️ Step 1: Update Database Schema

Run in **Supabase SQL Editor:**

```sql
-- Make workout_id optional (allow NULL for Rest Days)
ALTER TABLE schedule 
ALTER COLUMN workout_id DROP NOT NULL;

-- Add a rest_day_type field for future customization
ALTER TABLE schedule
ADD COLUMN IF NOT EXISTS rest_day_type TEXT;

-- Add comments
COMMENT ON COLUMN schedule.workout_id IS 'Workout template ID - NULL for Rest Days';
COMMENT ON COLUMN schedule.rest_day_type IS 'Type of rest day: active, complete, stretching, etc.';

-- Verify changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'schedule'
AND column_name IN ('workout_id', 'rest_day_type', 'notes');
```

Expected output:
```
workout_id      | uuid  | YES
rest_day_type   | text  | YES
notes           | text  | YES
```

---

## 📝 Step 2: Update TypeScript Types

In `src/lib/supabase-config.ts`, update the Schedule interface:

```typescript
export interface Schedule {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  workout_id: string | null; // ✅ Changed: Now optional
  scheduled_date: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  rest_day_type?: string | null; // ✅ NEW field
  workouts?: Workout; // Joined workout data
}
```

---

## 🔧 Step 3: Update assignWorkout Function

In `src/pages/Index.tsx`, replace the `assignWorkout` function (lines ~1297-1312):

```typescript
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
      
      toast({
        title: "Rest Day Scheduled",
        description: `Rest day scheduled for ${selectedDate.toLocaleDateString()}`,
      });
      return;
    }

    // Handle regular workouts
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
```

---

## 🗺️ Step 4: Update Schedule Display Mapping

In `src/pages/Index.tsx`, update the schedule mapping (lines ~529-535):

```typescript
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
```

---

## ✅ Step 5: Verify Import

Make sure `supabase` is imported at the top of `Index.tsx`:

```typescript
import { supabase } from "@/lib/supabase-config";
```

---

## 🧪 Testing

1. **Test Rest Day Scheduling:**
   - Go to Calendar
   - Click on any date
   - Click "Rest Day"
   - Should see: ✅ "Rest Day Scheduled" toast
   - Calendar should show "Rest Day" on that date

2. **Test Workout Scheduling:**
   - Click on another date
   - Click "tester01"
   - Should see: ✅ "Workout Scheduled" toast
   - Calendar should show "tester01" on that date

3. **Test Database:**
   - Go to Supabase → Table Editor → schedule
   - Find a Rest Day entry
   - Should have: `workout_id = null`, `rest_day_type = "complete"`

---

## 🚀 Future Enhancements

### Phase 2: Rest Day Configuration

Create a **RestDayConfigDialog** component that allows users to:

**Rest Day Types:**
- **Complete Rest**: No activity, pure recovery
- **Active Recovery**: Light cardio, walking, yoga
- **Stretching/Mobility**: Flexibility work
- **Custom**: User-defined activities

**Configuration Options:**
```typescript
interface RestDayConfig {
  type: 'complete' | 'active' | 'stretching' | 'custom';
  activities?: string[]; // e.g., ["30min walk", "10min stretching"]
  duration_minutes?: number;
  notes?: string;
}
```

**Implementation Ideas:**
1. Add "Configure Rest Day" button when Rest Day is selected
2. Show different icons for different rest day types
3. Track rest day completion (did you do the stretching?)
4. Rest day streaks/stats

**Example UI Flow:**
```
User clicks "Rest Day" → Dialog opens
  ┌─────────────────────────────────┐
  │ Configure Rest Day               │
  │                                  │
  │ Type: [Complete Rest ▼]         │
  │                                  │
  │ Activities (optional):          │
  │ • Light stretching              │
  │ • Foam rolling                  │
  │                                  │
  │ Notes: Focus on lower back      │
  │                                  │
  │ [Cancel]  [Schedule Rest Day]   │
  └─────────────────────────────────┘
```

---

## 📊 Database Query Examples

**Get all Rest Days:**
```sql
SELECT * FROM schedule 
WHERE workout_id IS NULL 
ORDER BY scheduled_date DESC;
```

**Get Rest Days by type:**
```sql
SELECT * FROM schedule 
WHERE workout_id IS NULL 
AND rest_day_type = 'active';
```

**Update Rest Day type:**
```sql
UPDATE schedule 
SET rest_day_type = 'stretching', 
    notes = 'Focus on hip mobility'
WHERE id = 'your-schedule-id';
```

---

## 🎯 Summary

**What This Enables:**
✅ Schedule Rest Days without workout templates
✅ Rest Days appear on calendar like regular workouts
✅ Database ready for future Rest Day customization
✅ Clean separation between workouts and rest days

**Next Steps:**
1. Apply all changes above
2. Test thoroughly
3. (Optional) Build Rest Day configuration UI
4. (Optional) Add rest day analytics/tracking

---

If you get any errors, check:
- Database changes applied correctly
- Import statement for supabase exists
- Schedule type updated in TypeScript
- Real-time sync is working

Let me know if you want help building the Rest Day configuration UI! 🛌💪
