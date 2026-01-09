import React from "react";
import {
  Dumbbell,
  Home,
  Calendar,
  Search,
  Menu,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/types/gym";
import { useAuth } from "@/lib/useAuth";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onProgressClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  mobileMenuOpen,
  setMobileMenuOpen,
  onProgressClick,
  onProfileClick,
}) => {
  const navItems = [
    { key: "dashboard" as ViewType, label: "Dashboard", icon: Home },
    { key: "schedule" as ViewType, label: "Calendar", icon: Calendar },
    { key: "workouts" as ViewType, label: "Workouts", icon: Dumbbell },
    { key: "exercises" as ViewType, label: "Exercises", icon: Search },
  ];

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
              variant="ghost"
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </Button>

            {/* User Profile Button */}
            <Button
              onClick={onProfileClick}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Button>
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
            {navItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => {
                  setCurrentView(key);
                  setMobileMenuOpen(false);
                }}
                variant={currentView === key ? "hero" : "ghost"}
                className="w-full justify-start flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
            <Button
              onClick={() => {
                onProgressClick?.();
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </Button>
            <Button
              onClick={() => {
                onProfileClick?.();
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
