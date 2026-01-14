import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Exercise } from "@/types/gym";
import { CustomExercise } from "@/lib/supabase-config";
import { useToast } from "@/hooks/use-toast";

// Type for mixed exercises (preset or custom from Supabase)
type MixedExercise = Exercise | CustomExercise;

interface CreateExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExercise: (exerciseData: Omit<Exercise, "id">) => void;
  editMode?: boolean;
  editingExercise?: MixedExercise | null;
  onUpdateExercise?: (
    id: string | number,
    exerciseData: Partial<Omit<Exercise, "id">>
  ) => void;
  customCategories?: string[];
  customEquipmentTypes?: string[];
}

const PRESET_CATEGORIES = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "biceps",
  "triceps",
];
const PRESET_EQUIPMENT = [
  "barbell",
  "dumbbell",
  "bodyweight",
  "cable",
  "machine",
];
const MOVEMENT_PATTERNS = [
  "push",
  "pull",
  "squat",
  "hinge",
  "carry",
  "isolation",
];

const CreateExerciseDialog: React.FC<CreateExerciseDialogProps> = ({
  open,
  onOpenChange,
  onCreateExercise,
  editMode = false,
  editingExercise = null,
  onUpdateExercise,
  customCategories = [],
  customEquipmentTypes = [],
}) => {
  const { toast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    equipment: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    complexity: "low" as "low" | "medium" | "high",
    primaryMuscle: "",
    instructions: "",
    movementPattern: "" as
      | "push"
      | "pull"
      | "squat"
      | "hinge"
      | "carry"
      | "isolation"
      | "",
    requiresSpotter: false,
    prerequisites: [] as string[],
  });

  const [customCategory, setCustomCategory] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");

  // Get all available categories and equipment
  const allCategories = [
    ...new Set([...PRESET_CATEGORIES, ...customCategories]),
  ];
  const allEquipment = [
    ...new Set([...PRESET_EQUIPMENT, ...customEquipmentTypes]),
  ];

  // Reset form when dialog opens/closes or when editing
  useEffect(() => {
    if (open) {
      if (editMode && editingExercise) {
        setFormData({
          name: editingExercise.name,
          equipment: editingExercise.equipment,
          difficulty: editingExercise.difficulty as
            | "beginner"
            | "intermediate"
            | "advanced",
          complexity: editingExercise.complexity as "low" | "medium" | "high",
          primaryMuscle:
            (editingExercise as { primaryMuscle?: string }).primaryMuscle ||
            (editingExercise as { primary_muscle?: string }).primary_muscle ||
            "",
          instructions: editingExercise.instructions,
          movementPattern: (editingExercise.movementPattern || "") as
            | ""
            | "push"
            | "pull"
            | "squat"
            | "hinge"
            | "carry"
            | "isolation",
          requiresSpotter: editingExercise.requiresSpotter || false,
          prerequisites: editingExercise.prerequisites || [],
        });
      } else {
        setFormData({
          name: "",
          equipment: "",
          difficulty: "beginner",
          complexity: "low",
          primaryMuscle: "",
          instructions: "",
          movementPattern: "",
          requiresSpotter: false,
          prerequisites: [],
        });
      }
      setCustomCategory("");
      setCustomEquipment("");
      setPrerequisiteInput("");

      // Focus name input
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [open, editMode, editingExercise]);

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Exercise name is required.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.primaryMuscle ||
      (formData.primaryMuscle === "custom" && !customCategory.trim())
    ) {
      toast({
        title: "Validation Error",
        description: "Primary muscle group is required.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.equipment ||
      (formData.equipment === "custom" && !customEquipment.trim())
    ) {
      toast({
        title: "Validation Error",
        description: "Equipment type is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.instructions.trim()) {
      toast({
        title: "Validation Error",
        description: "Exercise instructions are required.",
        variant: "destructive",
      });
      return;
    }

    // Prepare exercise data
    const exerciseData: Omit<Exercise, "id"> = {
      name: formData.name.trim(),
      equipment:
        formData.equipment === "custom"
          ? customEquipment.trim()
          : formData.equipment,
      difficulty: formData.difficulty,
      complexity: formData.complexity,
      primaryMuscle:
        formData.primaryMuscle === "custom"
          ? customCategory.trim()
          : formData.primaryMuscle,
      instructions: formData.instructions.trim(),
      ...(formData.movementPattern && {
        movementPattern: formData.movementPattern,
      }),
      ...(formData.requiresSpotter && {
        requiresSpotter: formData.requiresSpotter,
      }),
      ...(formData.prerequisites.length > 0 && {
        prerequisites: formData.prerequisites,
      }),
    };

    if (editMode && editingExercise && onUpdateExercise) {
      onUpdateExercise(editingExercise.id, exerciseData);
      toast({
        title: "Exercise Updated",
        description: `${exerciseData.name} has been updated successfully.`,
      });
    } else {
      onCreateExercise(exerciseData);
      toast({
        title: "Exercise Created",
        description: `${exerciseData.name} has been added to your custom exercises.`,
      });
    }

    onOpenChange(false);
  };

  const addPrerequisite = () => {
    if (
      prerequisiteInput.trim() &&
      !formData.prerequisites.includes(prerequisiteInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      // Don't set primaryMuscle to empty customCategory
      // Wait for user to type in the custom input field
      setFormData((prev) => ({ ...prev, primaryMuscle: "custom" }));
    } else {
      setFormData((prev) => ({ ...prev, primaryMuscle: value }));
      setCustomCategory("");
    }
  };

  const handleEquipmentChange = (value: string) => {
    if (value === "custom") {
      // Don't set equipment to empty customEquipment
      // Wait for user to type in the custom input field
      setFormData((prev) => ({ ...prev, equipment: "custom" }));
    } else {
      setFormData((prev) => ({ ...prev, equipment: value }));
      setCustomEquipment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass border-border/50 max-w-2xl max-h-[90vh] overflow-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-primary">
            {editMode ? "Edit Exercise" : "Create Custom Exercise"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update the details of your custom exercise."
              : "Add a new exercise to your personal database. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name *</Label>
            <Input
              ref={nameInputRef}
              id="name"
              placeholder="e.g., Incline Dumbbell Press"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="glass"
            />
          </div>

          {/* Primary Muscle Group */}
          <div className="space-y-2">
            <Label htmlFor="muscle">Primary Muscle Group *</Label>
            <div className="space-y-2">
              <Select
                value={formData.primaryMuscle}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Other (specify below)</SelectItem>
                </SelectContent>
              </Select>

              {formData.primaryMuscle === "custom" && (
                <Input
                  placeholder="Enter custom muscle group"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="glass"
                />
              )}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment *</Label>
            <div className="space-y-2">
              <Select
                value={formData.equipment}
                onValueChange={handleEquipmentChange}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {allEquipment.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Other (specify below)</SelectItem>
                </SelectContent>
              </Select>

              {formData.equipment === "custom" && (
                <Input
                  placeholder="Enter custom equipment"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  className="glass"
                />
              )}
            </div>
          </div>

          {/* Difficulty and Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select
                value={formData.complexity}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, complexity: value }))
                }
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Movement Pattern */}
          <div className="space-y-2">
            <Label htmlFor="movement">Movement Pattern (Optional)</Label>
            <Select
              value={formData.movementPattern}
              onValueChange={(value: any) =>
                setFormData((prev) => ({ ...prev, movementPattern: value }))
              }
            >
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select movement pattern" />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_PATTERNS.map((pattern) => (
                  <SelectItem key={pattern} value={pattern}>
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Exercise Instructions *</Label>
            <Textarea
              id="instructions"
              placeholder="Describe how to perform this exercise step by step..."
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              className="glass min-h-[100px]"
            />
          </div>

          {/* Requires Spotter */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spotter"
              checked={formData.requiresSpotter}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, requiresSpotter: !!checked }))
              }
            />
            <Label htmlFor="spotter">
              This exercise requires a spotter for safety
            </Label>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Basic hip hinge knowledge"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addPrerequisite())
                }
                className="glass"
              />
              <Button type="button" variant="outline" onClick={addPrerequisite}>
                Add
              </Button>
            </div>
            {formData.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted/20 text-sm rounded-full"
                  >
                    {prereq}
                    <button
                      type="button"
                      onClick={() => removePrerequisite(index)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="hero">
              {editMode ? "Update Exercise" : "Create Exercise"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExerciseDialog;
