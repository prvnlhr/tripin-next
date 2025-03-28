import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Session = {
  userName: string;
  email: string;
  userId: string;
} | null;

const useUserSession = (): Session => {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data.user) {
          const { user_metadata, email, id } = data.user;
          setSession({
            userName: user_metadata?.display_name || "",
            email: email || "",
            userId: id,
          });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const { user_metadata, email, id } = session.user;
          setSession({
            userName: user_metadata?.display_name || "",
            email: email || "",
            userId: id,
          });
        } else {
          setSession(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return session;
};

export default useUserSession;
