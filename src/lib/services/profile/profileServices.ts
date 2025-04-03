const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

import {
  RiderProfileData,
  DriverProfileData,
  AdminProfileData,
} from "@/types/userType";

type UserRole = "rider" | "driver" | "admin";

type ProfileData = RiderProfileData | DriverProfileData | AdminProfileData;

export async function handleProfileCreateRequest(
  role: UserRole,
  roleId: string,
  profileData: ProfileData
) {
  try {
    const endpointMap: Record<UserRole, string> = {
      rider: `/api/user/profile/${roleId}`,
      driver: `/api/driver/profile/${roleId}`,
      admin: `/api/admin/profile/${roleId}`,
    };

    const url = `${BASE_URL}${endpointMap[role]}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileData,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Create Profile Error:`, result.error || result.message);
      throw new Error(
        result.error ||
          result.message ||
          `Failed to create profile for :-${role}.`
      );
    }

    return result.data;
  } catch (error) {
    console.error("Create Profile Error:", error);
    throw error;
  }
}

export async function createProfile(
  role: UserRole,
  roleId: string,
  profileData: ProfileData
) {
  return handleProfileCreateRequest(role, roleId, profileData);
}
