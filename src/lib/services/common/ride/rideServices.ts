// Base URL (replace with your actual base URL)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// import { RiderRideResponse, DriverRideResponse } from "@/types/ongoingRideType";

type UserRole = "rider" | "driver";

// --- FETCH FUNCTION ---
//  Getting ongoing ride details for Rider and Driver both
export async function fetchOngoingRide(role: UserRole, roleId: string) {
  try {
    const endpointMap: Record<UserRole, string> = {
      rider: "/api/rider/ride/ongoing-ride",
      driver: "/api/driver/ride/ongoing-ride",
    };

    const url = new URL(`${BASE_URL}${endpointMap[role]}`);
    const paramName = role === "rider" ? "riderId" : "driverId";
    url.searchParams.append(paramName, roleId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message || `Failed to fetch ongoing ride for ${role}`
      );
    }

    const result = await response.json();
    return result?.data;
  } catch (error) {
    console.error("Fetch Ongoing Ride Error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred while fetching ride details");
  }
}

// --- GET FUNCTION ---
export async function getOngoingRide(role: UserRole, roleId: string) {
  return fetchOngoingRide(role, roleId);
}
