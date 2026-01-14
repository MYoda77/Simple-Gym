import React, { useMemo, useRef, useState, useEffect } from "react";
import { exerciseDatabase } from "@/data/exercises";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Check, Info, GripVertical, X } from "lucide-react";
import { Exercise } from "@/types/gym";
import { CustomExercise } from "@/lib/supabase-config";
import { getFormTips, hasFormTips } from "@/data/exerciseFormTips";
import { FormTipsModal } from "./FormTipsModal";
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

interface CustomExerciseExtended extends Exercise {
  isCustom: true;
  createdAt: string;
}

// Type alias for custom exercises from Supabase
type CustomExerciseData = CustomExercise;

interface CreateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newWorkoutName: string;
  setNewWorkoutName: (name: string) => void;
  selectedExerciseIds: (string | number)[];
  setSelectedExerciseIds: React.Dispatch<
    React.SetStateAction<(string | number)[]>
  >;
  onCreate: () => void;
  editMode?: boolean;
  editingWorkout?: string | null;
  onEdit?: () => void;
  customExercises: CustomExerciseData[];
  getCustomCategories: () => string[];
  getCustomEquipmentTypes: () => string[];
}

const CreateWorkoutDialog: React.FC<CreateWorkoutDialogProps> = ({
  open,
  onOpenChange,
  newWorkoutName,
  setNewWorkoutName,
  selectedExerciseIds,
  setSelectedExerciseIds,
  onCreate,
  editMode = false,
  editingWorkout = null,
  onEdit,
  customExercises,
  getCustomCategories,
  getCustomEquipmentTypes,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [dialogSearchTerm, setDialogSearchTerm] = useState("");
  const [dialogFilterCategory, setDialogFilterCategory] =
    useState<string>("all");
  const [dialogFilterType, setDialogFilterType] = useState<string>("all");
  const [dialogFilterComplexity, setDialogFilterComplexity] =
    useState<string>("all");
  const [dialogFilterMovement, setDialogFilterMovement] =
    useState<string>("all");
  const [formTipsOpen, setFormTipsOpen] = useState(false);
  const [selectedFormTips, setSelectedFormTips] = useState<any>(null);

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedExerciseIds((items) => {
      const oldIndex = items.indexOf(active.id as string | number);
      const newIndex = items.indexOf(over.id as string | number);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Combine preset and custom exercises
  const allExercises = useMemo(() => {
    const presetExercises = Object.values(exerciseDatabase).flat();
    // Map custom exercises to match Exercise interface
    const mappedCustomExercises = customExercises.map((ex) => ({
      ...ex,
      primaryMuscle: ex.primary_muscle, // Map Supabase field to Exercise field
      isCustom: true, // ← ADD THIS LINE
    }));
    return [...presetExercises, ...mappedCustomExercises];
  }, [customExercises]);

  // Get selected exercises in order
  const selectedExercises = useMemo(() => {
    return selectedExerciseIds
      .map((id) => allExercises.find((ex) => ex.id === id))
      .filter((ex): ex is Exercise => ex !== undefined);
  }, [selectedExerciseIds, allExercises]);

  // Get all available categories and equipment types
  const allMuscleGroups = useMemo(() => {
    const presetMuscles = [
      "chest",
      "back",
      "legs",
      "shoulders",
      "biceps",
      "triceps",
    ];
    const customMuscles = getCustomCategories();
    const allMuscles = [...new Set([...presetMuscles, ...customMuscles])];
    return allMuscles.sort();
  }, [getCustomCategories]);

  const allEquipmentTypes = useMemo(() => {
    const presetEquipment = [
      "barbell",
      "dumbbell",
      "bodyweight",
      "cable",
      "machine",
    ];
    const customEquipment = getCustomEquipmentTypes();
    const allEquipment = [...new Set([...presetEquipment, ...customEquipment])];
    return allEquipment.sort();
  }, [getCustomEquipmentTypes]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(dialogSearchTerm.toLowerCase());
      const matchesFilter =
        dialogFilterCategory === "all" ||
        exercise.primaryMuscle === dialogFilterCategory;
      const matchesType =
        dialogFilterType === "all" || exercise.equipment === dialogFilterType;
      const matchesComplexity =
        dialogFilterComplexity === "all" ||
        exercise.complexity === dialogFilterComplexity;
      const matchesMovement =
        dialogFilterMovement === "all" ||
        exercise.movementPattern === dialogFilterMovement;
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
    dialogSearchTerm,
    dialogFilterCategory,
    dialogFilterType,
    dialogFilterComplexity,
    dialogFilterMovement,
  ]);

  const toggleExerciseSelection = (exerciseId: string | number) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  useEffect(() => {
    if (open && nameInputRef.current) {
      // Prevent Radix auto-focus jumping and then focus the input
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [open]);

  // Sortable exercise item component
  const SortableExerciseItem = ({
    id,
    exercise,
  }: {
    id: string | number;
    exercise: Exercise;
  }) => {
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
        className="flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-md cursor-move hover:bg-primary/20 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-foreground">
          {exercise.name}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            toggleExerciseSelection(id);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass border-border/50 max-w-4xl max-h-[90vh] overflow-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-primary">
            {editMode ? "Edit Workout" : "Create New Workout"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editMode
              ? "Edit your workout by changing the name and exercises."
              : "Create a new custom workout by naming it and selecting exercises."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Workout Name
            </label>
            <Input
              ref={nameInputRef}
              placeholder="Enter workout name..."
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              className="mt-1 glass"
            />
          </div>

          {selectedExerciseIds.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Selected Exercises ({selectedExerciseIds.length})
                <span className="text-xs text-muted-foreground ml-2">
                  Drag to reorder
                </span>
              </label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedExerciseIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                    {selectedExercises.map((exercise) => (
                      <SortableExerciseItem
                        key={exercise.id}
                        id={exercise.id}
                        exercise={exercise}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-4 block">
              Select Exercises ({selectedExerciseIds.length} selected)
            </label>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[250px] relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={dialogSearchTerm}
                  onChange={(e) => setDialogSearchTerm(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
              <Select
                value={dialogFilterCategory}
                onValueChange={setDialogFilterCategory}
              >
                <SelectTrigger className="w-32 glass">
                  <SelectValue placeholder="Muscle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscles</SelectItem>
                  {allMuscleGroups.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={dialogFilterType}
                onValueChange={setDialogFilterType}
              >
                <SelectTrigger className="w-32 glass">
                  <SelectValue placeholder="Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {allEquipmentTypes.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={dialogFilterComplexity}
                onValueChange={setDialogFilterComplexity}
              >
                <SelectTrigger className="w-32 glass">
                  <SelectValue placeholder="Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={dialogFilterMovement}
                onValueChange={setDialogFilterMovement}
              >
                <SelectTrigger className="w-32 glass">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-auto">
              {filteredExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`glass border-border/30 cursor-pointer transition-all hover:shadow-card ${
                    selectedExerciseIds.includes(exercise.id)
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleExerciseSelection(exercise.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {exercise.name}
                          </h4>
                          {"isCustom" in exercise && exercise.isCustom && (
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded-full">
                              custom
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                            {exercise.primaryMuscle}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted/20 text-muted-foreground rounded-full">
                            {exercise.equipment}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              exercise.complexity === "low"
                                ? "bg-success/20 text-success"
                                : exercise.complexity === "medium"
                                ? "bg-warning/20 text-warning"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {exercise.complexity}
                          </span>
                          {exercise.requiresSpotter && (
                            <span className="text-xs px-1.5 py-0.5 bg-destructive/20 text-destructive rounded-full">
                              spotter
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasFormTips(exercise.name) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFormTips(getFormTips(exercise.name));
                              setFormTipsOpen(true);
                            }}
                          >
                            <Info className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        {selectedExerciseIds.includes(exercise.id) && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={editMode ? onEdit : onCreate} variant="hero">
              {editMode ? "Save Changes" : "Create Workout"}
            </Button>
          </div>
        </div>

        <FormTipsModal
          open={formTipsOpen}
          onOpenChange={setFormTipsOpen}
          formTips={selectedFormTips}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkoutDialog;
