# SimpleGym Application - Summary & Testing Setup

## 🎯 Application Overview

**SimpleGym** is a comprehensive fitness tracking web application built with modern web technologies. Here's what it does:

### Key Features

1. **User Authentication**

   - Sign up, sign in, sign out, password reset
   - Powered by Supabase authentication
   - Protected routes for authenticated users

2. **Exercise Database**

   - Pre-loaded exercise library with 100+ exercises
   - Create custom exercises with detailed information
   - Filter by muscle group, equipment, difficulty, complexity
   - Each exercise includes instructions, tips, required equipment

3. **Workout Templates**

   - Create, edit, duplicate, and delete workout templates
   - Add multiple exercises with sets, reps, weight, rest intervals
   - Real-time sync across devices
   - Store in Supabase database

4. **Active Workout Tracking**

   - Start workouts from templates or create new ones
   - Real-time timer for workout duration
   - Track sets completion
   - Rest timer between sets
   - Save completed workouts to history

5. **Weekly Schedule**

   - Calendar view of planned workouts
   - Schedule workouts for specific days
   - Mark workouts as complete
   - View workout details

6. **Progress Tracking** (`/progress` page)

   - Weight logging with charts
   - Body measurements tracking
   - Progress photos (before/after)
   - Achievement milestones
   - Recent activity feed
   - BMI calculation and visualization

7. **Data Management**
   - Export all data to JSON
   - Import data from JSON backup
   - Reset all data option

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Real-time**: Supabase real-time subscriptions
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── gym/           # Workout-related components
│   ├── progress/      # Progress tracking components
│   └── ui/            # Reusable UI components (Radix UI)
├── hooks/
│   ├── useAuth.tsx              # Authentication hook
│   ├── useCustomExercises-*     # Custom exercises management
│   ├── useWorkoutTemplates-*    # Workout templates management
│   ├── useProgressTracking-*    # Progress data management
│   ├── useSchedule-*            # Schedule management
│   └── useRealTimeSync.tsx      # Real-time subscription handling
├── lib/
│   ├── supabase-config.ts       # Supabase client & types
│   ├── supabase-api.ts          # API functions for CRUD operations
│   └── utils.ts                 # Utility functions
├── pages/
│   ├── Index.tsx        # Main dashboard page
│   ├── Progress.tsx     # Progress tracking page
│   └── NotFound.tsx     # 404 page
├── types/
│   ├── gym.ts           # Workout-related types
│   └── progress.ts      # Progress-related types
├── data/
│   └── exercises.ts     # Pre-loaded exercise database
└── utils/
    └── workoutUtils.ts  # Workout calculation utilities
```

## 🧪 Testing Setup

### Installed Testing Dependencies

- **jest**: Test runner and assertion library
- **@testing-library/react**: React component testing
- **@testing-library/jest-dom**: Custom matchers for DOM
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/dom**: DOM testing utilities
- **ts-jest**: TypeScript support for Jest
- **identity-obj-proxy**: CSS modules mock

### Test Scripts

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Files Created

1. **Unit Tests**

   - ✅ `src/utils/workoutUtils.test.ts` - Tests for workout calculation utilities

2. **Hook Tests**

   - ✅ `src/hooks/useWorkoutTemplates-COMPATIBLE.test.tsx` - Workout templates hook tests
   - ✅ `src/lib/useAuth.test.tsx` - Authentication hook tests

3. **Component Tests**

   - ✅ `src/components/ui/button.test.tsx` - Button component tests
   - ✅ `src/components/gym/Header.test.tsx` - Header component tests
   - ✅ `src/App.test.tsx` - Main App component tests

4. **Test Utilities**
   - `src/__tests__/test-utils.tsx` - Custom render function with providers
   - `src/__tests__/fixtures.ts` - Mock data for tests
   - `src/__mocks__/supabase-api.ts` - Mocked API functions
   - `src/__mocks__/@supabase/supabase-js.ts` - Mocked Supabase client
   - `src/__mocks__/fileMock.js` - Static asset mocks

### Configuration Files

- `jest.config.js` - Jest configuration with TypeScript support
- `jest.setup.ts` - Global test setup (mocks for window APIs)

### Current Test Coverage

The codebase now has:

- ✅ Utility function tests (formatDuration, getDifficultyColor, etc.)
- ✅ Hook tests (useAuth, useWorkoutTemplates)
- ✅ Component tests (Button, Header, App)
- ✅ Mock infrastructure for Supabase

### Next Steps for Testing

To expand test coverage, consider:

1. **Component Tests**

   - Dashboard component
   - ActiveWorkoutView component
   - WeeklySchedule component
   - Progress page components
   - Auth dialog components

2. **Hook Tests**

   - useCustomExercises hook
   - useProgressTracking hook
   - useSchedule hook
   - useRealTimeSync hook

3. **Integration Tests**

   - User authentication flow
   - Creating and starting a workout
   - Completing a workout session
   - Logging progress data

4. **E2E Tests** (future)
   - Full user journeys with Playwright or Cypress

## 🚀 Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Additional Documentation

- See [TESTING.md](./TESTING.md) for detailed testing guide
- See [README.md](./README.md) for deployment instructions

## 🎨 Key Components Explained

### Dashboard View

Shows workout stats, recent workouts, quick actions to start workouts or browse exercises.

### Schedule View

Calendar interface to plan workouts for the week, with drag-and-drop support.

### Workouts View

Browse all saved workout templates, create new workouts, edit or delete existing ones.

### Exercises View

Searchable database of exercises with advanced filtering by muscle group, equipment, difficulty.

### Active Workout View

Real-time workout tracking with timer, set completion tracking, and rest intervals.

### Progress View (`/progress` page)

Comprehensive progress tracking with weight charts, measurements, photos, and achievements.

## 🔐 Authentication Flow

1. User lands on login page
2. Can sign up with email/password or sign in
3. On successful auth, redirected to dashboard
4. All workout/progress data is user-specific
5. Real-time sync keeps data updated across tabs/devices

## 💾 Data Management

All user data is stored in Supabase with these tables:

- `custom_exercises` - User-created exercises
- `workouts` - Workout templates
- `workout_sessions` - Completed workout records
- `schedule` - Scheduled workouts
- `progress` - Weight logs, measurements, photos

Real-time subscriptions ensure data stays in sync across all components.

---

**Developer**: Coast (@coast_dev)  
**Last Updated**: January 2026
