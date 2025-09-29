import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, Play, Zap, Target, Timer } from 'lucide-react';
import { Workout, WorkoutExercise } from '@/types/gym';
import { formatDuration } from '@/utils/workoutUtils';

interface WorkoutSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  workout: Workout;
  onStartWorkout: (customWorkout: Workout) => void;
}

type WorkoutPreset = 'beginner' | 'intermediate' | 'advanced';

const WorkoutSetupDialog: React.FC<WorkoutSetupDialogProps> = ({
  open,
  onOpenChange,
  workoutName,
  workout,
  onStartWorkout
}) => {
  const [selectedPreset, setSelectedPreset] = useState<WorkoutPreset | null>(null);

  // Debug logging
  console.log('🔧 DEBUG: WorkoutSetupDialog received:', { workoutName, workout });

  const presets = {
    beginner: {
      sets: 2,
      reps: 8,
      rest: 60,
      description: "Perfect for getting started",
      icon: Target
    },
    intermediate: {
      sets: 3,
      reps: 10,
      rest: 90,
      description: "Balanced strength building",
      icon: Dumbbell
    },
    advanced: {
      sets: 4,
      reps: 12,
      rest: 120,
      description: "Push your limits",
      icon: Zap
    }
  };

  const calculateTotalDuration = (preset?: WorkoutPreset) => {
    const config = preset ? presets[preset] : presets.intermediate;
    const totalMinutes = workout.exercises.reduce((total, exercise) => {
      const exerciseTime = (config.sets * config.reps * 2) / 60;
      const restTime = ((config.sets - 1) * config.rest) / 60;
      return total + exerciseTime + restTime;
    }, 0);
    return Math.ceil(totalMinutes);
  };

  const handleStartWorkout = (preset?: WorkoutPreset) => {
    const config = preset ? presets[preset] : presets.intermediate;
    const customWorkout: Workout = {
      duration: formatDuration(calculateTotalDuration(preset)),
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: config.sets,
        reps: config.reps,
        rest: config.rest
      }))
    };
    onStartWorkout(customWorkout);
    onOpenChange(false);
  };

  const handleQuickStart = () => {
    onStartWorkout(workout);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Ready to workout?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose your intensity level for {workoutName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{workout.exercises.length}</div>
                <div className="text-sm text-muted-foreground">exercises in this workout</div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Today's Exercises</h3>
            <div className="space-y-2">
              {workout.exercises.slice(0, 4).map((exercise, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="font-medium">{exercise.name}</span>
                </div>
              ))}
              {workout.exercises.length > 4 && (
                <div className="text-center text-sm text-muted-foreground">
                  +{workout.exercises.length - 4} more exercises
                </div>
              )}
            </div>
          </div>

          {/* Workout Presets */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Choose Intensity</h3>
            <div className="space-y-3">
              {(Object.entries(presets) as [WorkoutPreset, typeof presets.beginner][]).map(([preset, config]) => {
                const Icon = config.icon;
                const isSelected = selectedPreset === preset;
                
                return (
                  <Card 
                    key={preset}
                    className={`cursor-pointer transition-all hover:bg-muted/20 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold capitalize">{preset}</h4>
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(calculateTotalDuration(preset))}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{config.sets} sets</span>
                            <span>{config.reps} reps</span>
                            <span>{config.rest}s rest</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => handleStartWorkout(selectedPreset || 'intermediate')}
              size="lg"
              className="w-full"
              disabled={!selectedPreset}
            >
              <Play className="w-4 h-4 mr-2" />
              Start {selectedPreset ? selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1) : ''} Workout
            </Button>
            <Button
              onClick={handleQuickStart}
              variant="outline"
              className="w-full"
            >
              <Timer className="w-4 h-4 mr-2" />
              Quick Start (Default)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutSetupDialog;