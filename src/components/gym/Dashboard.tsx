import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Flame,
  Dumbbell,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WorkoutRecord, ProgressData } from "@/types/gym";
import { Achievement, UserStats } from "@/utils/achievementSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAchievementShowcase } from "./AchievementComponents";
import { RecommendationWidget } from "./AIRecommendationsUI";
import { WorkoutRecommendation } from "@/utils/aiRecommendations";
import { TierBadge } from "./RarityUI";
import { MobileStatCard, StatGrid } from "./MobileStatCard";
import {
  calculateTotalPoints,
  calculateTierProgress,
} from "@/utils/achievementRarity";

interface DashboardProps {
  workoutHistory: WorkoutRecord[];
  personalRecords: Record<string, number>;
  progressData: ProgressData[];
  achievements: Achievement[];
  stats: UserStats;
  recommendations?: WorkoutRecommendation[];
  onViewAllRecommendations?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  workoutHistory,
  personalRecords,
  progressData,
  achievements,
  stats,
  recommendations = [],
  onViewAllRecommendations,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recentWorkouts = workoutHistory.slice(-7);
  const totalWorkouts = workoutHistory.length;
  const thisWeekWorkouts = workoutHistory.filter((w) => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate > weekAgo;
  }).length;

  // Calculate workout streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (workoutHistory.length === 0) return 0;

    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      // Check last 30 days max
      const dateStr = checkDate.toISOString().split("T")[0];
      const hasWorkout = sortedWorkouts.some(
        (w) => w.date.split("T")[0] === dateStr
      );

      if (hasWorkout) {
        streak++;
      } else if (streak > 0) {
        break; // End streak if we find a day without workout
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate achievement points and tier
  const totalPoints = calculateTotalPoints(achievements);
  const tierProgress = calculateTierProgress(totalPoints);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Stat - Current Streak (Mobile-First, Large Impact) */}
      <MobileStatCard
        icon={<Flame className="w-8 h-8 md:w-10 md:h-10" />}
        value={currentStreak}
        label="Day Streak"
        subtitle={
          currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"
        }
        variant="hero"
      />

      {/* Secondary Stats Grid (2 columns mobile, 4 columns desktop) */}
      <StatGrid>
        <MobileStatCard
          icon={<Dumbbell className="w-6 h-6" />}
          value={totalWorkouts}
          label="Total Workouts"
          trend={{ value: `+${thisWeekWorkouts}`, positive: true }}
        />
        <MobileStatCard
          icon={<Calendar className="w-6 h-6" />}
          value={thisWeekWorkouts}
          label="This Week"
        />
        <MobileStatCard
          icon={<Award className="w-6 h-6" />}
          value={Object.keys(personalRecords).length}
          label="Personal Records"
          subtitle="PRs achieved"
        />
        <MobileStatCard
          icon={<Star className="w-6 h-6" />}
          value={totalPoints}
          label="Achievement Points"
          subtitle={`${tierProgress.currentTier} Tier`}
          variant="gradient"
        />
      </StatGrid>

      {/* Weight Progress Chart */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground text-xl md:text-2xl">
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "14px" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "14px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground text-xl md:text-2xl">
            Recent Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentWorkouts.map((workout, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 md:p-3 bg-muted/20 rounded-lg backdrop-blur-sm border border-border/30 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div>
                  <p className="font-medium text-foreground text-base md:text-sm">
                    {workout.name}
                  </p>
                  <p className="text-sm md:text-xs text-muted-foreground">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-xs text-foreground">
                    {formatTime(workout.duration)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {workout.totalSets} sets
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Records */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground text-xl md:text-2xl">
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(personalRecords).map(([exercise, weight]) => (
              <div
                key={exercise}
                className="p-6 md:p-4 bg-accent rounded-lg border border-accent/20 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <p className="text-sm md:text-xs text-accent-foreground/80">
                  {exercise}
                </p>
                <p className="text-2xl md:text-xl font-bold text-accent-foreground">
                  {weight}kg
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Widget */}
      {recommendations && recommendations.length > 0 ? (
        <RecommendationWidget
          recommendations={recommendations}
          onViewAll={onViewAllRecommendations}
        />
      ) : (
        <div className="text-base md:text-sm text-muted-foreground p-4">
          Complete more workouts to receive AI recommendations (Count:{" "}
          {recommendations?.length || 0})
        </div>
      )}

      {/* Achievement Showcase */}
      <DashboardAchievementShowcase achievements={achievements} stats={stats} />
    </div>
  );
};

export default Dashboard;
