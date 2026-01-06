import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useDeferredValue,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Plus,
  X,
  Check,
  Search,
  Filter,
  Info,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Edit,
  MoreVertical,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Workout,
  WorkoutRecord,
  ViewType,
  Exercise,
  ProgressData as DashboardProgressData,
} from "@/types/gym";
import { ProgressData } from "@/types/progress";
import { exerciseDatabase } from "@/data/exercises";
import {
  calculateWorkoutMetrics,
  formatDuration,
  getDifficultyColor,
  getComplexityColor,
} from "@/utils/workoutUtils";
import { useCustomExercises } from "@/hooks/useCustomExercises-COMPATIBLE";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates-COMPATIBLE";
import { useProgressTracking } from "@/hooks/useProgressTracking-COMPATIBLE";
import { useSchedule } from "@/hooks/useSchedule-COMPATIBLE";
import { useRealTimeSync } from "@/hooks/useRealTimeSync";
import { useAuth } from "@/lib/useAuth";
import { CustomExercise, supabase } from "@/lib/supabase-config";
import CalendarContextMenu from "@/components/gym/CalendarContextmenu";
import Dashboard from "@/components/gym/Dashboard";
import Header from "@/components/gym/Header";
import ActiveWorkoutView from "@/components/gym/ActiveWorkoutView";
import CreateWorkoutDialog from "@/components/gym/CreateWorkoutDialog";
import CreateExerciseDialog from "@/components/gym/CreateExerciseDialog";
import WorkoutSetupDialog from "@/components/gym/WorkoutSetupDialog";
import WeeklySchedule from "@/components/gym/WeeklySchedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestDayConfigDialog, {
  RestDayConfig,
} from "@/components/gym/RestDayConfigDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type MixedExercise = Exercise | CustomExercise;
interface ExerciseDatabaseProps {
  searchTerm: string;
  setSearchTerm: SetState<string>;
  filterCategory: string;
  setFilterCategory: SetState<string>;
  filterType: string;
  setFilterType: SetState<string>;
  filterComplexity: string;
  setFilterComplexity: SetState<string>;
  filterMovement: string;
  setFilterMovement: SetState<string>;
  filteredExercises: MixedExercise[];
  showExerciseInfo: MixedExercise | null;
  setShowExerciseInfo: SetState<MixedExercise | null>;
  setIsCreateWorkoutOpen: SetState<boolean>;
  setIsCreateExerciseOpen: SetState<boolean>;
  onEditExercise: (exercise: MixedExercise) => void;
  onDeleteExercise: (exerciseId: string | number) => void;
}

const ExerciseDatabase = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    filterComplexity,
    setFilterComplexity,
    filterMovement,
    setFilterMovement,
    filteredExercises,
    showExerciseInfo,
    setShowExerciseInfo,
    setIsCreateWorkoutOpen,
    setIsCreateExerciseOpen,
    onEditExercise,
    onDeleteExercise,
  }: ExerciseDatabaseProps) => {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-primary">Exercise Database</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsCreateExerciseOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => setIsCreateWorkoutOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Build Workout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 glass"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                inputMode="search"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36 glass">
                <SelectValue placeholder="Muscle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscles</SelectItem>
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="shoulders">Shoulders</SelectItem>
                <SelectItem value="biceps">Biceps</SelectItem>
                <SelectItem value="triceps">Triceps</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 glass">
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="barbell">Barbell</SelectItem>
                <SelectItem value="dumbbell">Dumbbell</SelectItem>
                <SelectItem value="bodyweight">Bodyweight</SelectItem>
                <SelectItem value="cable">Cable</SelectItem>
                <SelectItem value="machine">Machine</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterComplexity}
              onValueChange={setFilterComplexity}
            >
              <SelectTrigger className="w-36 glass">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMovement} onValueChange={setFilterMovement}>
              <SelectTrigger className="w-36 glass">
                <SelectValue placeholder="Movement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patterns</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="pull">Pull</SelectItem>
                <SelectItem value="squat">Squat</SelectItem>
                <SelectItem value="hinge">Hinge</SelectItem>
                <SelectItem value="carry">Carry</SelectItem>
                <SelectItem value="isolation">Isolation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((exercise) => {
              const isCustom = (exercise as Exercise & { isCustom?: boolean })
                .isCustom;
              return (
                <Card
                  key={exercise.id}
                  className="glass border-border/30 hover:border-primary/50 transition-all hover:shadow-card"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {exercise.name}
                          </h3>
                          {isCustom && (
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded-full">
                              custom
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                            {exercise.primaryMuscle}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted/20 text-muted-foreground rounded-full">
                            {exercise.equipment}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              exercise.complexity === "low"
                                ? "bg-success/20 text-success"
                                : exercise.complexity === "medium"
                                ? "bg-warning/20 text-warning"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {exercise.complexity} complexity
                          </span>
                          {exercise.movementPattern && (
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded-full">
                              {exercise.movementPattern}
                            </span>
                          )}
                          {exercise.requiresSpotter && (
                            <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded-full">
                              spotter needed
                            </span>
                          )}
                          {exercise.prerequisites &&
                            exercise.prerequisites.length > 0 && (
                              <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded-full">
                                prerequisites
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExerciseInfo(exercise);
                          }}
                          aria-label={`More info about ${exercise.name}`}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        {isCustom && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="glass border-border/50"
                            >
                              <DropdownMenuItem
                                onClick={() => onEditExercise(exercise)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDeleteExercise(exercise.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>

        {/* Single controlled dialog for exercise info */}
        <Dialog
          open={!!showExerciseInfo}
          onOpenChange={(open) => !open && setShowExerciseInfo(null)}
        >
          <DialogContent className="glass border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {showExerciseInfo?.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detailed information about the {showExerciseInfo?.name} exercise
              </DialogDescription>
            </DialogHeader>
            {showExerciseInfo && (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Primary Muscle
                  </p>
                  <p className="capitalize text-foreground">
                    {showExerciseInfo.primaryMuscle}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Equipment
                  </p>
                  <p className="capitalize text-foreground">
                    {showExerciseInfo.equipment}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Instructions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {showExerciseInfo.instructions}
                  </p>
                </div>
                {showExerciseInfo.movementPattern && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">
                      Movement Pattern
                    </p>
                    <p className="capitalize text-foreground">
                      {showExerciseInfo.movementPattern}
                    </p>
                  </div>
                )}
                {showExerciseInfo.prerequisites &&
                  showExerciseInfo.prerequisites.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">
                        Prerequisites
                      </p>
                      <div className="space-y-1">
                        {showExerciseInfo.prerequisites.map((prereq, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-muted-foreground"
                          >
                            • {prereq}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                {showExerciseInfo.requiresSpotter && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">
                      Safety Note
                    </p>
                    <p className="text-sm text-destructive">
                      This exercise requires a spotter for safety
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    );
  }
);
ExerciseDatabase.displayName = "ExerciseDatabase";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    customExercises,
    addCustomExercise,
    updateCustomExercise,
    deleteCustomExercise,
    getCustomCategories,
    getCustomEquipmentTypes,
    refresh: refreshCustomExercises,
  } = useCustomExercises();

  const {
    templates: workoutTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    loading: workoutsLoading,
    refresh: refreshWorkoutTemplates,
    initializeDefaultTemplates,
  } = useWorkoutTemplates();

  const {
    progressEntries,
    workoutHistory: hookWorkoutHistory,
    logProgress,
    logWorkout,
    loading: progressLoading,
  } = useProgressTracking();

  const {
    scheduleEntries,
    scheduleWorkout,
    unscheduleWorkout,
    loading: scheduleLoading,
  } = useSchedule();

  // Enable real-time sync
  const realTimeSync = useRealTimeSync({
    onCustomExerciseChange: () => refreshCustomExercises(),
    onWorkoutChange: () => refreshWorkoutTemplates(),
  });

  // Initialize default templates on first load
  useEffect(() => {
    if (workoutTemplates.length === 0 && !workoutsLoading) {
      initializeDefaultTemplates();
    }
  }, [workoutTemplates.length, workoutsLoading, initializeDefaultTemplates]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    dateKey: string;
    workoutName: string | undefined;
  }>({
    visible: false,
    x: 0,
    y: 0,
    dateKey: "",
    workoutName: undefined,
  });

  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [restDayDialogOpen, setRestDayDialogOpen] = useState(false);
  const [restDayDate, setRestDayDate] = useState<Date>(new Date());
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWorkoutSetupOpen, setIsWorkoutSetupOpen] = useState(false);
  const [pendingWorkoutName, setPendingWorkoutName] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert workout templates to the legacy format for compatibility
  const workouts = useMemo(() => {
    const result: Record<string, Workout> = {};
    workoutTemplates.forEach((template) => {
      result[template.name] = {
        duration: template.duration_minutes
          ? `${template.duration_minutes} mins`
          : "45-60 mins",
        exercises: template.exercises,
      };
    });
    return result;
  }, [workoutTemplates]);

  // Convert schedule entries to legacy format for compatibility
  const schedule = useMemo(() => {
    const result: Record<string, string> = {};
    scheduleEntries.forEach((entry) => {
      const dateKey = entry.scheduled_date;

      // If no workout_id, it's a Rest Day
      if (!entry.workout_id) {
        result[dateKey] = "Rest Day";
      } else {
        // Regular workout - get name from joined workout data
        const workoutName = entry.workouts?.name || "Unknown Workout";
        result[dateKey] = workoutName;
      }
    });
    return result;
  }, [scheduleEntries]);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>(
    {}
  );
  // Use workout history from the hook (convert format if needed)
  const workoutHistory = useMemo(() => {
    return hookWorkoutHistory.map((entry) => ({
      date: entry.date,
      weight: entry.weight || 0,
      bodyFat: entry.body_fat_percentage || 0,
    }));
  }, [hookWorkoutHistory]);
  const [personalRecords, setPersonalRecords] = useState<
    Record<string, number>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");
  const [filterMovement, setFilterMovement] = useState<string>("all");
  const [showExerciseInfo, setShowExerciseInfo] =
    useState<MixedExercise | null>(null);
  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<
    (string | number)[]
  >([]);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<
    Record<string, boolean>
  >({});

  // Custom exercise states
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<MixedExercise | null>(
    null
  );
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);

  // Workout assignment states
  const [showWorkoutAssignment, setShowWorkoutAssignment] = useState(false);
  const [assignmentDate, setAssignmentDate] = useState<Date | null>(null);

  // Use progress data from the hook (convert format if needed)
  const progressData = useMemo(() => {
    return progressEntries
      .filter((entry) => entry.weight !== undefined)
      .map((entry) => ({
        date: entry.date,
        weight: entry.weight as number,
        bodyFat: entry.bodyFat || 0,
      }));
  }, [progressEntries]);

  // Combine preset and custom exercises
  const allExercises = useMemo(() => {
    const presetExercises = Object.values(exerciseDatabase).flat();
    return [...presetExercises, ...customExercises];
  }, [customExercises]);

  // Get all available categories including custom ones
  const allCategories = useMemo(() => {
    const presetCategories = [
      "chest",
      "back",
      "legs",
      "shoulders",
      "biceps",
      "triceps",
    ];
    const customCategories = getCustomCategories();
    return [...new Set([...presetCategories, ...customCategories])];
  }, [getCustomCategories]);

  // Get all available equipment types including custom ones
  const allEquipmentTypes = useMemo(() => {
    const presetEquipment = [
      "barbell",
      "dumbbell",
      "bodyweight",
      "cable",
      "machine",
    ];
    const customEquipment = getCustomEquipmentTypes();
    return [...new Set([...presetEquipment, ...customEquipment])];
  }, [getCustomEquipmentTypes]);

  // Timer effects
  useEffect(() => {
    if (isResting && restTimer > 0) {
      intervalRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isResting, restTimer]);

  useEffect(() => {
    if (isWorkoutActive) {
      const timer = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isWorkoutActive]);

  const startWorkout = (workoutName: string) => {
    setPendingWorkoutName(workoutName);
    setIsWorkoutSetupOpen(true);
  };

  const handleStartWorkoutWithSetup = (customWorkout: Workout) => {
    // Note: customWorkout parameter available for future enhancement
    // where users can modify workout parameters before starting

    setActiveWorkout(pendingWorkoutName);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    setCurrentView("workout");
    setCompletedSets({});
    setIsWorkoutSetupOpen(false);
    setPendingWorkoutName("");

    toast({
      title: "Workout Started!",
      description: `${pendingWorkoutName} is now in progress. Good luck!`,
    });
  };

  const completeSet = (actualWeight: number, actualReps: number) => {
    if (!activeWorkout) return;

    const exercise = workouts[activeWorkout].exercises[currentExerciseIndex];
    const key = `${currentExerciseIndex}-${currentSetIndex}`;

    setCompletedSets((prev) => ({
      ...prev,
      [key]: true,
    }));

    // Update personal records using actual weight lifted
    const exerciseName = exercise.name;
    const currentRecord = personalRecords[exerciseName];
    const isNewRecord = !currentRecord || currentRecord < actualWeight;

    console.log("PR Check:", {
      exerciseName,
      currentRecord,
      actualWeight,
      isNewRecord,
    });

    if (isNewRecord) {
      setPersonalRecords((prev) => ({
        ...prev,
        [exerciseName]: actualWeight,
      }));
      toast({
        title: "New Personal Record! 🏆",
        description: `${exerciseName}: ${actualWeight}kg (previous: ${
          currentRecord || "none"
        })`,
      });
    }

    if (currentSetIndex < exercise.sets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setIsResting(true);
      setRestTimer(exercise.rest);
    } else if (
      currentExerciseIndex <
      workouts[activeWorkout].exercises.length - 1
    ) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setIsResting(true);
      setRestTimer(
        workouts[activeWorkout].exercises[currentExerciseIndex + 1].rest
      );
    } else {
      // Workout complete
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    if (!activeWorkout) return;

    setIsWorkoutActive(false);
    setActiveWorkout(null); // Clear active workout state
    setCurrentExerciseIndex(0); // Reset exercise index
    setCurrentSetIndex(0); // Reset set index
    setIsResting(false); // Clear rest state
    setRestTimer(0); // Clear rest timer

    const workoutRecord: WorkoutRecord = {
      date: new Date().toISOString(),
      name: activeWorkout,
      duration: workoutTimer,
      exercises: workouts[activeWorkout].exercises.length,
      totalSets: workouts[activeWorkout].exercises.reduce(
        (acc, ex) => acc + ex.sets,
        0
      ),
    };
    // Log workout using the hook
    // Workout tracking now handled by workout sessions

    // Note: Workout progress tracking removed - only tracking weight/BMI in Progress page

    toast({
      title: "Workout Complete! 🎉",
      description: "Amazing work! You crushed it today.",
    });
    setCurrentView("dashboard");
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setActiveWorkout(null);
    setCurrentView("dashboard");
    toast({
      title: "Workout Ended",
      description: "Your progress has been saved.",
    });
  };

  const exportData = () => {
    const data = {
      workouts,
      schedule,
      workoutHistory,
      personalRecords,
      progressData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fittracker-data.json";
    a.click();
    toast({
      title: "Data Exported",
      description: "Your workout data has been downloaded.",
    });
  };

  const resetAllData = () => {
    // Reset user data state to empty defaults (preserving workout templates)
    setCompletedSets({});
    setPersonalRecords({});

    // Reset data using hooks (preserving workout templates)
    // Note: Add reset methods to hooks if needed for complete data reset

    // Reset view to dashboard and clear active workout
    setCurrentView("dashboard");
    setActiveWorkout(null);
    setIsWorkoutActive(false);

    // Reset timers
    setWorkoutTimer(0);
    setRestTimer(0);
    setIsResting(false);

    // Reset exercise/set indices
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);

    // Clear any pending workout data
    setPendingWorkoutName("");

    // Close any open dialogs
    setIsWorkoutSetupOpen(false);
    setIsCreateWorkoutOpen(false);
    setIsCreateExerciseOpen(false);
    setIsEditExerciseOpen(false);
    setShowWorkoutAssignment(false);
    setMobileMenuOpen(false);

    // Clear search and filters
    setSearchTerm("");
    setFilterCategory("all");
    setFilterType("all");

    toast({
      title: "Data Reset Complete",
      description:
        "All user data has been cleared. Workout templates and exercise database preserved!",
    });
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        let importedCount = 0;

        // Import workout templates
        if (data.workouts && typeof data.workouts === "object") {
          for (const [name, workout] of Object.entries(data.workouts)) {
            if (
              workout &&
              typeof workout === "object" &&
              "exercises" in workout
            ) {
              try {
                await createTemplate(
                  name,
                  (workout as Workout).exercises,
                  (workout as Workout).duration || "45-60 mins"
                );
                importedCount++;
              } catch (error) {
                console.error(`Failed to import workout: ${name}`, error);
              }
            }
          }
        }

        // Import schedule entries
        if (data.schedule && typeof data.schedule === "object") {
          for (const [date, workoutName] of Object.entries(data.schedule)) {
            if (workoutName && typeof workoutName === "string") {
              try {
                await scheduleWorkout(date, workoutName);
                importedCount++;
              } catch (error) {
                console.error(
                  `Failed to import schedule entry: ${date}`,
                  error
                );
              }
            }
          }
        }

        // Import progress data
        if (data.progressData && Array.isArray(data.progressData)) {
          for (const entry of data.progressData) {
            if (entry.weight && entry.date) {
              try {
                await logProgress({
                  date: entry.date,
                  weight: entry.weight,
                  body_fat_percentage: entry.bodyFat,
                });
                importedCount++;
              } catch (error) {
                console.error(
                  `Failed to import progress entry: ${entry.date}`,
                  error
                );
              }
            }
          }
        }

        // Import workout history
        if (data.workoutHistory && Array.isArray(data.workoutHistory)) {
          for (const entry of data.workoutHistory) {
            if (entry.name && entry.duration) {
              try {
                // Workout tracking now handled by workout sessions
                importedCount++;
              } catch (error) {
                console.error(
                  `Failed to import workout history: ${entry.name}`,
                  error
                );
              }
            }
          }
        }

        // Import personal records (stored locally only)
        if (data.personalRecords && typeof data.personalRecords === "object") {
          setPersonalRecords(data.personalRecords);
        }

        if (importedCount > 0) {
          toast({
            title: "Data Imported Successfully",
            description: `Imported ${importedCount} items to your account.`,
          });
        } else {
          toast({
            title: "No Data Imported",
            description: "The file didn't contain any valid data to import.",
            variant: "destructive",
          });
        }

        // Reset file input
        event.target.value = "";
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Import Error",
          description:
            "Failed to parse the file. Please check the format and try again.",
          variant: "destructive",
        });
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
      event.target.value = "";
    };

    reader.readAsText(file);
  };

  // Use the combined exercises from above

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(deferredSearchTerm.toLowerCase());
      const matchesFilter =
        filterCategory === "all" || exercise.primaryMuscle === filterCategory;
      const matchesType =
        filterType === "all" || exercise.equipment === filterType;
      const matchesComplexity =
        filterComplexity === "all" || exercise.complexity === filterComplexity;
      const matchesMovement =
        filterMovement === "all" || exercise.movementPattern === filterMovement;
      return (
        matchesSearch &&
        matchesFilter &&
        matchesType &&
        matchesComplexity &&
        matchesMovement
      );
    });
  }, [
    allExercises,
    deferredSearchTerm,
    filterCategory,
    filterType,
    filterComplexity,
    filterMovement,
  ]);

  const WorkoutList = () => {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-primary">Workout Templates</CardTitle>
            <Button
              variant="hero"
              onClick={() => setIsCreateWorkoutOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(workouts).map(([name, workout]) => {
              const metrics = calculateWorkoutMetrics(workout);
              const showAllExercises = expandedWorkouts[name] || false;

              return (
                <Card
                  key={name}
                  className="glass border-border/30 hover:shadow-card transition-all"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                      {/* Main Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-xl text-foreground">
                              {name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(metrics.totalDuration)}
                              </span>
                              <span>•</span>
                              <span>{metrics.totalExercises} exercises</span>
                              <span>•</span>
                              <span>{metrics.totalSets} sets</span>
                            </div>
                          </div>

                          {/* Action Buttons - Mobile */}
                          <div className="flex sm:hidden items-center gap-2 w-full">
                            <Button
                              onClick={() => startWorkout(name)}
                              variant="success"
                              className="flex-1"
                            >
                              <Play className="w-4 h-4" />
                              Start
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-card border-border"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log("Edit clicked for:", name);
                                    handleEditWorkout(name);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Workout
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log("Delete clicked for:", name);
                                    setWorkoutToDelete(name);
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Workout
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-md text-xs font-medium border",
                              getDifficultyColor(metrics.difficultyLevel)
                            )}
                          >
                            {metrics.difficultyLevel}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-md text-xs font-medium border",
                              getComplexityColor(metrics.complexityLevel)
                            )}
                          >
                            {metrics.complexityLevel} complexity
                          </span>
                          {metrics.primaryMuscles.slice(0, 3).map((muscle) => (
                            <span
                              key={muscle}
                              className="px-2 py-1 rounded-md text-xs font-medium bg-accent/20 text-accent border border-accent/30"
                            >
                              {muscle}
                            </span>
                          ))}
                          {metrics.primaryMuscles.length > 3 && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-muted/20 text-muted-foreground border border-muted/30">
                              +{metrics.primaryMuscles.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Exercise List */}
                        <div className="space-y-2">
                          <Collapsible
                            open={showAllExercises}
                            onOpenChange={(open) =>
                              setExpandedWorkouts((prev) => ({
                                ...prev,
                                [name]: open,
                              }))
                            }
                          >
                            <div className="space-y-1">
                              {workout.exercises
                                .slice(0, showAllExercises ? undefined : 3)
                                .map((exercise, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-muted-foreground flex items-center justify-between bg-muted/10 rounded-md p-2"
                                  >
                                    <span className="font-medium text-foreground">
                                      {exercise.name}
                                    </span>
                                    <span className="text-xs">
                                      {exercise.sets}×{exercise.reps} @{" "}
                                      {exercise.weight}kg
                                    </span>
                                  </div>
                                ))}
                            </div>

                            {workout.exercises.length > 3 && (
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 w-full text-xs"
                                >
                                  {showAllExercises ? (
                                    <>
                                      <ChevronUp className="w-3 h-3 mr-1" />
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3 mr-1" />
                                      Show {workout.exercises.length - 3} more
                                      exercises
                                    </>
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            )}
                          </Collapsible>
                        </div>

                        {/* Equipment Info */}
                        <div className="pt-2 border-t border-border/30">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">
                              Equipment needed:{" "}
                            </span>
                            {metrics.equipmentNeeded.length > 0
                              ? metrics.equipmentNeeded.join(", ")
                              : "bodyweight only"}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Desktop */}
                      <div className="hidden sm:flex flex-col items-end gap-2 min-w-fit">
                        <Button
                          onClick={() => startWorkout(name)}
                          variant="success"
                          size="lg"
                          className="whitespace-nowrap"
                        >
                          <Play className="w-4 h-4" />
                          Start Workout
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-card border-border"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                console.log("Edit clicked for:", name);
                                handleEditWorkout(name);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Workout
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log("Delete clicked for:", name);
                                setWorkoutToDelete(name);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Workout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    // Schedule handling is now done through the hook
    // if (!schedule[dateKey]) {
    //   setSchedule((prev) => ({
    //     ...prev,
    //     [dateKey]: "",
    //   }));
    // }
  };

  const assignWorkout = async (workoutName: string) => {
    const dateKey = formatDateKey(selectedDate);

    try {
      // Handle Rest Day (no workout template needed)
      // Handle Rest Day - Open configuration dialog
      if (workoutName === "Rest Day") {
        setRestDayDate(selectedDate);
        setRestDayDialogOpen(true);
        return; // Dialog will handle the actual scheduling
      }

      // Handle regular workouts
      const workoutTemplate = workoutTemplates.find(
        (template) => template.name === workoutName
      );

      if (!workoutTemplate) {
        toast({
          title: "Error",
          description: `Workout "${workoutName}" not found`,
          variant: "destructive",
        });
        return;
      }

      await scheduleWorkout(workoutTemplate.id, dateKey);

      toast({
        title: "Workout Scheduled",
        description: `${workoutName} has been scheduled for ${selectedDate.toLocaleDateString()}`,
      });
    } catch (error: unknown) {
      console.error("Failed to schedule:", error);
      toast({
        title: "Error Scheduling",
        description:
          error instanceof Error
            ? error.message
            : "Failed to schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCalendarRightClick = (
    e: React.MouseEvent,
    date: Date,
    scheduledWorkout?: string
  ) => {
    e.preventDefault();
    if (!scheduledWorkout) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      dateKey: formatDateKey(date),
      workoutName: scheduledWorkout,
    });
  };

  const handleUnscheduleFromContext = async () => {
    if (!contextMenu.dateKey) return;

    try {
      // Find the schedule entry for this date
      const scheduleEntry = scheduleEntries.find(
        (entry) => entry.scheduled_date === contextMenu.dateKey
      );

      if (!scheduleEntry) {
        toast({
          title: "Error",
          description: "Could not find scheduled workout.",
          variant: "destructive",
        });
        return;
      }

      // Delete using the schedule entry ID (not the date)
      await unscheduleWorkout(scheduleEntry.id);

      toast({
        title: "Workout Removed",
        description: "Workout has been removed from your schedule.",
      });
    } catch (error) {
      console.error("Failed to remove workout:", error);
      toast({
        title: "Error",
        description: "Failed to remove workout from schedule.",
        variant: "destructive",
      });
    }
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      dateKey: "",
      workoutName: undefined,
    });
  };

  const handleRestDaySchedule = async (config: RestDayConfig) => {
    const dateKey = formatDateKey(restDayDate);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Build notes from config
      let notesText = "";
      if (config.activities && config.activities.length > 0) {
        notesText += "Activities: " + config.activities.join(", ");
      }
      if (config.notes) {
        notesText += (notesText ? "\n" : "") + config.notes;
      }
      if (!notesText) {
        notesText = "Recovery and stretching";
      }

      // Create schedule entry
      const { error } = await supabase.from("schedule").insert({
        scheduled_date: dateKey,
        workout_id: null,
        notes: notesText,
        rest_day_type: config.type,
        user_id: user.id,
        completed: false,
      });

      if (error) throw error;

      toast({
        title: "Rest Day Scheduled",
        description: `${
          config.type.charAt(0).toUpperCase() + config.type.slice(1)
        } rest day scheduled`,
      });
    } catch (error: unknown) {
      console.error("Failed to schedule rest day:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to schedule rest day",
        variant: "destructive",
      });
    }
  };

  const CalendarView = () => {
    const isMobile = useIsMobile();

    // Mobile: Weekly Schedule View
    if (isMobile) {
      return (
        <Card className="glass border-border/50">
          <CardHeader className="p-4">
            <CardTitle className="text-foreground text-lg">
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <WeeklySchedule
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              schedule={schedule}
              workouts={workouts}
              onAssignWorkout={(date) => {
                setAssignmentDate(date);
                setShowWorkoutAssignment(true);
              }}
              onDeleteWorkout={async (dateKey) => {
                try {
                  await unscheduleWorkout(dateKey);
                  toast({
                    title: "Workout Removed",
                    description: "Workout has been removed from your schedule.",
                  });
                } catch (error) {
                  console.error("Failed to remove workout:", error);
                  toast({
                    title: "Error",
                    description: "Failed to remove workout from schedule.",
                    variant: "destructive",
                  });
                }
              }}
              onStartWorkout={startWorkout}
              workoutHistory={workoutHistory}
            />
          </CardContent>
        </Card>
      );
    }

    // Desktop: Traditional Calendar Grid View
    const days = getDaysInMonth(selectedDate);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-foreground">Workout Calendar</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() - 1
                    )
                  )
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="font-semibold text-foreground px-4 py-2">
                {`${
                  monthNames[selectedDate.getMonth()]
                } ${selectedDate.getFullYear()}`}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() + 1
                    )
                  )
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 mb-4 gap-1">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-muted-foreground text-sm py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 mb-6 gap-1">
            {days.map((day, index) => {
              if (!day) return <div key={index} className="h-20"></div>;

              const dateKey = formatDateKey(day);
              const workout = schedule[dateKey];
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected =
                day.toDateString() === selectedDate.toDateString();

              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleDateSelect(day)}
                  onContextMenu={(e) =>
                    handleCalendarRightClick(e, day, workout)
                  }
                  className={`
                    h-20 p-2 rounded-lg
                    border flex flex-col items-center justify-center transition-all hover:shadow-card relative
                    ${
                      isToday
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/20 hover:border-border/40"
                    } 
                    ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
                  `}
                >
                  <div
                    className={`font-semibold text-foreground text-sm ${
                      isToday ? "text-primary" : ""
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  {workout && (
                    <div className="mt-1 w-full flex justify-center">
                      <div className="text-xs bg-accent/20 text-accent rounded px-1 py-0.5 truncate">
                        {workout}
                      </div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {selectedDate && (
            <Card className="glass border-border/30">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {schedule[formatDateKey(selectedDate)] ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {schedule[formatDateKey(selectedDate)]}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            startWorkout(schedule[formatDateKey(selectedDate)])
                          }
                          variant="success"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={async () => {
                            const dateKey = formatDateKey(selectedDate);
                            try {
                              await unscheduleWorkout(dateKey);
                              toast({
                                title: "Workout Removed",
                                description:
                                  "Workout has been removed from your schedule.",
                              });
                            } catch (error) {
                              console.error("Failed to remove workout:", error);
                              toast({
                                title: "Error",
                                description:
                                  "Failed to remove workout from schedule.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground mb-3">
                      No workout scheduled. Choose one:
                    </p>
                    <div className="grid gap-2">
                      {Object.keys(workouts).map((workoutName) => (
                        <Button
                          key={workoutName}
                          variant="outline"
                          onClick={() => assignWorkout(workoutName)}
                          className="justify-start p-3 h-auto"
                        >
                          <div className="text-left">
                            <div className="font-medium text-foreground">
                              {workoutName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {workouts[workoutName].duration}
                            </div>
                          </div>
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => assignWorkout("Rest Day")}
                        className="justify-start p-3 h-auto"
                      >
                        <div className="text-left">
                          <div className="font-medium text-foreground">
                            Rest Day
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Recovery and stretching
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleCreateWorkout = async () => {
    if (!newWorkoutName.trim()) {
      toast({
        title: "Workout Name Required",
        description: "Please enter a name for your workout.",
        variant: "destructive",
      });
      return;
    }

    if (workouts[newWorkoutName]) {
      toast({
        title: "Workout Already Exists",
        description:
          "A workout with this name already exists. Please choose a different name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedExerciseIds.length === 0) {
      toast({
        title: "No Exercises Selected",
        description: "Please select at least one exercise for your workout.",
        variant: "destructive",
      });
      return;
    }

    const presetExercises = Object.values(exerciseDatabase).flat();
    const allExercises = [...presetExercises, ...customExercises];
    const selectedExercises = selectedExerciseIds
      .map((id) => {
        const exercise = allExercises.find((ex) => ex.id === id);
        return exercise
          ? {
              name: exercise.name,
              sets: 3,
              reps: 10,
              weight: 50,
              rest: 90,
            }
          : null;
      })
      .filter(
        (
          ex
        ): ex is {
          name: string;
          sets: number;
          reps: number;
          weight: number;
          rest: number;
        } => ex !== null
      );

    console.log(
      "🔧 DEBUG: Created workout:",
      newWorkoutName,
      selectedExercises
    );

    try {
      await createTemplate(newWorkoutName, selectedExercises, "45-60 mins");

      setIsCreateWorkoutOpen(false);
      setNewWorkoutName("");
      setSelectedExerciseIds([]);

      toast({
        title: "Workout Created!",
        description: `${newWorkoutName} has been created with ${selectedExercises.length} exercises.`,
      });
    } catch (error) {
      toast({
        title: "Error Creating Workout",
        description: "Failed to create workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditWorkout = (workoutName: string) => {
    const workout = workouts[workoutName];
    if (!workout) return;

    const allExercises = Object.values(exerciseDatabase).flat() as Exercise[];
    const exerciseIds = workout.exercises
      .map(
        (ex: {
          name: string;
          sets: number;
          reps: number;
          weight: number;
          rest: number;
        }) => {
          const found = allExercises.find(
            (exercise) => exercise.name === ex.name
          );
          return found ? found.id : null;
        }
      )
      .filter(Boolean) as number[];

    setEditingWorkout(workoutName);
    setNewWorkoutName(workoutName);
    setSelectedExerciseIds(exerciseIds);
    setIsEditWorkoutOpen(true);
  };

  const handleSaveEditWorkout = async () => {
    if (!editingWorkout || !newWorkoutName.trim()) {
      toast({
        title: "Workout Name Required",
        description: "Please enter a name for your workout.",
        variant: "destructive",
      });
      return;
    }

    if (newWorkoutName !== editingWorkout && workouts[newWorkoutName]) {
      toast({
        title: "Workout Already Exists",
        description:
          "A workout with this name already exists. Please choose a different name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedExerciseIds.length === 0) {
      toast({
        title: "No Exercises Selected",
        description: "Please select at least one exercise for your workout.",
        variant: "destructive",
      });
      return;
    }

    const presetExercises = Object.values(exerciseDatabase).flat();
    const allExercises = [...presetExercises, ...customExercises];
    const selectedExercises = selectedExerciseIds
      .map((id) => {
        const exercise = allExercises.find((ex) => ex.id === id);
        return exercise
          ? {
              name: exercise.name,
              sets: 3,
              reps: 10,
              weight: 50,
              rest: 90,
            }
          : null;
      })
      .filter((ex): ex is NonNullable<typeof ex> => ex !== null);

    const updatedWorkout = {
      duration: "45-60 mins",
      exercises: selectedExercises,
    };

    // Update the workout template
    try {
      const existingTemplate = workoutTemplates.find(
        (t) => t.name === editingWorkout
      );
      if (existingTemplate) {
        await updateTemplate(existingTemplate.id, {
          name: newWorkoutName,
          exercises: selectedExercises,
          duration_minutes: 50,
        });

        // If name changed, update schedule entries
        if (newWorkoutName !== editingWorkout) {
          // Note: Schedule updates would need to be handled by the schedule hook
          // For now, we'll handle this in the UI layer
        }
      }
    } catch (error) {
      console.error("Error updating workout template:", error);
    }

    setIsEditWorkoutOpen(false);
    setEditingWorkout(null);
    setNewWorkoutName("");
    setSelectedExerciseIds([]);

    toast({
      title: "Workout Updated!",
      description: `${newWorkoutName} has been updated with ${selectedExercises.length} exercises.`,
    });
  };

  const handleDeleteWorkout = async (workoutName: string) => {
    // Check if workout is currently active
    if (activeWorkout === workoutName) {
      toast({
        title: "Cannot Delete Active Workout",
        description:
          "Please end your current workout before deleting this template.",
        variant: "destructive",
      });
      return;
    }

    try {
      const templateToDelete = workoutTemplates.find(
        (t) => t.name === workoutName
      );
      if (templateToDelete) {
        await deleteTemplate(templateToDelete.id);
      }

      // Remove from schedule if scheduled - this would need to be handled by schedule hook
      // For now, we'll let the UI handle this gracefully
    } catch (error) {
      console.error("Error deleting workout template:", error);
    }

    toast({
      title: "Workout Deleted",
      description: `${workoutName} has been deleted from your templates.`,
    });
  };

  const toggleExerciseSelection = (exerciseId: string | number) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        exportData={exportData}
        importData={importData}
        resetAllData={resetAllData}
        onProgressClick={() => navigate("/progress")}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <Dashboard
            workoutHistory={[]} // ✅ Empty array until workout sessions implemented
            personalRecords={personalRecords}
            progressData={progressData}
          />
        )}
        {currentView === "schedule" && <CalendarView />}
        {currentView === "workouts" && <WorkoutList />}
        {currentView === "exercises" && (
          <ExerciseDatabase
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterType={filterType}
            setFilterType={setFilterType}
            filterComplexity={filterComplexity}
            setFilterComplexity={setFilterComplexity}
            filterMovement={filterMovement}
            setFilterMovement={setFilterMovement}
            filteredExercises={filteredExercises}
            showExerciseInfo={showExerciseInfo}
            setShowExerciseInfo={setShowExerciseInfo}
            setIsCreateWorkoutOpen={setIsCreateWorkoutOpen}
            setIsCreateExerciseOpen={setIsCreateExerciseOpen}
            onEditExercise={(exercise) => {
              setEditingExercise(exercise);
              setIsEditExerciseOpen(true);
            }}
            onDeleteExercise={(exerciseId) => {
              deleteCustomExercise(exerciseId.toString());
              toast({
                title: "Exercise Deleted",
                description: "Custom exercise has been removed.",
              });
            }}
          />
        )}
        {currentView === "workout" && activeWorkout && (
          <ActiveWorkoutView
            activeWorkout={activeWorkout}
            workout={workouts[activeWorkout]}
            currentExerciseIndex={currentExerciseIndex}
            currentSetIndex={currentSetIndex}
            isResting={isResting}
            restTimer={restTimer}
            workoutTimer={workoutTimer}
            isWorkoutActive={isWorkoutActive}
            completedSets={completedSets}
            onCompleteSet={completeSet}
            onSkipRest={skipRest}
            onEndWorkout={endWorkout}
          />
        )}
      </main>

      <CreateWorkoutDialog
        open={isCreateWorkoutOpen}
        onOpenChange={setIsCreateWorkoutOpen}
        newWorkoutName={newWorkoutName}
        setNewWorkoutName={setNewWorkoutName}
        selectedExerciseIds={selectedExerciseIds}
        setSelectedExerciseIds={setSelectedExerciseIds}
        onCreate={handleCreateWorkout}
        customExercises={customExercises}
        getCustomCategories={getCustomCategories}
        getCustomEquipmentTypes={getCustomEquipmentTypes}
      />

      <CreateWorkoutDialog
        open={isEditWorkoutOpen}
        onOpenChange={setIsEditWorkoutOpen}
        newWorkoutName={newWorkoutName}
        setNewWorkoutName={setNewWorkoutName}
        selectedExerciseIds={selectedExerciseIds}
        setSelectedExerciseIds={setSelectedExerciseIds}
        onCreate={handleCreateWorkout}
        editMode={true}
        editingWorkout={editingWorkout}
        customExercises={customExercises}
        getCustomCategories={getCustomCategories}
        getCustomEquipmentTypes={getCustomEquipmentTypes}
        onEdit={handleSaveEditWorkout}
      />

      <WorkoutSetupDialog
        open={isWorkoutSetupOpen}
        onOpenChange={setIsWorkoutSetupOpen}
        workoutName={pendingWorkoutName}
        workout={
          workouts[pendingWorkoutName] || { duration: "", exercises: [] }
        }
        onStartWorkout={handleStartWorkoutWithSetup}
      />

      <AlertDialog
        open={!!workoutToDelete}
        onOpenChange={() => setWorkoutToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{workoutToDelete}"? This action
              cannot be undone and will remove the workout from your templates
              and any scheduled dates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (workoutToDelete) {
                  handleDeleteWorkout(workoutToDelete);
                  setWorkoutToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Exercise Dialog */}
      <CreateExerciseDialog
        open={isCreateExerciseOpen}
        onOpenChange={setIsCreateExerciseOpen}
        onCreateExercise={async (exerciseData) => {
          try {
            // Transform camelCase to snake_case for Supabase
            const customExerciseData = {
              name: exerciseData.name,
              primary_muscle: exerciseData.primaryMuscle,
              equipment: exerciseData.equipment,
              complexity: exerciseData.complexity,
              difficulty: exerciseData.difficulty, // Map complexity to difficulty
              instructions: exerciseData.instructions,
              movement_pattern: exerciseData.movementPattern,
              requires_spotter: exerciseData.requiresSpotter,
              prerequisites: exerciseData.prerequisites,
            };
            await addCustomExercise(customExerciseData);
            setIsCreateExerciseOpen(false);

            if (user) {
              toast({
                title: "Exercise Created!",
                description: `${exerciseData.name} has been saved to your account.`,
              });
            } else {
              toast({
                title: "Exercise Created!",
                description: `${exerciseData.name} has been saved locally. Login to sync across devices.`,
              });
            }
          } catch (error) {
            console.error("Failed to create exercise:", error);
            toast({
              title: "Error Creating Exercise",
              description: "Failed to save exercise. Please try again.",
              variant: "destructive",
            });
          }
        }}
        customCategories={getCustomCategories()}
        customEquipmentTypes={getCustomEquipmentTypes()}
      />

      {/* Edit Exercise Dialog */}
      <CreateExerciseDialog
        open={isEditExerciseOpen}
        onOpenChange={(open) => {
          setIsEditExerciseOpen(open);
          if (!open) setEditingExercise(null);
        }}
        editMode={true}
        editingExercise={editingExercise}
        onUpdateExercise={(id, exerciseData) => {
          updateCustomExercise(id.toString(), exerciseData);
          setIsEditExerciseOpen(false);
          setEditingExercise(null);
        }}
        onCreateExercise={() => {}} // Not used in edit mode
        customCategories={getCustomCategories()}
        customEquipmentTypes={getCustomEquipmentTypes()}
      />

      {/* Workout Assignment Dialog for Mobile */}
      <Dialog
        open={showWorkoutAssignment}
        onOpenChange={setShowWorkoutAssignment}
      >
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="text-primary">Schedule Workout</DialogTitle>
            <DialogDescription>
              {assignmentDate &&
                `Choose a workout for ${assignmentDate.toLocaleDateString(
                  "en-US",
                  { weekday: "long", month: "long", day: "numeric" }
                )}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2">
              {Object.keys(workouts).map((workoutName) => (
                <Button
                  key={workoutName}
                  variant="outline"
                  onClick={async () => {
                    if (assignmentDate) {
                      const dateKey = assignmentDate
                        .toISOString()
                        .split("T")[0];
                      try {
                        await scheduleWorkout(dateKey, workoutName);
                        toast({
                          title: "Workout Scheduled",
                          description: `${workoutName} has been scheduled for ${assignmentDate.toLocaleDateString()}`,
                        });
                        setShowWorkoutAssignment(false);
                        setAssignmentDate(null);
                      } catch (error) {
                        console.error("Failed to schedule workout:", error);
                        toast({
                          title: "Error",
                          description: "Failed to schedule workout.",
                          variant: "destructive",
                        });
                        setShowWorkoutAssignment(false);
                        setAssignmentDate(null);
                      }
                    }
                  }}
                  className="justify-start p-3 h-auto"
                >
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      {workoutName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {workouts[workoutName].duration}
                    </div>
                  </div>
                </Button>
              ))}
              <Button
                variant="ghost"
                onClick={async () => {
                  if (assignmentDate) {
                    const dateKey = assignmentDate.toISOString().split("T")[0];
                    try {
                      await scheduleWorkout(dateKey, "Rest Day");
                      toast({
                        title: "Rest Day Scheduled",
                        description: `Rest Day has been scheduled for ${assignmentDate.toLocaleDateString()}`,
                      });
                      setShowWorkoutAssignment(false);
                      setAssignmentDate(null);
                    } catch (error) {
                      console.error("Failed to schedule rest day:", error);
                      toast({
                        title: "Error",
                        description: "Failed to schedule rest day.",
                        variant: "destructive",
                      });
                      setShowWorkoutAssignment(false);
                      setAssignmentDate(null);
                    }
                  }
                }}
                className="justify-start p-3 h-auto"
              >
                <div className="text-left">
                  <div className="font-medium text-foreground">Rest Day</div>
                  <div className="text-sm text-muted-foreground">
                    Recovery and stretching
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Rest Day Dialog */}
      <RestDayConfigDialog
        open={restDayDialogOpen}
        onOpenChange={setRestDayDialogOpen}
        onSchedule={handleRestDaySchedule}
        selectedDate={restDayDate}
      />

      {/* Calendar Context Menu */}
      <CalendarContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        onUnschedule={handleUnscheduleFromContext}
        workoutName={contextMenu.workoutName}
      />
    </div>
  );
};

export default Index;
