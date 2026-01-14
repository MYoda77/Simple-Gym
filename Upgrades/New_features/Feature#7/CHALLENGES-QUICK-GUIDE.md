# ⚡ Daily/Weekly Challenges - Quick Guide

**Feature #7 - Time-limited goals with bonus rewards!**

---

## 📦 Files

1. **challenges.ts** - Challenge logic & generation
2. **ChallengesUI.tsx** - UI components

---

## 🎯 Challenge Types

### **Daily Challenges (3 random):**
- 🏋️ Complete 1 workout (+10 pts)
- 💪 Complete 15 sets (+15 pts)
- 🎯 Try 5 exercises (+12 pts)
- 🔥 Set a PR (+20 pts)

### **Weekly Challenges (2 random):**
- ⭐ Complete 3 workouts (+30 pts)
- 🏆 Complete 5 workouts (+50 pts)
- 💥 Complete 50 sets (+40 pts)
- 🔥 7-day streak (+75 pts)

**Resets:** Daily (midnight), Weekly (Monday)

---

## 🚀 Quick Integration

### **Step 1: Add State**
```typescript
import { generateDailyChallenges, generateWeeklyChallenges, updateChallengeProgress } from '@/utils/challenges';

const [challenges, setChallenges] = useState([
  ...generateDailyChallenges(),
  ...generateWeeklyChallenges(),
]);
```

### **Step 2: Update Progress**
```typescript
// After each workout
const updatedChallenges = updateChallengeProgress(challenges, {
  workoutsToday: 1,
  setsToday: 12,
  exercisesToday: 6,
  prToday: false,
  workoutsThisWeek: 3,
  setsThisWeek: 45,
  exercisesThisWeek: 15,
  streakDays: 5,
  prsThisWeek: 2,
});
setChallenges(updatedChallenges);
```

### **Step 3: Add to Dashboard**
```typescript
import { ChallengesWidget } from '@/components/gym/ChallengesUI';

<ChallengesWidget
  challenges={challenges}
  onViewAll={() => navigate('/challenges')}
/>
```

### **Step 4: Create Challenges Page**
```typescript
import { ChallengesDashboard } from '@/components/gym/ChallengesUI';

<ChallengesDashboard challenges={challenges} />
```

---

## 🎨 UI

### **Challenge Card:**
```
┌──────────────────────────────┐
│ 🏋️ Daily Grind    [daily]   │
│ Complete 1 workout today     │
│ 1/1 ████████████████ 100%   │
│ +10 pts  +50 XP   ⏰ 5h 30m │
└──────────────────────────────┘
```

### **Widget:**
```
┌──────────────────────────────┐
│ 🎯 Today's Challenges        │
├──────────────────────────────┤
│ 🏋️ Daily Grind         1/1  │
│ ████████████████████ 100%    │
│ 💪 Volume Beast        8/15  │
│ ████████░░░░░░░░░░░░ 53%     │
└──────────────────────────────┘
```

---

## ✅ Quick Setup

1. Copy files to project
2. Generate challenges on app load
3. Update after each workout
4. Refresh at midnight/Monday
5. Award points on completion

---

## 🎊 Benefits

- ⚡ **Daily goals** keep users engaged
- 🏆 **Bonus points** accelerate progression
- ⏰ **Time pressure** creates urgency
- 🎯 **Variety** encourages different activities
- 📈 **Retention** through daily check-ins

---

## 💡 Pro Tips

**Notifications:** Alert when challenges refresh  
**Streaks:** Track consecutive completions  
**Bonuses:** Extra points for completing all daily  
**History:** Show past week's completions

---

**That's it! Time-limited challenges in ~20 minutes!** ⚡🎯
