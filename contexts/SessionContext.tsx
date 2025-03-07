import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Tables } from "@/database.types";
import { router } from "expo-router";
import { useSnackbar } from "./SnackBarContext";
import { UsersService } from "../services/users.service";
import { supabase } from "@/lib/supabase";

const SessionContext = createContext<{
  session: Session | null;
  profile: Tables<"Profiles"> | null;
  role: string | null; // Add role to the context
  refetchProfile: () => Promise<void>;
}>({
  session: null,
  profile: null,
  role: null,
  refetchProfile: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"Profiles"> | null>(null);
  const [role, setRole] = useState<string | null>(null); // State for role
  const { showMessage } = useSnackbar();
  const usersService = new UsersService();

  const fetchProfile = async (session: Session | null) => {
    if (session) {
      const { data, error } = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", session.user?.id);
      if (error) {
        console.log("User not present in Profiles table.");
      } else {
        setProfile(data[0]);
      }
    } else {
      setProfile(null);
    }
  };

  const fetchRole = async (userId: string) => {
    try {
      const data = await usersService.GetPrivelages(userId);
      setRole(data?.type || "user");
    } catch (error) {
      // console.error("Failed to fetch user role:", error);
      setRole(null);
    }
  };

  const refetchProfile = async () => {
    if (session) {
      await fetchProfile(session);
      await fetchRole(session.user.id);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
        fetchRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(() => {
        if (event === "SIGNED_OUT") {
          handleSignOut();
        } else if (session) {
          handleSignIn(session);
        }
      }, 0);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    setSession(null);
    setProfile(null);
    setRole(null);
    console.log("Logged out");
    router.replace("/");
  };

  const handleSignIn = (session: Session) => {
    setSession(session);
    fetchProfile(session);
    fetchRole(session.user.id);
  };

  return (
    <SessionContext.Provider value={{ session, profile, role, refetchProfile }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
