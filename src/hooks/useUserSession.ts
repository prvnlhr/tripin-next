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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        setLoading(true);

        // First try to get the session from the current client
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession?.user) {
          if (!mounted) return;
          setSession({
            userName:
              currentSession.user.user_metadata?.name ||
              currentSession.user.user_metadata?.display_name ||
              "",
            email: currentSession.user.email || "",
            userId: currentSession.user.id,
          });
          return;
        }

        // Fallback to getUser() if no session found
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (user) {
          setSession({
            userName:
              user.user_metadata?.name ||
              user.user_metadata?.display_name ||
              "",
            email: user.email || "",
            userId: user.id,
          });
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(
        session?.user
          ? {
              userName:
                session.user.user_metadata?.name ||
                session.user.user_metadata?.display_name ||
                "",
              email: session.user.email || "",
              userId: session.user.id,
            }
          : null
      );
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { session, loading };
};

export default useUserSession;
