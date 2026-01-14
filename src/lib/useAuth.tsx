import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "./supabase-api";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authAPI
      .getCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Listen for auth changes
    const {
      data: { subscription },
    } = authAPI.onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { user: newUser } = await authAPI.signUp(email, password, fullName);
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    const { user: newUser } = await authAPI.signIn(email, password);
    setUser(newUser);
  };

  const signOut = async () => {
    await authAPI.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authAPI.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
