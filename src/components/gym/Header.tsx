import React, { useState } from "react";
import {
  Dumbbell,
  Home,
  Calendar,
  Search,
  Menu,
  Download,
  Upload,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/types/gym";
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

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetAllData: () => void;
  onProgressClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  mobileMenuOpen,
  setMobileMenuOpen,
  exportData,
  importData,
  resetAllData,
  onProgressClick,
}) => {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetConfirm = () => {
    resetAllData();
    setShowResetDialog(false);
  };

  const navItems = [
    { key: "dashboard" as ViewType, label: "Dashboard", icon: Home },
    { key: "schedule" as ViewType, label: "Calendar", icon: Calendar },
    { key: "workouts" as ViewType, label: "Workouts", icon: Dumbbell },
    { key: "exercises" as ViewType, label: "Exercises", icon: Search },
  ];

  return (
    <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Simple gym
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setCurrentView(key)}
                variant={currentView === key ? "hero" : "ghost"}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
            <Button
              onClick={onProgressClick}
              variant="outline"
              className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-accent"
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              size="icon"
              title="Export Data"
              className="text-foreground hover:text-foreground hover:bg-accent"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
              className="text-foreground hover:text-foreground hover:bg-accent"
            >
              <label className="cursor-pointer" title="Import Data">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  title="Import workout data"
                />
              </label>
            </Button>
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="outline"
              size="icon"
              title="Reset All Data"
              className="text-foreground hover:text-foreground hover:bg-accent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </nav>

          {/* Mobile Reset Button - Always visible on mobile */}
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="outline"
            size="icon"
            title="Reset All Data"
            className="md:hidden text-foreground hover:text-foreground hover:bg-accent"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          {/* Mobile Menu Button - HIDDEN (using bottom nav instead) */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
            size="icon"
            className="hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/30 pt-4 space-y-2">
            {navItems.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => {
                  setCurrentView(key);
                  setMobileMenuOpen(false);
                }}
                variant={currentView === key ? "hero" : "ghost"}
                className="w-full justify-start"
              >
                {label}
              </Button>
            ))}
            <Button
              onClick={() => {
                onProgressClick?.();
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full justify-start flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              My Progress
            </Button>
            <div className="flex gap-2 pt-2">
              <Button onClick={exportData} variant="outline" className="flex-1">
                Export
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <label className="cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                    title="Import workout data"
                  />
                </label>
              </Button>
              <Button
                onClick={() => setShowResetDialog(true)}
                variant="outline"
                className="flex-1"
              >
                Reset Data
              </Button>
            </div>
          </nav>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Reset All Data?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will <strong>permanently delete</strong> all your:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Workout history and completed sessions</li>
                <li>Progress tracking data and measurements</li>
                <li>Personal records and achievements</li>
                <li>Scheduled workouts</li>
              </ul>
              <p className="text-destructive font-semibold mt-4">
                ⚠️ This action cannot be undone!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
