import React, { useState } from "react";
import { Timer, Play, X, Check, Minus, Plus, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Workout, WorkoutExercise } from "@/types/gym";

interface ActiveWorkoutViewProps {
  activeWorkout: string;
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimer: number;
  workoutTimer: number;
  isWorkoutActive: boolean;
  completedSets: Record<string, boolean>;
  onCompleteSet: (weight: number, reps: number) => void;
  onSkipRest: () => void;
  onEndWorkout: () => void;
}

const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  activeWorkout,
  workout,
  currentExerciseIndex,
  currentSetIndex,
  isResting,
  restTimer,
  workoutTimer,
  completedSets,
  onCompleteSet,
  onSkipRest,
  onEndWorkout,
}) => {
  const [currentWeight, setCurrentWeight] = useState(
    workout.exercises[currentExerciseIndex]?.weight || 50
  );
  const [currentReps, setCurrentReps] = useState(
    workout.exercises[currentExerciseIndex]?.reps || 10
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No workout data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progressPercentage =
    ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const completedSetsCount = Array.from(
    { length: currentExercise.sets },
    (_, i) => {
      const key = `${currentExerciseIndex}-${i}`;
      return completedSets[key];
    }
  ).filter(Boolean).length;

  if (isResting) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Rest Time</h1>
          <Button onClick={onEndWorkout} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Rest Timer */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              {formatTime(restTimer)}
            </div>
            <Button
              onClick={onSkipRest}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Rest
            </Button>
          </CardContent>
        </Card>

        {/* Next Exercise Preview */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Coming up next:</p>
              <h3 className="text-lg font-semibold">{currentExercise.name}</h3>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span>
                  Set {currentSetIndex + 1}/{currentExercise.sets}
                </span>
                <span>{currentExercise.reps} reps</span>
                <span>{currentExercise.weight}kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{activeWorkout}</h1>
        <Button onClick={onEndWorkout} variant="ghost" size="icon">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Large Workout Timer */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Timer className="w-6 h-6 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Workout Time
            </p>
          </div>
          <div className="text-6xl font-bold text-primary">
            {formatTime(workoutTimer)}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Image Placeholder */}
      <Card className="bg-muted/20 border-border/30">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Exercise demonstration
          </p>
        </CardContent>
      </Card>

      {/* Exercise Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-center">{currentExercise.name}</CardTitle>
          <div className="flex justify-center gap-2">
            <Badge variant="outline">
              Set {currentSetIndex + 1}/{currentExercise.sets}
            </Badge>
            <Badge variant="outline">{completedSetsCount} completed</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight and Reps Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Weight (kg)
              </p>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {currentWeight}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentWeight(Math.max(0, currentWeight - 5))
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeight(currentWeight + 5)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reps */}
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Reps</p>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {currentReps}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentReps(Math.max(1, currentReps - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentReps(currentReps + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sets Progress */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Sets Progress
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: currentExercise.sets }, (_, i) => {
                const key = `${currentExerciseIndex}-${i}`;
                const isCompleted = completedSets[key];
                const isCurrent = i === currentSetIndex;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complete Set Button */}
          <Button
            onClick={() => onCompleteSet(currentWeight, currentReps)}
            size="lg"
            className="w-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete Set
          </Button>

          {/* Exercise Instructions */}
          <Card className="bg-muted/20 border-border/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Focus on form and controlled movement. Rest{" "}
                {currentExercise.rest}s between sets.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveWorkoutView;
