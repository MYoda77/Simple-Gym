# 🏆 Achievement System Integration Guide

Complete guide to integrate the badge/achievement system into SimpleGym.

---

## 📁 **Step 1: Add Files to Project**

### 1.1 Create Achievement System Logic

**File:** `src/utils/achievementSystem.ts`
**Location:** Copy from `/home/claude/achievementSystem.ts`
**Action:** Move this file to `src/utils/` in your project

### 1.2 Create Achievement Hook

**File:** `src/hooks/useAchievements.tsx`
**Location:** Copy from `/home/claude/useAchievements.tsx`
**Action:** Move this file to `src/hooks/` in your project

---

## 🔧 **Step 2: Integrate into Index.tsx**

### 2.1 Add Imports (Top of Index.tsx)

Add these imports after your existing imports (around line 50):

```typescript
import { useAchievements } from '@/hooks/useAchievements';
import { UserStats } from '@/utils/achievementSystem';
```

### 2.2 Add Achievement Hook (Around line 480, with other hooks)

Add this after your other hooks like `useProgressTracking`:

```typescript
// Achievement system
const {
  achievements,
  checkAndUnlockAchievements,
  resetAchievements,
} = useAchievements();
```

### 2.3 Create Stats Calculator Function

Add this function after your state declarations (around line 520):

```typescript
// Calculate user stats for achievement system
const calculateUserStats = useCallback((): UserStats => {
  // Get first workout date
  const firstWorkout = workoutHistory.length > 0 
    ? workoutHistory[workoutHistory.length - 1].date 
    : undefined;

  // Count unique exercises from workout history and personal records
  const uniqueExercises = new Set<string>();
  workoutHistory.forEach(workout => {
    if (workout.name) uniqueExercises.add(workout.name);
  });
  Object.keys(personalRecords).forEach(exercise => {
    uniqueExercises.add(exercise);
  });

  return {
    totalWorkouts: workoutHistory.length,
    thisWeekWorkouts: thisWeekWorkouts,
    totalPRs: Object.keys(personalRecords).length,
    currentStreak: currentStreak,
    maxStreak: currentStreak, // You can track max separately if needed
    weightLogged: progressData.length > 0,
    firstWorkoutDate: firstWorkout,
    totalWeight: 0, // Can be calculated from workout history if needed
    uniqueExercises: uniqueExercises.size,
  };
}, [workoutHistory, thisWeekWorkouts, personalRecords, currentStreak, progressData]);
```

### 2.4 Check Achievements When Setting PR

Find your `completeSet` function (around line 1090) and update the PR section:

**Find this code:**
```typescript
if (isNewRecord) {
  setPersonalRecords((prev) => ({
    ...prev,
    [exerciseName]: actualWeight,
  }));
  toast({
    title: "New Personal Record! 🏆",
    description: `${exerciseName}: ${actualWeight}kg (previous: ${
      currentRecord || "none"
    })`,
  });
}
```

**Replace with:**
```typescript
if (isNewRecord) {
  setPersonalRecords((prev) => ({
    ...prev,
    [exerciseName]: actualWeight,
  }));
  
  toast({
    title: "New Personal Record! 🏆",
    description: `${exerciseName}: ${actualWeight}kg (previous: ${
      currentRecord || "none"
    })`,
  });

  // Check for achievements after setting PR
  setTimeout(() => {
    const stats = calculateUserStats();
    const newAchievements = checkAndUnlockAchievements(stats);
    
    // Show achievement notification
    newAchievements.forEach((achievement) => {
      toast({
        title: `${achievement.icon} Achievement Unlocked!`,
        description: achievement.title,
      });
    });
  }, 500);
}
```

### 2.5 Check Achievements When Completing Workout

Find your `completeWorkout` function (around line 1120) and add this at the end, before the toast:

**Add before the final toast:**
```typescript
// Check for achievements after workout completion
setTimeout(() => {
  const stats = calculateUserStats();
  const newAchievements = checkAndUnlockAchievements(stats);
  
  // Show achievement notifications
  newAchievements.forEach((achievement) => {
    toast({
      title: `${achievement.icon} Achievement Unlocked!`,
      description: achievement.title,
    });
  });
}, 1000);
```

### 2.6 Pass Achievements to Progress Page

Find where you render the Progress component and pass achievements:

**In your Routes (if using React Router) or Progress page props:**

The Progress page already receives achievements from its own state, but we need to sync it.

