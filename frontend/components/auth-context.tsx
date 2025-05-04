"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache time in milliseconds
const CACHE_TIME = 10000; // 10 seconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const lastCheck = useRef<number>(0);
  const previousRequest = useRef<Promise<any> | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Helper to make deduped fetch requests
  const dedupedFetch = useCallback(
    async (url: string, options?: RequestInit) => {
      if (previousRequest.current) {
        return previousRequest.current;
      }

      try {
        previousRequest.current = fetch(url, options).then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Request failed");
          return data;
        });
        return await previousRequest.current;
      } finally {
        previousRequest.current = null;
      }
    },
    []
  );

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const now = Date.now();
    if (now - lastCheck.current < CACHE_TIME) {
      return !!user;
    }

    try {
      const data = await dedupedFetch("/api/auth/session");
      lastCheck.current = now;

      if (data.authenticated && data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      return false;
    }
  }, [user, dedupedFetch]);

  // Initial auth check
  useEffect(() => {
    let mounted = true;

    const initialCheck = async () => {
      try {
        await checkAuth();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialCheck();

    return () => {
      mounted = false;
    };
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        lastCheck.current = 0; // Reset cache
        await checkAuth();
        router.push("/dashboard");
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } catch (error: any) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [checkAuth, router, toast]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        // Login after successful registration
        await login(email, password);
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
      } catch (error: any) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, toast]
  );

  const logout = useCallback(
    async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
        setUser(null);
        lastCheck.current = 0; // Reset cache
        router.push("/auth");
        toast({
          title: "Logout successful",
          description: "You have been logged out",
        });
      } catch (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [router, toast]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      checkAuth,
    }),
    [user, loading, login, register, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
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
