export interface Stat {
  label: string;
  value: string | number;
  icon: string;
  unit?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date?: string; // Legacy support
  unlockedAt?: string; // New format from achievementSystem
  icon: string;
  description?: string;
  category?: "beginner" | "workout" | "pr" | "streak" | "weekly" | "special";  condition?: (stats: any) => boolean; // For achievementSystem compatibility}

export interface ProgressPhoto {
  before: string;
  after: string;
  date: string;
  id: string;
}

export interface Activity {
  id: string;
  date: string;
  description: string;
  icon: string;
  type: "workout" | "weight" | "photo" | "achievement" | "pr";
}

export interface ProgressData {
  weight: { date: string; value: number }[];
  bmi: { date: string; value: number }[];
  measurements: { date: string; chest: number; waist: number; arms: number }[];
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

export type ChartPeriod = "week" | "month" | "quarter" | "year";
export type ChartType = "weight" | "bmi" | "measurements";
