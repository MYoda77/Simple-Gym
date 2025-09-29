// src/hooks/useAuth.tsx
import { useState, useEffect } from "react";
import { auth, type AuthUser } from "@/lib/pocketbase";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoggedIn: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(auth.currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onChange((token, model) => {
      setUser(model);
    });
    return unsubscribe;
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const result = await auth.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const result = await auth.register(email, password, name);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Registration failed" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    auth.logout();
    setUser(null);
  };

  const isLoggedIn = !!user;

  return {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn,
  };
};
