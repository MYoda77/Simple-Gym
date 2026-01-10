import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutRecord } from "@/types/gym";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Target, Calendar, Clock } from "lucide-react";

interface WorkoutAnalyticsProps {
  workoutHistory: WorkoutRecord[];
  personalRecords: Record<string, number>;
}

type TimePeriod = "week" | "month" | "quarter" | "year";

export const WorkoutAnalytics = ({
  workoutHistory,
  personalRecords,
}: WorkoutAnalyticsProps) => {
  const [period, setPeriod] = useState<TimePeriod>("month");

  // Filter workouts by time period
  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    const daysBack = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    }[period];

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return workoutHistory.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= cutoffDate;
    });
  }, [workoutHistory, period]);

  // Calculate workout volume by week
  const weeklyVolumeData = useMemo(() => {
    const weekMap = new Map<
      string,
      { week: string; workouts: number; sets: number }
    >();

    filteredWorkouts.forEach((workout) => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      const existing = weekMap.get(weekKey);
      if (existing) {
        existing.workouts++;
        existing.sets += workout.totalSets || 0;
      } else {
        weekMap.set(weekKey, {
          week: `Week ${Math.ceil(date.getDate() / 7)}`,
          workouts: 1,
          sets: workout.totalSets || 0,
        });
      }
    });

    return Array.from(weekMap.values()).slice(-8); // Last 8 weeks
  }, [filteredWorkouts]);

  // Calculate muscle group distribution
  const muscleGroupData = useMemo(() => {
    const muscleMap = new Map<string, number>();

    filteredWorkouts.forEach((workout) => {
      // Extract muscle groups from workout name or use a default
      // This is a simplified version - you might want to enhance this logic
      const name = workout.name.toLowerCase();

      if (name.includes("chest") || name.includes("bench")) {
        muscleMap.set("Chest", (muscleMap.get("Chest") || 0) + 1);
      } else if (
        name.includes("back") ||
        name.includes("row") ||
        name.includes("pull")
      ) {
        muscleMap.set("Back", (muscleMap.get("Back") || 0) + 1);
      } else if (
        name.includes("leg") ||
        name.includes("squat") ||
        name.includes("deadlift")
      ) {
        muscleMap.set("Legs", (muscleMap.get("Legs") || 0) + 1);
      } else if (name.includes("shoulder") || name.includes("press")) {
        muscleMap.set("Shoulders", (muscleMap.get("Shoulders") || 0) + 1);
      } else if (
        name.includes("arm") ||
        name.includes("bicep") ||
        name.includes("tricep") ||
        name.includes("curl")
      ) {
        muscleMap.set("Arms", (muscleMap.get("Arms") || 0) + 1);
      } else if (name.includes("core") || name.includes("ab")) {
        muscleMap.set("Core", (muscleMap.get("Core") || 0) + 1);
      } else {
        muscleMap.set("Full Body", (muscleMap.get("Full Body") || 0) + 1);
      }
    });

    return Array.from(muscleMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredWorkouts]);

  // Calculate exercise frequency
  const exerciseFrequency = useMemo(() => {
    const exerciseMap = new Map<string, number>();

    filteredWorkouts.forEach((workout) => {
      exerciseMap.set(workout.name, (exerciseMap.get(workout.name) || 0) + 1);
    });

    return Array.from(exerciseMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 exercises
  }, [filteredWorkouts]);

  // Calculate PR progression over time
  const prProgressionData = useMemo(() => {
    // This would ideally track PRs over time
    // For now, we'll show current PRs as a simple bar chart
    return Object.entries(personalRecords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([exercise, weight]) => ({
        exercise:
          exercise.length > 15 ? exercise.substring(0, 15) + "..." : exercise,
        weight,
      }));
  }, [personalRecords]);

  // Calculate workout duration trends
  const durationTrendsData = useMemo(() => {
    const last10 = filteredWorkouts.slice(-10);
    return last10.map((workout, idx) => ({
      workout: idx + 1,
      duration: Math.round(workout.duration / 60), // Convert to minutes
    }));
  }, [filteredWorkouts]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSets = filteredWorkouts.reduce(
      (sum, w) => sum + (w.totalSets || 0),
      0
    );
    const totalDuration = filteredWorkouts.reduce(
      (sum, w) => sum + w.duration,
      0
    );
    const avgDuration =
      filteredWorkouts.length > 0
        ? Math.round(totalDuration / filteredWorkouts.length / 60)
        : 0;

    return {
      totalWorkouts: filteredWorkouts.length,
      totalSets,
      avgDuration,
      totalPRs: Object.keys(personalRecords).length,
    };
  }, [filteredWorkouts, personalRecords]);

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--warning))",
    "hsl(var(--success))",
    "hsl(var(--accent))",
    "hsl(var(--destructive))",
    "#FF6B9D",
    "#C44569",
  ];

  if (workoutHistory.length === 0) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Workout Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Complete workouts to see your analytics here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">Workout Analytics</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed insights into your training patterns
            </p>
          </div>
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as TimePeriod)}
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Workouts
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalWorkouts}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Sets
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalSets}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Avg Duration
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.avgDuration}m
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                PRs Set
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalPRs}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Volume Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Weekly Volume
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="week"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="workouts"
                    fill="hsl(var(--primary))"
                    name="Workouts"
                  />
                  <Bar dataKey="sets" fill="hsl(var(--warning))" name="Sets" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Muscle Group Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Muscle Group Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {muscleGroupData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exercise Frequency */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Most Frequent Exercises
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseFrequency} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--success))"
                    name="Times Performed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PR Progression */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Personal Records
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prProgressionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="exercise"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="weight"
                    fill="hsl(var(--accent))"
                    name="Weight (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Workout Duration Trends */}
        {durationTrendsData.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Workout Duration Trends (Last 10)
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={durationTrendsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="workout"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{
                      value: "Workout #",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                    }}
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
                    dataKey="duration"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    name="Duration (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
