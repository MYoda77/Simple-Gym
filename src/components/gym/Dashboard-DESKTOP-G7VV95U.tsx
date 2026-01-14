import React from "react";
import { Activity, Calendar, Award, TrendingUp, RotateCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WorkoutRecord, ProgressData } from "@/types/gym";
import { Achievement } from "@/types/progress";
import { UserStats } from "@/utils/achievementSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardAchievementShowcase } from "./AchievementComponents";

interface DashboardProps {
  workoutHistory: WorkoutRecord[];
  personalRecords: Record<string, number>;
  progressData: ProgressData[];
  achievements: Achievement[];
  stats: UserStats;
  onStartWorkout?: (workoutName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  workoutHistory,
  personalRecords,
  progressData,
  achievements,
  stats,
  onStartWorkout,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalWorkouts}
                </p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">
                  {thisWeekWorkouts}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PRs Set</p>
                <p className="text-2xl font-bold text-foreground">
                  {Object.keys(personalRecords).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentStreak} {currentStreak === 1 ? "day" : "days"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
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

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkouts.map((workout, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-muted/20 rounded-lg backdrop-blur-sm border border-border/30"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {workout.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-foreground">
                        {formatTime(workout.duration)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workout.totalSets} sets
                      </p>
                    </div>
                    {onStartWorkout && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onStartWorkout(workout.name)}
                        title="Repeat this workout"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Personal Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(personalRecords).map(([exercise, weight]) => (
              <div
                key={exercise}
                className="p-4 bg-accent rounded-lg border border-accent/20"
              >
                <p className="text-sm text-accent-foreground/80">{exercise}</p>
                <p className="text-xl font-bold text-accent-foreground">
                  {weight}kg
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      <DashboardAchievementShowcase achievements={achievements} stats={stats} />
    </div>
  );
};

export default Dashboard;
