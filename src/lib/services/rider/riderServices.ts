import { RiderData } from "@/types/rider/riderTypes";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://tripin-next.vercel.app";

// Getting Rider's info
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

// -- NOT IN USE --
export async function completeRide(rideId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ongoing-ride/${rideId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || "Failed to update ride status";
      console.error(`Status update failed for ride ${rideId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    const successMessage = result.message || `Ride status updated to ${status}`;
    // await revalidateTagHandler("adminDashboard");
    return successMessage;
  } catch (error) {
    const err = error as Error;
    console.error("Update Ride Status Error:", error);
    throw new Error(`Failed to update ride status: ${err.message}`);
  }
}

export async function getPastRides(riderId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/rider/ride/past-rides/${riderId}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Rider Past rides Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch rider past rides"
      );
    }
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Get Rider Past rides Error:", error);
    throw new Error(`Failed to fetch rider information: ${err.message}`);
  }
}
