const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
import { RiderData } from "@/types/userType";

export async function getRiderInfo(riderId: string): Promise<RiderData> {
  try {
    const response = await fetch(`${BASE_URL}/api/rider/details/${riderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["riderInfo"],
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Get Rider Info Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to fetch rider information"
      );
    }

    const riderData: RiderData = {
      rider_id: result.data.rider_id,
      user_id: result.data.user_id,
      name: result.data.name,
      phone: result.data.phone,
      activeRides: result.data.active_rides_count,
    };

    // console.log("Get Rider Info Success:", result.message);
    return riderData;
  } catch (error) {
    const err = error as Error;
    console.error("Get Rider Info Error:", error);
    throw new Error(`Failed to fetch rider information: ${err.message}`);
  }
}
