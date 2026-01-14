import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { KeyStats } from "@/components/progress/KeyStats";
import { ProgressCharts } from "@/components/progress/ProgressCharts";
import { Achievements } from "@/components/progress/Achievements";
import { ProgressPhotos } from "@/components/progress/ProgressPhotos";
import { RecentActivity } from "@/components/progress/RecentActivity";
import { QuickAdd } from "@/components/progress/QuickAdd";
import { LogWeightDialog } from "@/components/progress/LogWeightDialog";
import { WorkoutHeatmap } from "@/components/progress/WorkoutHeatmap";
import { WorkoutAnalytics } from "@/components/progress/WorkoutAnalytics";
import { ProgressiveOverload } from "@/components/progress/ProgressiveOverload";
import {
  TierProgressCard,
  RarityStatsCard,
  RarityAchievementsGrid,
  PointsWidget,
} from "@/components/gym/RarityUI";
import {
  Stat,
  Achievement,
  ProgressPhoto,
  Activity,
  ProgressData,
  WeightLog,
} from "@/types/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";

const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logWeightOpen, setLogWeightOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User settings for BMI calculation
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem("user-settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error parsing user settings:", error);
      }
    }
    return {
      height: 175, // default height in cm
      units: "metric", // metric or imperial
    };
  });

  // Progress data state - can be reset and persisted
  const [stats, setStats] = useState<Stat[]>(() => {
    const saved = localStorage.getItem("progress-stats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error parsing saved stats:", error);
      }
    }
    // Return initial empty stats to show structure
    return [
      { label: "Current Weight", value: "-", icon: "⚖️", unit: "kg" },
      { label: "Total Workouts", value: 0, icon: "💪", unit: "" },
      { label: "This Week", value: 0, icon: "📅", unit: "workouts" },
      { label: "Streak", value: 0, icon: "🔥", unit: "days" },
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("progress-achievements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error parsing saved achievements:", error);
      }
    }
    // Return initial welcome achievement
    return [
      {
        id: "welcome",
        title: "Welcome to SimpleGym!",
        date: new Date().toISOString(),
        icon: "🎉",
        description:
          "Start your fitness journey by logging your first workout or weight.",
      },
    ];
  });

  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem("progress-photos");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("progress-activities");
    return saved ? JSON.parse(saved) : [];
  });

  const [progressData, setProgressData] = useState<ProgressData>(() => {
    const saved = localStorage.getItem("main-progress-data");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // If it's an array (from Index.tsx), take the first element
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData[0];
        }
        // If it's already an object, use it directly
        if (parsedData && typeof parsedData === "object") {
          return parsedData;
        }
      } catch (error) {
        console.error("Error parsing saved progress data:", error);
      }
    }
    // Return empty structure for fresh start
    return {
      weight: [],
      bmi: [],
      measurements: [],
    };
  });

  // Load workout history and personal records for analytics components
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem("workout-history");
    return saved ? JSON.parse(saved) : [];
  });

  const [personalRecords, setPersonalRecords] = useState<
    Record<string, number>
  >(() => {
    const saved = localStorage.getItem("personal-records");
    return saved ? JSON.parse(saved) : {};
  });

  const handleLogWeight = (data: {
    weight: number;
    bodyFat?: number;
    notes?: string;
    date: string;
  }) => {
    console.log("Logging weight:", data);
    console.log("Current progressData before update:", progressData);

    try {
      // Create weight log entry for progress data
      const weightEntry = {
        date: data.date,
        value: data.weight,
      };

      // Calculate BMI using user's actual height
      const heightInMeters = userSettings.height / 100; // Convert cm to meters
      const bmi = data.weight / (heightInMeters * heightInMeters);
      const bmiEntry = {
        date: data.date,
        value: Math.round(bmi * 10) / 10, // Round to 1 decimal place
      };

      // Add to progress data
      setProgressData((prev) => ({
        ...prev,
        weight: [...prev.weight, weightEntry],
        bmi: [...prev.bmi, bmiEntry],
      }));

      // Update recent activities
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: "weight" as const,
        date: data.date,
        description: `${data.weight}kg${
          data.bodyFat ? ` (${data.bodyFat}% body fat)` : ""
        }${data.notes ? ` - ${data.notes}` : ""}`,
        icon: "scale",
      };

      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Update stats if this is a new record or first entry
      const currentWeightStat = stats.find((s) => s.label === "Current Weight");
      const currentBMIStat = stats.find((s) => s.label === "Current BMI");

      setStats((prev) => {
        const filtered = prev.filter(
          (s) => s.label !== "Current Weight" && s.label !== "Current BMI"
        );
        return [
          {
            label: "Current Weight",
            value: data.weight,
            icon: "⚖️",
            unit: "kg",
          },
          {
            label: "Current BMI",
            value: Math.round(bmi * 10) / 10,
            icon: "📊",
            unit: "",
          },
          ...filtered,
        ];
      });

      // Success toast
      toast({
        title: "Weight Logged Successfully! 🎯",
        description: `Recorded ${data.weight}kg with BMI of ${
          Math.round(bmi * 10) / 10
        }`,
      });

      console.log(
        "Weight logged successfully, updated progressData:",
        progressData
      );
    } catch (error) {
      console.error("Error logging weight:", error);
      toast({
        title: "Error",
        description: "Failed to log weight. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPhoto = () => {
    toast({
      title: "Photo feature coming soon!",
      description: "Progress photo upload will be available soon.",
    });
  };

  const handleSettings = () => {
    setTempHeight(userSettings.height.toString());
    setSettingsOpen(true);
  };

  const handleSaveSettings = (newSettings: {
    height: number;
    units: string;
  }) => {
    setUserSettings(newSettings);
    localStorage.setItem("user-settings", JSON.stringify(newSettings));
    toast({
      title: "Settings Saved",
      description: `Height updated to ${newSettings.height}cm`,
    });
    setSettingsOpen(false);
  };

  // Local state for settings form
  const [tempHeight, setTempHeight] = useState(userSettings.height.toString());

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("progress-stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("progress-achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("progress-photos", JSON.stringify(progressPhotos));
  }, [progressPhotos]);

  useEffect(() => {
    localStorage.setItem(
      "progress-activities",
      JSON.stringify(recentActivities)
    );
  }, [recentActivities]);

  useEffect(() => {
    // Save as array format for compatibility with Index.tsx
    const dataArray = [progressData];
    localStorage.setItem("main-progress-data", JSON.stringify(dataArray));
  }, [progressData]);

  useEffect(() => {
    localStorage.setItem("user-settings", JSON.stringify(userSettings));
  }, [userSettings]);

  // Initialize component
  useEffect(() => {
    try {
      console.log("Initializing Progress page...", {
        stats,
        achievements,
        progressData,
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing Progress page:", err);
      setError("Failed to load progress data");
      setIsLoading(false);
    }
  }, [stats, achievements, progressData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const resetProgressData = () => {
    // Reset all progress-related state to empty defaults
    setStats([]);
    setAchievements([]);
    setProgressPhotos([]);
    setRecentActivities([]);
    setProgressData({
      weight: [],
      bmi: [],
      measurements: [],
    });

    // Also clear localStorage
    localStorage.removeItem("progress-stats");
    localStorage.removeItem("progress-achievements");
    localStorage.removeItem("progress-photos");
    localStorage.removeItem("progress-activities");
    localStorage.removeItem("main-progress-data");

    toast({
      title: "Progress Data Reset",
      description: "All progress data has been cleared successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader
        onBack={() => navigate("/")}
        onReset={resetProgressData}
      />

      <main className="pb-24">
        <div className="p-4 space-y-6">
          <KeyStats stats={stats} />
          <ProgressCharts data={progressData} />
          <WorkoutHeatmap workoutHistory={workoutHistory} />
          <WorkoutAnalytics
            workoutHistory={workoutHistory}
            personalRecords={personalRecords}
          />
          <ProgressiveOverload
            workoutHistory={workoutHistory}
            personalRecords={personalRecords}
          />

          {/* Achievement Rarity System */}
          <PointsWidget achievements={achievements} />
          <TierProgressCard achievements={achievements} />
          <RarityStatsCard achievements={achievements} />
          <RarityAchievementsGrid
            achievements={achievements}
            onAchievementClick={(achievement) => {
              // Show achievement details in toast
              toast({
                title: `${achievement.icon} ${achievement.title}`,
                description: `${achievement.description}\n\n+${achievement.points} points • ${achievement.rarity} rarity`,
              });
            }}
          />

          <ProgressPhotos photos={progressPhotos} onAddPhoto={handleAddPhoto} />
          <RecentActivity activities={recentActivities} />
        </div>
      </main>

      <QuickAdd
        onLogWeight={() => setLogWeightOpen(true)}
        onAddPhoto={handleAddPhoto}
      />

      <LogWeightDialog
        open={logWeightOpen}
        onOpenChange={setLogWeightOpen}
        onSave={handleLogWeight}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              User Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={tempHeight}
                onChange={(e) => setTempHeight(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used for accurate BMI calculation
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleSaveSettings({
                  height: Number(tempHeight),
                  units: userSettings.units,
                })
              }
              className="flex-1 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Progress;
