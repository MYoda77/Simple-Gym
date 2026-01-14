-- ============================================
-- MISSING TABLES FOR FULL SUPABASE MIGRATION
-- Run these SQL commands in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PERSONAL RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight_kg DECIMAL NOT NULL,
  reps INTEGER,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, exercise_name)
);

-- Enable Row Level Security
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own personal records" ON personal_records;
DROP POLICY IF EXISTS "Users can insert their own personal records" ON personal_records;
DROP POLICY IF EXISTS "Users can update their own personal records" ON personal_records;
DROP POLICY IF EXISTS "Users can delete their own personal records" ON personal_records;

-- Create policies for personal_records
CREATE POLICY "Users can view their own personal records"
  ON personal_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personal records"
  ON personal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal records"
  ON personal_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal records"
  ON personal_records FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_name ON personal_records(user_id, exercise_name);

-- ============================================
-- 2. WORKOUT HISTORY TABLE (NEW - For Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS workout_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_date TIMESTAMP WITH TIME ZONE NOT NULL,
  workout_name TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  total_exercises INTEGER NOT NULL,
  total_sets INTEGER NOT NULL,
  exercise_details JSONB -- Stores array of {exerciseName, sets: [{reps, weight}]}
);

-- Enable Row Level Security
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own workout history" ON workout_history;
DROP POLICY IF EXISTS "Users can insert their own workout history" ON workout_history;
DROP POLICY IF EXISTS "Users can delete their own workout history" ON workout_history;

-- Create policies for workout_history
CREATE POLICY "Users can view their own workout history"
  ON workout_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout history"
  ON workout_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout history"
  ON workout_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_workout_history_user_id ON workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_history_date ON workout_history(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_history_exercise_details ON workout_history USING GIN (exercise_details);

-- ============================================
-- 4. ACTIVITIES FEED TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'workout', 'pr', 'weight', 'photo', etc.
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  icon TEXT,
  metadata JSONB -- For storing additional data like workout_id, exercise_name, etc.
);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON activities;

-- Create policies for activities
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON activities FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(user_id, date DESC);

-- ============================================
-- 5. USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can delete their own achievements" ON user_achievements;

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON user_achievements FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- ============================================
-- 6. PROGRESS PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL, -- URL from Supabase Storage
  photo_date DATE NOT NULL,
  weight_kg DECIMAL,
  notes TEXT,
  storage_path TEXT -- Path in Supabase Storage for deletion
);

-- Enable Row Level Security
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can insert their own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can update their own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can delete their own progress photos" ON progress_photos;

-- Create policies for progress_photos
CREATE POLICY "Users can view their own progress photos"
  ON progress_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos"
  ON progress_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress photos"
  ON progress_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos"
  ON progress_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_date ON progress_photos(user_id, photo_date DESC);

-- ============================================
-- 7. USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  height_cm DECIMAL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. UPDATE TRIGGER FUNCTIONS
-- ============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_personal_records_updated_at ON personal_records;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;

-- Add triggers for updated_at
CREATE TRIGGER update_personal_records_updated_at
    BEFORE UPDATE ON personal_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. STORAGE BUCKET FOR PROGRESS PHOTOS
-- ============================================
-- Run this in the Supabase Storage section:
-- 1. Create a new bucket called 'progress-photos'
-- 2. Make it private (not public)
-- 3. Set up policies:

/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false);

-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own photos
CREATE POLICY "Users can view their own progress photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own progress photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
*/
