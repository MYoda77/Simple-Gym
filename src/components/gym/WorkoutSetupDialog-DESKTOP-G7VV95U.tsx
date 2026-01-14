import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Dumbbell,
  Play,
  Zap,
  Target,
  Timer,
  Settings,
} from "lucide-react";
import { Workout, WorkoutExercise } from "@/types/gym";
import { formatDuration } from "@/utils/workoutUtils";

interface WorkoutSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  workout: Workout;
  onStartWorkout: (customWorkout: Workout) => void;
}

type WorkoutPreset = "beginner" | "intermediate" | "advanced" | "custom";

const WorkoutSetupDialog: React.FC<WorkoutSetupDialogProps> = ({
  open,
  onOpenChange,
  workoutName,
  workout,
  onStartWorkout,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<WorkoutPreset | null>(
    null
  );
  const [customSets, setCustomSets] = useState<string>("3");
  const [customReps, setCustomReps] = useState<string>("10");
  const [customRest, setCustomRest] = useState<string>("90");

  const presets = {
    beginner: {
      sets: 2,
      reps: 8,
      rest: 60,
      description: "Perfect for getting started",
      icon: Target,
    },
    intermediate: {
      sets: 3,
      reps: 10,
      rest: 90,
      description: "Balanced strength building",
      icon: Dumbbell,
    },
    advanced: {
      sets: 4,
      reps: 12,
      rest: 120,
      description: "Push your limits",
      icon: Zap,
    },
    custom: {
      sets: parseInt(customSets) || 3,
      reps: parseInt(customReps) || 10,
      rest: parseInt(customRest) || 90,
      description: "Set your own intensity",
      icon: Settings,
    },
  };

  const calculateTotalDuration = (config: {
    sets: number;
    reps: number;
    rest: number;
  }) => {
    const totalMinutes = workout.exercises.reduce((total, exercise) => {
      const exerciseTime = (config.sets * config.reps * 2) / 60;
      const restTime = ((config.sets - 1) * config.rest) / 60;
      return total + exerciseTime + restTime;
    }, 0);
    return Math.ceil(totalMinutes);
  };

  const getTotalDurationForPreset = (preset?: WorkoutPreset) => {
    if (preset === "custom") {
      return calculateTotalDuration({
        sets: parseInt(customSets) || 3,
        reps: parseInt(customReps) || 10,
        rest: parseInt(customRest) || 90,
      });
    }
    const config = preset ? presets[preset] : presets.intermediate;
    return calculateTotalDuration(config);
  };

  const handleStartWorkout = (preset?: WorkoutPreset) => {
    let config;
    if (preset === "custom") {
      // For custom preset, use the current state values
      config = {
        sets: parseInt(customSets) || 3,
        reps: parseInt(customReps) || 10,
        rest: parseInt(customRest) || 90,
      };
    } else {
      config = preset ? presets[preset] : presets.intermediate;
    }

    const customWorkout: Workout = {
      duration: formatDuration(calculateTotalDuration(config)),
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        sets: config.sets,
        reps: config.reps,
        rest: config.rest,
      })),
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
                <div className="text-3xl font-bold text-primary">
                  {workout.exercises.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  exercises in this workout
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Today's Exercises
            </h3>
            <div className="space-y-2">
              {workout.exercises.slice(0, 4).map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {index + 1}
                    </span>
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
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Choose Intensity
            </h3>
            <div className="space-y-3">
              {(
                Object.entries(presets) as [
                  WorkoutPreset,
                  typeof presets.beginner
                ][]
              ).map(([preset, config]) => {
                const Icon = config.icon;
                const isSelected = selectedPreset === preset;

                return (
                  <Card
                    key={preset}
                    className={`cursor-pointer transition-all hover:bg-muted/20 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/50"
                    }`}
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold capitalize">
                              {preset}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(
                                getTotalDurationForPreset(preset)
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
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

            {/* Custom Intensity Inputs */}
            {selectedPreset === "custom" && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-semibold text-sm">
                    Customize Your Workout
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="custom-sets" className="text-xs">
                        Sets
                      </Label>
                      <Input
                        id="custom-sets"
                        type="number"
                        min="1"
                        max="10"
                        value={customSets}
                        onChange={(e) => setCustomSets(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-reps" className="text-xs">
                        Reps
                      </Label>
                      <Input
                        id="custom-reps"
                        type="number"
                        min="1"
                        max="50"
                        value={customReps}
                        onChange={(e) => setCustomReps(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-rest" className="text-xs">
                        Rest (s)
                      </Label>
                      <Input
                        id="custom-rest"
                        type="number"
                        min="30"
                        max="300"
                        value={customRest}
                        onChange={(e) => setCustomRest(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Estimated duration:{" "}
                    {formatDuration(getTotalDurationForPreset("custom"))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() =>
                handleStartWorkout(selectedPreset || "intermediate")
              }
              size="lg"
              className="w-full"
              disabled={!selectedPreset}
            >
              <Play className="w-4 h-4 mr-2" />
              Start{" "}
              {selectedPreset
                ? selectedPreset === "custom"
                  ? "Custom"
                  : selectedPreset.charAt(0).toUpperCase() +
                    selectedPreset.slice(1)
                : ""}{" "}
              Workout
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
