import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutRecord } from "@/types/gym";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkoutHeatmapProps {
  workoutHistory: WorkoutRecord[];
}

type ViewMode = "month" | "quarter" | "year";

interface DayData {
  date: string;
  count: number;
  workouts: string[];
}

export const WorkoutHeatmap = ({ workoutHistory }: WorkoutHeatmapProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("quarter");

  // Calculate workout data by date
  const workoutsByDate = useMemo(() => {
    const dataMap = new Map<string, DayData>();

    workoutHistory.forEach((workout) => {
      const dateKey = workout.date.split("T")[0];
      const existing = dataMap.get(dateKey);

      if (existing) {
        existing.count++;
        existing.workouts.push(workout.name);
      } else {
        dataMap.set(dateKey, {
          date: dateKey,
          count: 1,
          workouts: [workout.name],
        });
      }
    });

    return dataMap;
  }, [workoutHistory]);

  // Generate days to display based on view mode
  const getDaysToShow = () => {
    const today = new Date();
    const days: Date[] = [];

    let daysBack = 30; // default month
    if (viewMode === "quarter") daysBack = 90;
    if (viewMode === "year") daysBack = 365;

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    return days;
  };

  const days = getDaysToShow();

  // Get color intensity based on workout count
  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-muted/30 border-border/20";
    if (count === 1) return "bg-primary/30 border-primary/40";
    if (count === 2) return "bg-primary/60 border-primary/70";
    return "bg-primary border-primary"; // 3+
  };

  // Calculate streak stats
  const currentStreak = useMemo(() => {
    if (workoutHistory.length === 0) return 0;

    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const hasWorkout = sortedWorkouts.some(
        (w) => w.date.split("T")[0] === dateStr
      );

      if (hasWorkout) {
        streak++;
      } else if (streak > 0) {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }, [workoutHistory]);

  const longestStreak = useMemo(() => {
    if (workoutHistory.length === 0) return 0;

    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let maxStreak = 0;
    let currentStreakCount = 0;
    let lastDate: Date | null = null;

    sortedWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.date.split("T")[0]);

      if (!lastDate) {
        currentStreakCount = 1;
      } else {
        const daysDiff = Math.floor(
          (workoutDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= 1) {
          currentStreakCount++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreakCount);
          currentStreakCount = 1;
        }
      }

      lastDate = workoutDate;
    });

    return Math.max(maxStreak, currentStreakCount);
  }, [workoutHistory]);

  const totalWorkoutDays = workoutsByDate.size;

  // Group days by week for better layout
  const weekGroups: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weekGroups.push(days.slice(i, i + 7));
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">Workout Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your consistency with a visual calendar
            </p>
          </div>
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as ViewMode)}
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-2xl font-bold text-primary">
              {currentStreak}
              <span className="text-base ml-1">🔥</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Current Streak</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-2xl font-bold text-warning">{longestStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">Longest Streak</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-2xl font-bold text-success">
              {totalWorkoutDays}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Days</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/70" />
              <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
            </div>
            <span>More</span>
          </div>

          <TooltipProvider>
            <div className="space-y-1">
              {weekGroups.map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  {week.map((day, dayIndex) => {
                    const dateKey = day.toISOString().split("T")[0];
                    const dayData = workoutsByDate.get(dateKey);
                    const count = dayData?.count || 0;

                    return (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm border cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-primary/50 ${getIntensityColor(
                              count
                            )}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <p className="font-semibold">
                              {day.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {count > 0 ? (
                              <>
                                <p className="text-primary">
                                  {count} workout{count > 1 ? "s" : ""}
                                </p>
                                <div className="pt-1 border-t border-border/50">
                                  {dayData?.workouts.map((workout, idx) => (
                                    <p
                                      key={idx}
                                      className="text-muted-foreground"
                                    >
                                      • {workout}
                                    </p>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-muted-foreground">
                                No workouts
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Month labels for year view */}
        {viewMode === "year" && (
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
