// hooks/useUserSession.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Session = {
  userName: string;
  email: string;
  userId: string;
} | null;

const useUserSession = () => {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;
        if (!mounted) return;

        if (user) {
          setSession({
            userName: user.user_metadata?.display_name || "",
            email: user.email || "",
            userId: user.id,
          });
        } else {
          setSession(null);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching session:", error);
        }
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setSession({
          userName: session.user.user_metadata?.display_name || "",
          email: session.user.email || "",
          userId: session.user.id,
        });
      } else {
        setSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return session;
};

export default useUserSession;
