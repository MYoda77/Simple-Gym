import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Sunrise, Zap, ListTodo } from "lucide-react";

interface RestDayConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (config: RestDayConfig) => void;
  selectedDate: Date;
}

export interface RestDayConfig {
  type: "complete" | "active" | "stretching" | "custom";
  activities?: string[];
  notes?: string;
}

const REST_DAY_TYPES = [
  {
    value: "complete" as const,
    label: "Complete Rest",
    description: "Full recovery day - no structured activities",
    icon: Heart,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  },
  {
    value: "active" as const,
    label: "Active Recovery",
    description: "Light activities: walking, swimming, easy cycling",
    icon: Sunrise,
    color: "bg-green-500/10 text-green-500 border-green-500/30",
  },
  {
    value: "stretching" as const,
    label: "Stretching & Mobility",
    description: "Focus on flexibility, yoga, foam rolling",
    icon: Zap,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  },
  {
    value: "custom" as const,
    label: "Custom Activities",
    description: "Define your own recovery routine",
    icon: ListTodo,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  },
];

const PRESET_ACTIVITIES = {
  active: [
    "20-30min walk",
    "15min easy bike ride",
    "15min swimming",
    "Light household activities",
  ],
  stretching: [
    "10min full body stretch",
    "15min yoga session",
    "10min foam rolling",
    "10min mobility work",
  ],
};

const RestDayConfigDialog: React.FC<RestDayConfigDialogProps> = ({
  open,
  onOpenChange,
  onSchedule,
  selectedDate,
}) => {
  const [restType, setRestType] = useState<RestDayConfig["type"]>("complete");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState("");
  const [notes, setNotes] = useState("");

  const handleReset = () => {
    setRestType("complete");
    setSelectedActivities([]);
    setCustomActivity("");
    setNotes("");
  };

  const handleSchedule = () => {
    const config: RestDayConfig = {
      type: restType,
      activities:
        selectedActivities.length > 0 ? selectedActivities : undefined,
      notes: notes.trim() || undefined,
    };

    onSchedule(config);
    handleReset();
    onOpenChange(false);
  };

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      setSelectedActivities([...selectedActivities, customActivity.trim()]);
      setCustomActivity("");
    }
  };

  const removeActivity = (activity: string) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const selectedTypeConfig = REST_DAY_TYPES.find((t) => t.value === restType);
  const Icon = selectedTypeConfig?.icon || Heart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            Configure Rest Day
          </DialogTitle>
          <DialogDescription>
            Schedule a rest day for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Rest Day Type Selection */}
          <div className="space-y-2">
            <Label>Rest Day Type</Label>
            <div className="grid gap-2">
              {REST_DAY_TYPES.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      setRestType(type.value);
                      setSelectedActivities([]);
                    }}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all
                      ${
                        restType === type.value
                          ? type.color + " border-2"
                          : "border-border/30 hover:border-border/60 bg-muted/20"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <TypeIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities (for active and stretching) */}
          {(restType === "active" || restType === "stretching") && (
            <div className="space-y-2">
              <Label>Suggested Activities (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_ACTIVITIES[restType].map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${
                        selectedActivities.includes(activity)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }
                    `}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Activities (for custom type) */}
          {restType === "custom" && (
            <div className="space-y-2">
              <Label>Add Activities</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 20min meditation"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomActivity()}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm"
                />
                <Button
                  type="button"
                  onClick={addCustomActivity}
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Selected Activities Display */}
          {selectedActivities.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Activities</Label>
              <div className="flex flex-wrap gap-2">
                {selectedActivities.map((activity) => (
                  <Badge
                    key={activity}
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {activity}
                    <button
                      onClick={() => removeActivity(activity)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this rest day..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none glass"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="bg-primary">
            Schedule Rest Day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestDayConfigDialog;