Actually, let me check the Progress.tsx setup...

---

## 🎨 **Step 3: Update Progress Page**

The Progress page (`src/pages/Progress.tsx`) already has achievement state, so we need to connect it.

### 3.1 Option A: Share State (Recommended)

Pass achievements from Index.tsx to Progress page via route state or context.

### 3.2 Option B: Use Same Hook (Simpler)

Import `useAchievements` in Progress.tsx and replace the local achievements state:

**In Progress.tsx, find the achievements state (around line 70):**

```typescript
const [achievements, setAchievements] = useState<Achievement[]>(() => {
  const saved = localStorage.getItem("progress-achievements");
  // ... existing code
});
```

**Replace with:**

```typescript
// Import at top
import { useAchievements } from '@/hooks/useAchievements';

// Replace achievements state with hook
const { achievements } = useAchievements();
```

---

## 🧪 **Step 4: Test the System**

### Test Flow:
1. **Start the app** - Should see empty achievements
2. **Complete first workout** - Should unlock "First Steps 🎯"
3. **Set a PR** - Should unlock "Personal Best 🏆"
4. **Log weight** - Should unlock "Progress Tracker ⚖️"
5. **Complete 5 workouts** - Should unlock "Getting Started 💪"

### Watch for:
- Toast notifications when achievements unlock
- Achievements appearing on Progress page
- Achievements persisting after refresh

---

## 🎁 **Step 5: Add Reset Function (Optional)**

Add achievement reset to your data management:

**In your `resetAllData` function (around line 1440):**

Add this line:
```typescript
resetAchievements(); // Clear all achievements
```

---

## 📋 **Complete File Checklist**

- [ ] `src/utils/achievementSystem.ts` - Created
- [ ] `src/hooks/useAchievements.tsx` - Created  
- [ ] `src/pages/Index.tsx` - Updated with hook & checks
- [ ] `src/pages/Progress.tsx` - Updated to use hook (optional)
- [ ] Test: First workout unlocks achievement ✅
- [ ] Test: PR unlocks achievement ✅
- [ ] Test: Achievements persist ✅
- [ ] Test: Achievements show on Progress page ✅

---

## 🎉 **Achievement List**

Your app will now unlock:

**Beginner (3):**
- 🎯 First Steps - Complete first workout
- 🏆 Personal Best - Set first PR
- ⚖️ Progress Tracker - Log weight

**Workout Milestones (5):**
- 💪 Getting Started - 5 workouts
- 🔥 Committed - 10 workouts
- ⭐ Dedicated - 25 workouts
- 🌟 Fitness Enthusiast - 50 workouts
- 💯 Century Club - 100 workouts

**PR Achievements (3):**
- 📈 Record Breaker - 5 PRs
- 🎖️ PR Machine - 10 PRs
- 👑 Strength Master - 25 PRs

**Streak Achievements (4):**
- 🔥 On a Roll - 3 day streak
- ⚡ Week Warrior - 7 day streak
- 💥 Unstoppable - 14 day streak
- 🏅 Monthly Mastery - 30 day streak

**Weekly (2):**
- 📅 Consistent Week - 3 workouts/week
- ⚡ Power Week - 5 workouts/week

**Special (3):**
- 🎊 One Month Strong - 30 days since first workout
- 🗺️ Exercise Explorer - Try 10 exercises
- 🌍 Movement Master - Try 25 exercises

**Total: 20 Achievements!** 🏆

---

## 🐛 **Troubleshooting**

**Issue:** Achievements not unlocking
- Check console for errors
- Verify `calculateUserStats()` returns correct values
- Make sure `checkAndUnlockAchievements()` is being called

**Issue:** Achievements not persisting
- Check localStorage in browser DevTools
- Verify `localStorage.setItem('user-achievements', ...)` is working

**Issue:** Toast notifications not showing
- Verify `toast()` function is imported from `@/hooks/use-toast`
- Check that toasts aren't being blocked by too many notifications

---

## 🚀 **Future Enhancements**

- [ ] Add rarity levels (Common, Rare, Epic, Legendary)
- [ ] Add achievement points/score system
- [ ] Add progress bars for multi-stage achievements
- [ ] Add sound effects when unlocking
- [ ] Add confetti animation for big achievements
- [ ] Add social sharing for achievements
- [ ] Add hidden/secret achievements

**Ready to start?** Let me know which step you'd like help with! 💪
