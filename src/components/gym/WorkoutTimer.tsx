import React, { useEffect, useRef } from 'react';
import { Timer, Play, Pause, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Workout, WorkoutExercise } from '@/types/gym';

interface WorkoutTimerProps {
  activeWorkout: string;
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimer: number;
  workoutTimer: number;
  isWorkoutActive: boolean;
  completedSets: Record<string, boolean>;
  onCompleteSet: () => void;
  onSkipRest: () => void;
  onEndWorkout: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
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
  onEndWorkout
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Guard clause to prevent accessing undefined workout
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No workout data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progressPercentage = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  if (isResting) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Rest Time</CardTitle>
              <Button onClick={onEndWorkout} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-primary">
              {formatTime(restTimer)}
            </div>
            <Button onClick={onSkipRest} variant="outline" size="lg">
              Skip Rest
            </Button>
            <div className="p-6 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-muted-foreground mb-2">Coming up next:</p>
              <p className="font-semibold text-lg text-foreground">{currentExercise.name}</p>
              <p className="text-sm text-muted-foreground">
                Set {currentSetIndex + 1} of {currentExercise.sets} • {currentExercise.reps} reps @ {currentExercise.weight}kg
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {activeWorkout}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button onClick={onEndWorkout} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Large Workout Timer */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-6xl font-bold text-primary">
              <Timer className="w-12 h-12" />
              {formatTime(workoutTimer)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Total Workout Time</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-foreground">{currentExercise.name}</h3>
              <span className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Current Set Info */}
          <div className="p-8 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-lg text-muted-foreground">Set {currentSetIndex + 1} of {currentExercise.sets}</div>
              <div className="text-5xl font-bold text-primary">
                {currentExercise.reps}
              </div>
              <div className="text-lg text-muted-foreground">reps @ {currentExercise.weight}kg</div>
            </div>
          </div>

          {/* Sets Grid */}
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: currentExercise.sets }, (_, i) => {
              const key = `${currentExerciseIndex}-${i}`;
              const isCompleted = completedSets[key];
              const isCurrent = i === currentSetIndex;
              
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg text-center transition-all ${
                    isCompleted 
                      ? 'bg-success/20 text-success border-2 border-success/30' : 
                    isCurrent 
                      ? 'bg-primary text-primary-foreground border-2 border-primary' : 
                      'bg-muted/20 text-muted-foreground border border-border/30'
                  }`}
                >
                  <div className="text-sm font-medium">Set {i + 1}</div>
                  {isCompleted && <Check className="w-5 h-5 mx-auto mt-2" />}
                </div>
              );
            })}
          </div>

          <Button onClick={onCompleteSet} variant="success" size="lg" className="w-full">
            Complete Set
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTimer;