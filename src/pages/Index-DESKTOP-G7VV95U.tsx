import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useDeferredValue,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Copy,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { useAchievements } from "@/hooks/useAchievements";
import {
  UserStats,
  calculateStreak,
  getThisWeekWorkouts,
} from "@/utils/achievementSystem";
import { generateWorkoutRecommendations } from "@/utils/aiRecommendations";
import CalendarContextMenu from "@/components/gym/CalendarContextMenu";
import Dashboard from "@/components/gym/Dashboard";
import Header from "@/components/gym/Header";
import ActiveWorkoutView from "@/components/gym/ActiveWorkoutView";
import { AchievementUnlockNotification } from "@/components/gym/ConfettiCelebration";
import CreateWorkoutDialog from "@/components/gym/CreateWorkoutDialog";
import CreateExerciseDialog from "@/components/gym/CreateExerciseDialog";
import WorkoutSetupDialog from "@/components/gym/WorkoutSetupDialog";
import WeeklySchedule from "@/components/gym/WeeklySchedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestDayConfigDialog, {
  RestDayConfig,
} from "@/components/gym/RestDayConfigDialog";
import { RestDayView } from "@/components/gym/RestDayView";
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
            <Button
              variant="hero"
              onClick={() => setIsCreateExerciseOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full glass">
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
                <SelectTrigger className="w-full glass">
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
                <SelectTrigger className="w-full glass">
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
                <SelectTrigger className="w-full glass">
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
  const location = useLocation();
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
    refresh: refreshSchedule,
    loading: scheduleLoading,
  } = useSchedule();

  // Achievement system
  const { achievements, checkAndUnlockAchievements, resetAchievements } =
    useAchievements();

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

  // State declarations that are needed by callbacks
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define startWorkout with useCallback before using it in effects
  const startWorkout = useCallback(
    (workoutName: string, date?: string) => {
      // Check if this is a Rest Day
      if (workoutName === "Rest Day") {
        // Find the schedule entry for this date to get rest day details
        const dateKey = date || formatDateKey(selectedDate);
        const scheduleEntry = scheduleEntries.find(
          (entry) =>
            entry.scheduled_date === dateKey && entry.workout_id === null
        );

        if (scheduleEntry) {
          setActiveRestDay({
            type: scheduleEntry.rest_day_type || "complete",
            notes: scheduleEntry.notes || undefined,
            date: dateKey,
          });
          setCurrentView("workout");
        } else {
          toast({
            title: "Error",
            description: "Rest day details not found",
            variant: "destructive",
          });
        }
        return;
      }

      setPendingWorkoutName(workoutName);
      setIsWorkoutSetupOpen(true);
    },
    [scheduleEntries, selectedDate, toast]
  );

  // Handle workout start from navigation state (e.g., from Progress page)
  useEffect(() => {
    if (location.state?.startWorkout && workoutTemplates.length > 0) {
      const workoutName = location.state.startWorkout;
      // Clear the state to prevent repeated triggers
      window.history.replaceState({}, document.title);
      // Start the workout
      startWorkout(workoutName);
    }
  }, [location.state, workoutTemplates.length, startWorkout]);

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
  const [restDayDialogOpen, setRestDayDialogOpen] = useState(false);
  const [restDayDate, setRestDayDate] = useState<Date>(new Date());
  const [activeRestDay, setActiveRestDay] = useState<{
    type: string;
    notes?: string;
    date: string;
  } | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [activeWorkoutData, setActiveWorkoutData] = useState<Workout | null>(
    null
  );
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

  // Achievement notification state
  const [showAchievementNotification, setShowAchievementNotification] =
    useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<{
    icon: string;
    title: string;
    description: string;
  } | null>(null);

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

  // Load workout history from localStorage
  const [workoutHistoryRecords, setWorkoutHistoryRecords] = useState<
    WorkoutRecord[]
  >(() => {
    const saved = localStorage.getItem("workout-history");
    return saved ? JSON.parse(saved) : [];
  });

  // Use hook workout history for progress data (weight/BMI)
  const progressWorkoutHistory = useMemo(() => {
    return hookWorkoutHistory.map((entry) => ({
      date: entry.date,
      weight: entry.weight || 0,
      bodyFat: entry.body_fat_percentage || 0,
    }));
  }, [hookWorkoutHistory]);

  const [personalRecords, setPersonalRecords] = useState<
    Record<string, number>
  >(() => {
    const saved = localStorage.getItem("personal-records");
    return saved ? JSON.parse(saved) : {};
  });
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

  // Persist personal records to localStorage
  useEffect(() => {
    localStorage.setItem("personal-records", JSON.stringify(personalRecords));
  }, [personalRecords]);

  // Calculate user stats for achievement system
  const calculateUserStats = useCallback((): UserStats => {
    // Calculate streaks
    const { currentStreak, maxStreak } = calculateStreak(workoutHistoryRecords);
    const thisWeekWorkouts = getThisWeekWorkouts(workoutHistoryRecords);

    // Get first workout date
    const firstWorkout =
      workoutHistoryRecords.length > 0
        ? workoutHistoryRecords[workoutHistoryRecords.length - 1].date
        : undefined;

    // Count unique exercises from workout history and personal records
    const uniqueExercises = new Set<string>();
    workoutHistoryRecords.forEach((workout) => {
      if (workout.name) uniqueExercises.add(workout.name);
    });
    Object.keys(personalRecords).forEach((exercise) => {
      uniqueExercises.add(exercise);
    });

    // Check if weight has been logged
    const weightLogged = progressData.length > 0;

    return {
      totalWorkouts: workoutHistoryRecords.length,
      thisWeekWorkouts,
      totalPRs: Object.keys(personalRecords).length,
      currentStreak,
      maxStreak,
      weightLogged,
      firstWorkoutDate: firstWorkout,
      totalWeight: 0,
      uniqueExercises: uniqueExercises.size,
    };
  }, [workoutHistoryRecords, personalRecords, progressData]);

  // Sync achievements on initial load - check if any should be unlocked based on current stats
  useEffect(() => {
    // Only run after data is loaded
    if (!progressLoading && !workoutsLoading) {
      const stats = calculateUserStats();
      const newAchievements = checkAndUnlockAchievements(stats);

      // Silently unlock any missing achievements without showing notifications
      // This handles cases where achievements weren't unlocked due to bugs or data resets
      if (newAchievements.length > 0) {
        console.log(
          `✅ Synced ${newAchievements.length} missing achievements based on current stats`
        );
      }
    }
  }, [
    progressLoading,
    workoutsLoading,
    calculateUserStats,
    checkAndUnlockAchievements,
  ]);

  // Calculate user stats for Dashboard
  const userStats = useMemo(() => calculateUserStats(), [calculateUserStats]);

  // Generate AI recommendations based on workout history
  const recommendations = useMemo(() => {
    try {
      // Flatten the exerciseDatabase object into a single array
      const presetExercises = Object.values(exerciseDatabase).flat();

      // Convert custom exercises to Exercise format (compatible with AI engine)
      const customExercisesAsExercises: Exercise[] = customExercises.map(
        (custom, index) => ({
          id: 10000 + index, // Use high IDs to avoid conflicts
          name: custom.name,
          equipment: custom.equipment,
          difficulty: custom.difficulty as
            | "beginner"
            | "intermediate"
            | "advanced",
          complexity: custom.complexity as "low" | "medium" | "high",
          primaryMuscle: custom.primaryMuscle || custom.primary_muscle,
          instructions: custom.instructions,
          movementPattern: custom.movementPattern as
            | "push"
            | "pull"
            | "squat"
            | "hinge"
            | "carry"
            | "isolation"
            | undefined,
          requiresSpotter: custom.requiresSpotter,
          prerequisites: custom.prerequisites,
        })
      );

      const combinedExercises = [
        ...presetExercises,
        ...customExercisesAsExercises,
      ];

      return generateWorkoutRecommendations(
        workoutHistoryRecords,
        personalRecords,
        combinedExercises,
        userStats
      );
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }, [workoutHistoryRecords, personalRecords, customExercises, userStats]);

  const handleStartWorkoutWithSetup = (customWorkout: Workout) => {
    setActiveWorkout(pendingWorkoutName);
    setActiveWorkoutData(customWorkout);
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
    if (!activeWorkout || !activeWorkoutData) return;

    const exercise = activeWorkoutData.exercises[currentExerciseIndex];
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

      // Add PR to recent activities
      const prActivity = {
        id: Date.now().toString(),
        type: "pr" as const,
        date: new Date().toISOString(),
        description: `New PR: ${exerciseName} - ${actualWeight}kg`,
        icon: "trophy",
      };
      const currentActivities = JSON.parse(
        localStorage.getItem("progress-activities") || "[]"
      );
      localStorage.setItem(
        "progress-activities",
        JSON.stringify([prActivity, ...currentActivities.slice(0, 9)])
      );

      toast({
        title: "New Personal Record! 🏆",
        description: `${exerciseName}: ${actualWeight}kg (previous: ${
          currentRecord || "none"
        })`,
      });

      // Check for achievements after setting PR
      setTimeout(() => {
        const stats = calculateUserStats();
        const newAchievements = checkAndUnlockAchievements(stats);

        // Show confetti notification for each achievement
        newAchievements.forEach((achievement, index) => {
          setTimeout(() => {
            setCurrentAchievement(achievement);
            setShowAchievementNotification(true);

            // Also show toast
            toast({
              title: `${achievement.icon} Achievement Unlocked!`,
              description: achievement.title,
            });
          }, index * 5500); // Stagger multiple achievements
        });
      }, 500);
    }

    if (currentSetIndex < exercise.sets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setIsResting(true);
      setRestTimer(exercise.rest);
    } else if (currentExerciseIndex < activeWorkoutData.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setIsResting(true);
      setRestTimer(activeWorkoutData.exercises[currentExerciseIndex + 1].rest);
    } else {
      // Workout complete
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    if (!activeWorkout || !activeWorkoutData) return;

    setIsWorkoutActive(false);
    const completedWorkoutName = activeWorkout;
    const completedDuration = workoutTimer;
    const completedExerciseCount = activeWorkoutData.exercises.length;
    const completedTotalSets = activeWorkoutData.exercises.reduce(
      (acc, ex) => acc + ex.sets,
      0
    );

    setActiveWorkout(null); // Clear active workout state
    setActiveWorkoutData(null); // Clear active workout data
    setCurrentExerciseIndex(0); // Reset exercise index
    setCurrentSetIndex(0); // Reset set index
    setIsResting(false); // Clear rest state
    setRestTimer(0); // Clear rest timer

    const workoutRecord: WorkoutRecord = {
      date: new Date().toISOString(),
      name: completedWorkoutName,
      duration: completedDuration,
      exercises: completedExerciseCount,
      totalSets: completedTotalSets,
      exerciseDetails: activeWorkoutData.exercises.map((ex) => ({
        exerciseName: ex.name,
        sets: Array(ex.sets).fill({
          reps: ex.reps,
          weight: personalRecords[ex.name] || 0,
        }),
      })),
    };

    // Add workout to history in localStorage
    const workoutHistory = JSON.parse(
      localStorage.getItem("workout-history") || "[]"
    );
    const updatedHistory = [workoutRecord, ...workoutHistory];
    localStorage.setItem("workout-history", JSON.stringify(updatedHistory));
    // Update state immediately
    setWorkoutHistoryRecords(updatedHistory);

    console.log("Workout completed and saved:", workoutRecord);
    console.log("Updated history:", updatedHistory);

    // Check for achievements IMMEDIATELY before they get auto-synced
    const stats = calculateUserStats();
    console.log("Achievement check - User stats:", stats);
    const newAchievements = checkAndUnlockAchievements(stats);
    console.log("New achievements unlocked:", newAchievements);

    // Add workout completion to recent activities
    const workoutActivity = {
      id: Date.now().toString(),
      type: "workout" as const,
      date: workoutRecord.date,
      description: `Completed ${completedWorkoutName} - ${completedExerciseCount} exercises, ${completedTotalSets} sets`,
      icon: "dumbbell",
    };
    const currentActivities = JSON.parse(
      localStorage.getItem("progress-activities") || "[]"
    );
    localStorage.setItem(
      "progress-activities",
      JSON.stringify([workoutActivity, ...currentActivities.slice(0, 9)])
    );

    // Show confetti notification for each newly unlocked achievement
    newAchievements.forEach((achievement, index) => {
      setTimeout(() => {
        console.log("Showing achievement:", achievement);
        setCurrentAchievement(achievement);
        setShowAchievementNotification(true);

        // Also show toast
        toast({
          title: `${achievement.icon} Achievement Unlocked!`,
          description: achievement.title,
        });
      }, (index + 1) * 5500); // Stagger multiple achievements, start after 5.5s
    });

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
    setActiveWorkoutData(null);
    setCurrentView("dashboard");
    toast({
      title: "Workout Ended",
      description: "Your progress has been saved.",
    });
  };

  const handleCompleteRestDay = async () => {
    if (!activeRestDay) return;

    try {
      // Find the schedule entry to mark as complete
      const scheduleEntry = scheduleEntries.find(
        (entry) =>
          entry.scheduled_date === activeRestDay.date &&
          entry.workout_id === null
      );

      if (scheduleEntry) {
        // Mark as completed in the database
        const { error } = await supabase
          .from("schedule")
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq("id", scheduleEntry.id);

        if (error) throw error;
      }

      // Log the rest day as a workout record
      const workoutRecord: WorkoutRecord = {
        date: new Date().toISOString(),
        name: "Rest Day",
        duration: 0,
        exercises: 0,
        totalSets: 0,
      };

      await logWorkout(workoutRecord);

      toast({
        title: "Rest Day Complete! 🧘",
        description: "Great job prioritizing recovery!",
      });

      setActiveRestDay(null);
      setCurrentView("dashboard");
      await refreshSchedule();
    } catch (error) {
      console.error("Failed to complete rest day:", error);
      toast({
        title: "Error",
        description: "Failed to mark rest day as complete",
        variant: "destructive",
      });
    }
  };

  const handleCancelRestDay = () => {
    setActiveRestDay(null);
    setCurrentView("dashboard");
  };

  const exportData = () => {
    const data = {
      workouts,
      schedule,
      workoutHistory: workoutHistoryRecords,
      personalRecords,
      progressData: progressWorkoutHistory,
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

  const handleReorderExercises = useCallback(
    async (workoutName: string, event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const workout = workouts[workoutName];
      if (!workout) return;

      const oldIndex = workout.exercises.findIndex(
        (_, idx) => `exercise-${idx}` === active.id
      );
      const newIndex = workout.exercises.findIndex(
        (_, idx) => `exercise-${idx}` === over.id
      );

      if (oldIndex === -1 || newIndex === -1) return;

      const newExercises = arrayMove(workout.exercises, oldIndex, newIndex);

      // Find the template ID for this workout
      const template = workoutTemplates.find((t) => t.name === workoutName);
      if (!template) return;

      try {
        await updateTemplate(template.id, {
          name: workoutName,
          exercises: newExercises,
        });

        toast({
          title: "Exercise Order Updated",
          description: "Exercises reordered successfully.",
        });
      } catch (error) {
        console.error("Failed to reorder exercises:", error);
        toast({
          title: "Error",
          description: "Failed to update exercise order.",
          variant: "destructive",
        });
      }
    },
    [workouts, workoutTemplates, updateTemplate, toast]
  );

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
                // Find the workout template ID for the workout name
                const workoutTemplate = workoutTemplates.find(
                  (template) => template.name === workoutName
                );

                if (workoutTemplate) {
                  await scheduleWorkout(workoutTemplate.id, date);
                  importedCount++;
                } else {
                  console.warn(
                    `Workout template "${workoutName}" not found for date ${date}`
                  );
                }
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
          setWorkoutHistoryRecords(data.workoutHistory);
          localStorage.setItem(
            "workout-history",
            JSON.stringify(data.workoutHistory)
          );
          importedCount += data.workoutHistory.length;
        }

        // Import personal records (stored locally only)
        if (data.personalRecords && typeof data.personalRecords === "object") {
          setPersonalRecords(data.personalRecords);
          localStorage.setItem(
            "personal-records",
            JSON.stringify(data.personalRecords)
          );
          importedCount += Object.keys(data.personalRecords).length;
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

  // Sortable Exercise Item Component
  interface SortableExerciseItemProps {
    id: string;
    exercise: {
      name: string;
      sets: number;
      reps: number;
      weight: number;
    };
  }

  const SortableExerciseItem = ({
    id,
    exercise,
  }: SortableExerciseItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="text-sm text-muted-foreground flex items-center justify-between bg-muted/10 rounded-md p-2 cursor-move hover:bg-muted/20 transition-colors"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{exercise.name}</span>
        </div>
        <span className="text-xs">
          {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
        </span>
      </div>
    );
  };

  const WorkoutList = () => {
    // Setup drag and drop sensors
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

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
                                  onClick={async () => {
                                    const workout = workoutTemplates.find(
                                      (t) => t.name === name
                                    );
                                    if (workout) {
                                      // Create a duplicate by copying the workout
                                      const durationStr =
                                        workout.duration_minutes
                                          ? `${workout.duration_minutes} mins`
                                          : "45-60 mins";
                                      await createTemplate(
                                        `${name} (Copy)`,
                                        workout.exercises,
                                        durationStr
                                      );
                                      toast({
                                        title: "Workout Duplicated",
                                        description: `${name} has been duplicated.`,
                                      });
                                    }
                                  }}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate Workout
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
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) =>
                                handleReorderExercises(name, event)
                              }
                            >
                              <SortableContext
                                items={workout.exercises.map(
                                  (_, idx) => `exercise-${idx}`
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-1">
                                  {workout.exercises
                                    .slice(0, showAllExercises ? undefined : 3)
                                    .map((exercise, idx) => (
                                      <SortableExerciseItem
                                        key={`exercise-${idx}`}
                                        id={`exercise-${idx}`}
                                        exercise={exercise}
                                      />
                                    ))}
                                </div>
                              </SortableContext>
                            </DndContext>

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
                              onClick={async () => {
                                const workout = workoutTemplates.find(
                                  (t) => t.name === name
                                );
                                if (workout) {
                                  // Create a duplicate by copying the workout
                                  const durationStr = workout.duration_minutes
                                    ? `${workout.duration_minutes} mins`
                                    : "45-60 mins";
                                  await createTemplate(
                                    `${name} (Copy)`,
                                    workout.exercises,
                                    durationStr
                                  );
                                  toast({
                                    title: "Workout Duplicated",
                                    description: `${name} has been duplicated.`,
                                  });
                                }
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate Workout
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

    // Pad to always have 42 cells (6 rows × 7 days) for consistent square sizing
    while (days.length < 42) {
      days.push(null);
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

      await scheduleWorkout(dateKey, workoutName);

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

      // Delete using the date (not the ID)
      await unscheduleWorkout(contextMenu.dateKey);

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

      // Refresh schedule to show the new rest day
      await refreshSchedule();

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
                  // Find the schedule entry for this date
                  const scheduleEntry = scheduleEntries.find(
                    (entry) => entry.scheduled_date === dateKey
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
              }}
              onStartWorkout={startWorkout}
              workoutHistory={workoutHistoryRecords}
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

          <div className="grid grid-cols-7 mb-6 gap-1 md:gap-2">
            {days.map((day, index) => {
              if (!day)
                return (
                  <div key={index} className="h-20 md:aspect-square"></div>
                );

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
                    h-20 md:aspect-square md:h-auto p-2 rounded-lg
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
                    <div className="mt-1 w-full flex justify-center px-1">
                      <div className="text-xs bg-accent/20 text-accent rounded px-1 py-0.5 truncate max-w-full overflow-hidden whitespace-nowrap">
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
                              // Find the schedule entry for this date
                              const scheduleEntry = scheduleEntries.find(
                                (entry) => entry.scheduled_date === dateKey
                              );

                              if (!scheduleEntry) {
                                toast({
                                  title: "Error",
                                  description:
                                    "Could not find scheduled workout.",
                                  variant: "destructive",
                                });
                                return;
                              }

                              // Delete using the schedule entry ID (not the date)
                              await unscheduleWorkout(scheduleEntry.id);
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
          duration: "45-60 mins",
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
        onProgressClick={() => navigate("/progress")}
        onProfileClick={() => navigate("/profile")}
      />

      <main
        className={`max-w-7xl mx-auto ${
          currentView === "workout"
            ? "px-1 py-2 sm:px-2 sm:py-4"
            : "px-2 sm:px-4 py-8"
        }`}
      >
        {currentView === "dashboard" && (
          <Dashboard
            workoutHistory={workoutHistoryRecords}
            personalRecords={personalRecords}
            progressData={progressData}
            achievements={achievements}
            stats={userStats}
            recommendations={recommendations}
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
        {currentView === "workout" && activeRestDay && (
          <RestDayView
            restDayType={activeRestDay.type}
            notes={activeRestDay.notes}
            onComplete={handleCompleteRestDay}
            onCancel={handleCancelRestDay}
          />
        )}
        {currentView === "workout" && activeWorkout && activeWorkoutData && (
          <ActiveWorkoutView
            activeWorkout={activeWorkout}
            workout={activeWorkoutData}
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
                        // Find the workout template ID from the workout name
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
                      if (!user) {
                        throw new Error("User not authenticated");
                      }
                      // Rest Day requires direct Supabase insert with null workout_id
                      const { error } = await supabase.from("schedule").insert({
                        scheduled_date: dateKey,
                        workout_id: null,
                        notes: "Rest Day",
                        user_id: user.id,
                        completed: false,
                      });

                      if (error) throw error;

                      await refreshSchedule(); // Refresh schedule
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

      {/* Achievement Unlock Notification with Confetti */}
      {currentAchievement && (
        <AchievementUnlockNotification
          achievement={currentAchievement}
          show={showAchievementNotification}
          onClose={() => {
            setShowAchievementNotification(false);
            setCurrentAchievement(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
