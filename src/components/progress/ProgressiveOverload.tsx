import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutRecord } from "@/types/gym";
import { TrendingUp, AlertCircle, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProgressiveOverloadProps {
  workoutHistory: WorkoutRecord[];
  personalRecords: Record<string, number>;
}

interface ExerciseProgress {
  exercise: string;
  currentPR: number;
  lastPerformed: string;
  weeklyVolume: number;
  previousWeekVolume: number;
  volumeChange: number;
  recommendation: string;
  intensity: "low" | "medium" | "high" | "peak";
  readyForPR: boolean;
}

export const ProgressiveOverload = ({
  workoutHistory,
  personalRecords,
}: ProgressiveOverloadProps) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate exercise progress and recommendations
  const exerciseProgressData = useMemo(() => {
    const progressMap = new Map<string, ExerciseProgress>();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Group workouts by exercise
    const exerciseWorkouts = new Map<
      string,
      { date: string; weight: number; sets: number; reps: number }[]
    >();

    workoutHistory.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      const exerciseName = workout.name;

      if (!exerciseWorkouts.has(exerciseName)) {
        exerciseWorkouts.set(exerciseName, []);
      }

      exerciseWorkouts.get(exerciseName)!.push({
        date: workout.date,
        weight: personalRecords[exerciseName] || 0,
        sets: workout.totalSets || 0,
        reps: 10, // Simplified - ideally track per set
      });
    });

    // Analyze each exercise
    exerciseWorkouts.forEach((sessions, exercise) => {
      const currentPR = personalRecords[exercise] || 0;
      const sortedSessions = sessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastSession = sortedSessions[0];

      // Calculate weekly volumes
      const thisWeekSessions = sortedSessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= oneWeekAgo;
      });

      const lastWeekSessions = sortedSessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo;
      });

      const thisWeekVolume = thisWeekSessions.reduce(
        (sum, s) => sum + s.weight * s.sets * s.reps,
        0
      );
      const lastWeekVolume = lastWeekSessions.reduce(
        (sum, s) => sum + s.weight * s.sets * s.reps,
        0
      );

      const volumeChange =
        lastWeekVolume > 0
          ? ((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100
          : 0;

      // Determine training intensity based on frequency and volume
      let intensity: "low" | "medium" | "high" | "peak" = "low";
      if (thisWeekSessions.length >= 3) intensity = "high";
      else if (thisWeekSessions.length >= 2) intensity = "medium";
      else if (thisWeekSessions.length >= 1) intensity = "low";

      // Check if ready for PR attempt
      const readyForPR =
        volumeChange > 10 && thisWeekSessions.length >= 2 && currentPR > 0;

      // Generate recommendation
      let recommendation = "";
      if (readyForPR) {
        const suggestedIncrease = Math.ceil(currentPR * 0.025) * 2.5; // 2.5% rounded to nearest 2.5kg
        recommendation = `Try ${currentPR + suggestedIncrease}kg for a new PR!`;
      } else if (volumeChange > 15) {
        recommendation = `Great progress! Volume up ${volumeChange.toFixed(
          0
        )}%. Consider deload next week.`;
      } else if (volumeChange < -10) {
        recommendation = `Volume down ${Math.abs(volumeChange).toFixed(
          0
        )}%. Focus on consistency.`;
      } else if (thisWeekSessions.length === 0) {
        recommendation = `Haven't trained this week. Time to get back!`;
      } else if (intensity === "low") {
        recommendation = `Add another session this week for better gains.`;
      } else {
        recommendation = `Maintain current volume. Steady progress!`;
      }

      progressMap.set(exercise, {
        exercise,
        currentPR,
        lastPerformed: lastSession.date,
        weeklyVolume: thisWeekVolume,
        previousWeekVolume: lastWeekVolume,
        volumeChange,
        recommendation,
        intensity,
        readyForPR,
      });
    });

    return Array.from(progressMap.values()).sort(
      (a, b) =>
        new Date(b.lastPerformed).getTime() -
        new Date(a.lastPerformed).getTime()
    );
  }, [workoutHistory, personalRecords]);

  // Calculate overall progress metrics
  const overallMetrics = useMemo(() => {
    const totalVolume = exerciseProgressData.reduce(
      (sum, e) => sum + e.weeklyVolume,
      0
    );
    const totalPreviousVolume = exerciseProgressData.reduce(
      (sum, e) => sum + e.previousWeekVolume,
      0
    );
    const avgVolumeChange =
      totalPreviousVolume > 0
        ? ((totalVolume - totalPreviousVolume) / totalPreviousVolume) * 100
        : 0;

    const readyForPRCount = exerciseProgressData.filter(
      (e) => e.readyForPR
    ).length;

    const highIntensityCount = exerciseProgressData.filter(
      (e) => e.intensity === "high" || e.intensity === "peak"
    ).length;

    return {
      totalVolume,
      avgVolumeChange,
      readyForPRCount,
      highIntensityCount,
      exercisesTracked: exerciseProgressData.length,
    };
  }, [exerciseProgressData]);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "text-muted-foreground bg-muted";
      case "medium":
        return "text-warning-foreground bg-warning/20 border-warning";
      case "high":
        return "text-success-foreground bg-success/20 border-success";
      case "peak":
        return "text-primary-foreground bg-primary border-primary";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getVolumeChangeIcon = (change: number) => {
    if (change > 10) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < -10)
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
  };

  if (workoutHistory.length === 0) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">
            Progressive Overload Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Complete workouts to track your progressive overload
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedExercises = expanded
    ? exerciseProgressData
    : exerciseProgressData.slice(0, 5);

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">
              Progressive Overload Tracker
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Smart recommendations for continuous strength gains
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Volume
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xl font-bold text-foreground cursor-help">
                    {(overallMetrics.totalVolume / 1000).toFixed(1)}k
                    <span className="text-xs text-muted-foreground ml-1">
                      kg
                    </span>
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sets × Reps × Weight (this week)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div
            className={`p-4 rounded-lg ${
              overallMetrics.avgVolumeChange > 0
                ? "bg-success/10 border-success/20"
                : "bg-destructive/10 border-destructive/20"
            } border`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp
                className={`w-4 h-4 ${
                  overallMetrics.avgVolumeChange > 0
                    ? "text-success"
                    : "text-destructive"
                }`}
              />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Volume Change
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {overallMetrics.avgVolumeChange > 0 ? "+" : ""}
              {overallMetrics.avgVolumeChange.toFixed(0)}%
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                PR Ready
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {overallMetrics.readyForPRCount}
              <span className="text-xs text-muted-foreground ml-1">
                exercise{overallMetrics.readyForPRCount !== 1 ? "s" : ""}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                High Intensity
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {overallMetrics.highIntensityCount}
              <span className="text-xs text-muted-foreground ml-1">
                / {overallMetrics.exercisesTracked}
              </span>
            </p>
          </div>
        </div>

        {/* Exercise Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Exercise Recommendations
          </h3>

          {displayedExercises.map((exercise) => (
            <div
              key={exercise.exercise}
              className="p-4 rounded-lg bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {exercise.exercise}
                    </h4>
                    {exercise.readyForPR && (
                      <Badge
                        variant="default"
                        className="bg-warning text-warning-foreground"
                      >
                        PR Ready! 🎯
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`${getIntensityColor(exercise.intensity)}`}
                    >
                      {exercise.intensity.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {exercise.recommendation}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Current PR:{" "}
                      <strong className="text-foreground">
                        {exercise.currentPR}kg
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Volume:{" "}
                      <strong className="text-foreground">
                        {(exercise.weeklyVolume / 1000).toFixed(1)}k kg
                      </strong>
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {getVolumeChangeIcon(exercise.volumeChange)}
                      <span
                        className={
                          exercise.volumeChange > 0
                            ? "text-success"
                            : exercise.volumeChange < 0
                            ? "text-destructive"
                            : ""
                        }
                      >
                        {exercise.volumeChange > 0 ? "+" : ""}
                        {exercise.volumeChange.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  Last: {new Date(exercise.lastPerformed).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}

          {exerciseProgressData.length > 5 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? "Show Less"
                : `Show ${exerciseProgressData.length - 5} More Exercises`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
