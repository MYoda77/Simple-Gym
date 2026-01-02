import React from "react";
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
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/types/gym";
import { useAuth } from "@/lib/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user, signOut } = useAuth();

  const navItems = [
    { key: "dashboard" as ViewType, label: "Dashboard", icon: Home },
    { key: "schedule" as ViewType, label: "Calendar", icon: Calendar },
    { key: "workouts" as ViewType, label: "Workouts", icon: Dumbbell },
    { key: "exercises" as ViewType, label: "Exercises", icon: Search },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="p-2 bg-primary rounded-lg">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">
              Simple gym
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-2 items-center flex-shrink-0">
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
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              size="icon"
              title="Export Data"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" asChild>
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
              onClick={resetAllData}
              variant="outline"
              size="icon"
              title="Reset All Data"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {/* User Menu with Logout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border/30 pt-4 space-y-2">
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
                onClick={resetAllData}
                variant="outline"
                className="flex-1"
              >
                Reset Data
              </Button>
            </div>

            {/* Mobile User Info and Logout */}
            <div className="border-t border-border/30 pt-2 mt-2">
              <div className="flex items-center justify-between p-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user?.user_metadata?.full_name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
