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
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    () => (pb.authStore.record as User | null) ?? null
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      if (!pb.authStore.isValid) {
        setUser(null);
        return;
      }

      const authResponse = await pb.collection("users").authRefresh<User>();

      // PocketBase updates authStore automatically.
      setUser(authResponse.record as User);
    } catch (error) {
      const clientError = error as { response?: { status?: number } };

      if (clientError.response?.status === 404) {
        console.warn(
          "Stored auth record was not found. Clearing auth state.",
          error
        );

        pb.authStore.clear();
        setUser(null);
      } else {
        console.error("Auth refresh failed:", error);

        // Keep whatever PocketBase currently has.
        setUser((pb.authStore.record as User | null) ?? null);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await refresh();

      if (mounted) {
        setIsLoading(false);
      }
    })();

    // Sync React state whenever PocketBase auth changes.
    const unsubscribe = pb.authStore.onChange(() => {
      setUser((pb.authStore.record as User | null) ?? null);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}