import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const supabase = createClient();

type UserRole = "rider" | "driver" | "admin";

type UserMetadata = {
  role?: UserRole;
  name?: string;
  display_name?: string;
  requires_onboarding?: boolean;
  rider_id?: string;
  driver_id?: string;
  admin_id?: string;
};

type UserSession = {
  userName: string;
  email: string;
  userId: string;
  role: UserRole;
  rider_id?: string;
  driver_id?: string;
  admin_id?: string;
  requires_onboarding: boolean;
} | null;

type RoleSpecificIds = {
  rider_id?: string;
  driver_id?: string;
  admin_id?: string;
};

function getRoleSpecificId(
  metadata: UserMetadata | undefined,
  role: UserRole
): RoleSpecificIds {
  if (!metadata) return {};

  switch (role) {
    case "rider":
      return metadata.rider_id ? { rider_id: metadata.rider_id } : {};
    case "driver":
      return metadata.driver_id ? { driver_id: metadata.driver_id } : {};
    case "admin":
      return metadata.admin_id ? { admin_id: metadata.admin_id } : {};
    default:
      return {};
  }
}
const useUserSession = (): UserSession => {
  const [session, setSession] = useState<UserSession>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data.user) {
          updateSession(data.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    const updateSession = (user: {
      user_metadata: UserMetadata;
      email?: string;
      id: string;
    }) => {
      const { user_metadata, email, id } = user;
      const role = user_metadata?.role || "rider";
      const roleSpecificId = getRoleSpecificId(user_metadata, role);

      setSession({
        userName: user_metadata?.name || user_metadata?.display_name || "",
        email: email || "",
        userId: id,
        role,
        ...roleSpecificId,
        requires_onboarding: user_metadata?.requires_onboarding ?? true,
      });
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          updateSession(session.user);
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
