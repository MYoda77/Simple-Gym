import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  LogOut,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    // Get all data from localStorage
    const workoutHistory = localStorage.getItem("workout-history");
    const progressActivities = localStorage.getItem("progress-activities");
    const progressData = localStorage.getItem("main-progress-data");
    const personalRecords = localStorage.getItem("personal-records");
    const workoutTemplates = localStorage.getItem("workout-templates");
    const customExercises = localStorage.getItem("custom-exercises");
    const weeklySchedule = localStorage.getItem("weekly-schedule");
    const achievements = localStorage.getItem("progress-achievements");

    const exportObject = {
      workoutHistory: workoutHistory ? JSON.parse(workoutHistory) : [],
      progressActivities: progressActivities
        ? JSON.parse(progressActivities)
        : [],
      progressData: progressData ? JSON.parse(progressData) : null,
      personalRecords: personalRecords ? JSON.parse(personalRecords) : [],
      workoutTemplates: workoutTemplates ? JSON.parse(workoutTemplates) : [],
      customExercises: customExercises ? JSON.parse(customExercises) : [],
      weeklySchedule: weeklySchedule ? JSON.parse(weeklySchedule) : null,
      achievements: achievements ? JSON.parse(achievements) : [],
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gym-app-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your workout data has been downloaded successfully.",
    });
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Import all data types
      if (data.workoutHistory) {
        localStorage.setItem(
          "workout-history",
          JSON.stringify(data.workoutHistory)
        );
      }
      if (data.progressActivities) {
        localStorage.setItem(
          "progress-activities",
          JSON.stringify(data.progressActivities)
        );
      }
      if (data.progressData) {
        localStorage.setItem(
          "main-progress-data",
          JSON.stringify(data.progressData)
        );
      }
      if (data.personalRecords) {
        localStorage.setItem(
          "personal-records",
          JSON.stringify(data.personalRecords)
        );
      }
      if (data.workoutTemplates) {
        localStorage.setItem(
          "workout-templates",
          JSON.stringify(data.workoutTemplates)
        );
      }
      if (data.customExercises) {
        localStorage.setItem(
          "custom-exercises",
          JSON.stringify(data.customExercises)
        );
      }
      if (data.weeklySchedule) {
        localStorage.setItem(
          "weekly-schedule",
          JSON.stringify(data.weeklySchedule)
        );
      }
      if (data.achievements) {
        localStorage.setItem(
          "progress-achievements",
          JSON.stringify(data.achievements)
        );
      }

      toast({
        title: "Data Imported",
        description: "Your workout data has been restored successfully.",
      });

      // Refresh the page to show imported data
      window.location.reload();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
      });
    }

    // Reset the file input
    event.target.value = "";
  };

  const resetAllData = () => {
    // Clear all localStorage data
    localStorage.removeItem("workout-history");
    localStorage.removeItem("progress-activities");
    localStorage.removeItem("main-progress-data");
    localStorage.removeItem("personal-records");
    localStorage.removeItem("workout-templates");
    localStorage.removeItem("custom-exercises");
    localStorage.removeItem("weekly-schedule");
    localStorage.removeItem("progress-achievements");

    toast({
      title: "Data Reset",
      description: "All workout data has been cleared.",
    });

    setShowResetDialog(false);

    // Refresh the page to show empty state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* User Info Card */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/20 rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Data Management Card */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <p className="text-xs text-muted-foreground px-1">
                  Download all your workouts, progress, and personal records as
                  a JSON file
                </p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <label className="cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                      title="Import workout data"
                    />
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground px-1">
                  Restore your data from a previously exported JSON file
                </p>
              </div>

              <div className="pt-3 border-t border-border/30">
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowResetDialog(true)}
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All Data
                  </Button>
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">
                      This will permanently delete all your workouts, progress
                      data, and personal records. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your workout data, progress tracking, personal records, and
              achievements from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={resetAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
