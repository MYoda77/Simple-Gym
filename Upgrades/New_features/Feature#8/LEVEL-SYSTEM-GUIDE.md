# 🎮 Level & XP System - Quick Guide

**Feature #8 - RPG-style progression!**

---

## 📦 Files

1. **levelSystem.ts** - Level calculations & XP rewards
2. **LevelSystemUI.tsx** - Level display components

---

## 🎯 How It Works

### **XP Sources:**
- Complete workout: +100 XP
- Per set: +5 XP
- Per rep: +1 XP
- Personal record: +150 XP
- Daily challenge: +50 XP
- Weekly challenge: +200 XP
- Achievement (rare): +150 XP
- Achievement (legendary): +1000 XP

### **Level Curve:**
```
Level 1  → 100 XP
Level 10 → 3,162 XP
Level 50 → 35,355 XP
Level 100 → 100,000 XP
```

### **Level Titles:**
- Lv.1: 🥚 Newbie
- Lv.10: 💪 Regular
- Lv.20: 🔥 Dedicated
- Lv.30: 💎 Expert
- Lv.50: 👑 Champion
- Lv.100: 🌟 Immortal

### **Rewards:**
- Lv.5: Custom templates (+50 pts)
- Lv.10: Exercise notes (+100 pts)
- Lv.20: Custom themes (+200 pts)
- Lv.50: Master badge (+1000 pts)

---

## 🚀 Quick Integration

### **Step 1: Track Total XP**
```typescript
const [totalXP, setTotalXP] = useState(0);
const userLevel = calculateLevelFromXP(totalXP);
```

### **Step 2: Award XP After Workout**
```typescript
import { calculateWorkoutXP, addXP } from '@/utils/levelSystem';

// Calculate XP earned
const { total, breakdown } = calculateWorkoutXP({
  sets: 12,
  reps: 120,
  isFirstToday: true,
  hadPR: false,
  streakBonus: true,
});

// Add XP
const { newLevel, leveledUp, levelsGained } = addXP(totalXP, total);
setTotalXP(newLevel.totalXP);

// Show level up modal if leveled up
if (leveledUp) {
  showLevelUpModal(newLevel.level);
}
```

### **Step 3: Add to Dashboard**
```typescript
import { LevelWidget, XPProgressCard } from '@/components/gym/LevelSystemUI';

<LevelWidget userLevel={userLevel} />
<XPProgressCard userLevel={userLevel} />
```

### **Step 4: Show XP After Workout**
```typescript
import { XPBreakdown } from '@/components/gym/LevelSystemUI';

<XPBreakdown breakdown={breakdown} total={total} />
```

### **Step 5: Level Up Modal**
```typescript
import { LevelUpModal, getLevelRewards } from '@/utils/levelSystem';

{showLevelUp && (
  <LevelUpModal
    newLevel={newLevel.level}
    rewards={getLevelRewards(newLevel.level)}
    onClose={() => setShowLevelUp(false)}
  />
)}
```

---

## 🎨 UI Examples

### **Level Badge:**
```
[Lv.25 🔥 Dedicated]
```

### **Progress Card:**
```
┌──────────────────────────────┐
│ ⚡ Level Progress  [Lv.25]  │
├──────────────────────────────┤
│ 12,500 / 15,811 XP          │
│ [███████████░░░░░] 79%       │
│                              │
│ 🎁 Unlock at Level 30:       │
│ • Premium exercises          │
│ • +300 Points                │
└──────────────────────────────┘
```

### **Level Up Modal:**
```
┌──────────────────────────────┐
│        👑 (bouncing)         │
│       Level Up!              │
│   [Lv.30 💎 Expert]          │
│                              │
│   Rewards Unlocked!          │
│   ⭐ Premium exercises        │
│   ⭐ Advanced analytics       │
│   🏆 +300 Bonus Points!      │
│                              │
│      [Awesome!]              │
└──────────────────────────────┘
```

### **XP Breakdown:**
```
┌──────────────────────────────┐
│ 🏆 XP Earned                 │
├──────────────────────────────┤
│ Workout Complete      +100   │
│ First Workout Today    +25   │
│ Streak Bonus           +50   │
│ 12 Sets                +60   │
│ 120 Reps              +120   │
├──────────────────────────────┤
│ Total XP              +355   │
└──────────────────────────────┘
```

---

## ⚡ Bonus Features

### **XP Multipliers:**
```typescript
import { getXPMultiplier } from '@/utils/levelSystem';

const multiplier = getXPMultiplier();
// Weekend: 1.5x
// Early bird (5-8am): 1.2x
// Night owl (9-11pm): 1.2x

const finalXP = baseXP * multiplier;
```

### **Achievement XP:**
```typescript
import { getAchievementXP } from '@/utils/levelSystem';

const xp = getAchievementXP('legendary'); // 1000 XP
```

### **Leaderboard:**
```typescript
import { generateLevelLeaderboard, LevelLeaderboard } from '@/utils/levelSystem';

const leaderboard = generateLevelLeaderboard({
  level: userLevel.level,
  totalXP: userLevel.totalXP,
});

<LevelLeaderboard entries={leaderboard} currentUserId="current" />
```

---

## 💡 Integration Tips

**1. Persist XP:**
```typescript
localStorage.setItem('totalXP', totalXP.toString());
// Or save to PocketBase
```

**2. Show XP everywhere:**
```typescript
// Header: Show level badge
// Dashboard: Progress card
// Workout complete: XP breakdown
// Achievements: XP notification
```

**3. Celebrate levels:**
```typescript
// Confetti on level up
// Play sound effect
// Show rewards immediately
```

**4. Retroactive XP:**
```typescript
// Calculate XP from past workouts
const retroXP = workoutHistory.reduce((sum, w) => 
  sum + calculateWorkoutXP(w).total, 0
);
```

---

## 🎊 Benefits

- 🎮 **RPG feel** - Makes fitness fun
- 📈 **Long-term goal** - Level 100 takes time
- 🏆 **Rewards** - Unlocks at milestones
- ⚡ **Instant feedback** - See XP after every action
- 🔥 **Motivation** - "One more workout for level up!"
- 📊 **Progress visible** - Level = skill

---

## ✅ Quick Checklist

- [ ] Add `totalXP` state
- [ ] Calculate XP after workout
- [ ] Show XP breakdown
- [ ] Add level badge to header
- [ ] Display level progress card
- [ ] Implement level up modal
- [ ] Add confetti on level up
- [ ] Award achievement XP
- [ ] Award challenge XP
- [ ] Test XP calculations
- [ ] Test level progression
- [ ] Add leaderboard (optional)

---

## 🎯 Example Flow

```
1. User completes workout
   ↓
2. Calculate XP earned (355 XP)
   ↓
3. Add to total XP (12,500 → 12,855)
   ↓
4. Check if leveled up (No)
   ↓
5. Show XP breakdown toast
   ↓
6. Update progress bar (79% → 81%)
   ↓
7. User sees progress toward Level 26
```

---

**That's it! RPG progression in ~20 minutes!** 🎮⚡

Add this and users will grind levels like it's World of Warcraft! 💪
