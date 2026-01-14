// src/components/auth/AuthWrapper.tsx
import React, { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { AuthDialog } from "./AuthDialog";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [skipAuth, setSkipAuth] = useState(false);

  // Allow bypassing auth for development/testing
  if (!user && !skipAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full px-6 py-8 bg-card rounded-lg border shadow-lg text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Simple Gym</h1>
          <p className="text-muted-foreground mb-6">
            Track your workouts, monitor progress, and achieve your fitness
            goals.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setShowAuth(true)}
              size="lg"
              className="w-full"
            >
              Login / Register
            </Button>
            <Button
              onClick={() => setSkipAuth(true)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Continue without Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            You can use the app without an account, but data won't be synced
            across devices.
          </p>
        </div>

        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Add user menu to your existing header - Hidden on mobile (available in Profile page) */}
      {user && (
        <div className="hidden md:flex absolute top-4 right-4 z-50 items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm border rounded-lg px-3 py-2">
            <User className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            title="Logout"
            className="bg-card/80 backdrop-blur-sm border"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};
