"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pb } from "@/lib/pocketbase";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    () => (pb.authStore.record as User | null) ?? null
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser((pb.authStore.record as User | null) ?? null);
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange(() => {
      refresh();
    });

    return unsubscribe;
  }, [refresh]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      logout,
      refresh,
    }),
    [user, isLoading, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
