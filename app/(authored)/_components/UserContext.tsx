"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserProfile } from "@/types/UserProfile";

interface UserContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

async function fetchUserInfo(): Promise<UserProfile> {
  const res = await fetch("/api/userinfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export function UserProvider({
  children,
  initialUser,
  initialError,
}: {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
  initialError?: string | null;
}) {
  const hasInitial = initialUser !== undefined || initialError !== undefined;

  const [user, setUser] = useState<UserProfile | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState(!hasInitial);
  const [error, setError] = useState<string | null>(initialError ?? null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserInfo();
      setUser(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitial) {
      refresh();
    }
  }, [hasInitial, refresh]);

  const value = useMemo(
    () => ({ user, isLoading, error, refresh }),
    [user, isLoading, error, refresh],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
