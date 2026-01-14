import { useAuth } from "@/lib/useAuth";
import { AuthDialog } from "./AuthDialog";
import { useState } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth dialog
  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">Simple Gym</h1>
            <p className="text-muted-foreground mb-8">
              Your personal fitness tracking companion
            </p>
            <button
              onClick={() => setShowAuthDialog(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}
