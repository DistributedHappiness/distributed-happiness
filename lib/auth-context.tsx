"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { UserProfile } from "./types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local demo auth or supabase auth
    if (!isSupabaseConfigured()) {
      try {
        const localUser = localStorage.getItem("dh_user_profile");
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } catch (e) {
        console.error("Local auth check error", e);
      }
      setIsLoading(false);
      return;
    }

    // Check active Supabase session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
              role: "customer",
            });
          }
        }
      } catch (err) {
        console.error("Supabase auth session error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser(
          (profile as UserProfile) || {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name,
            role: "customer",
          }
        );
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (!isSupabaseConfigured()) {
      // Demo authentication
      const demoUser: UserProfile = {
        id: "demo-user-1",
        email,
        full_name: email.split("@")[0],
        role: "customer",
      };
      setUser(demoUser);
      localStorage.setItem("dh_user_profile", JSON.stringify(demoUser));
      return {};
    }

    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return { error: error.message };
    }
    return {};
  };

  const signUp = async (email: string, password?: string, fullName?: string) => {
    if (!isSupabaseConfigured()) {
      const demoUser: UserProfile = {
        id: "demo-user-1",
        email,
        full_name: fullName || email.split("@")[0],
        role: "customer",
      };
      setUser(demoUser);
      localStorage.setItem("dh_user_profile", JSON.stringify(demoUser));
      return {};
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: password || "Password123!",
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("dh_user_profile");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
