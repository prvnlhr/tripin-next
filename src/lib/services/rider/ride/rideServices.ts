import { revalidatePathHandler } from "@/lib/validation";
import { RideRequestPayload } from "@/types/rideTypes";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Rider making a ride request to driver for a particular cab type
export async function requestRide(bookingDetails: RideRequestPayload) {
  try {
    const response = await fetch(`${BASE_URL}/api/rider/ride/request-ride`, {
      method: "POST",
      body: JSON.stringify(bookingDetails),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Request Ride Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to request ride"
      );
    }
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Request Ride Error:", error);
    throw new Error(`Failed to request ride: ${err.message}`);
  }
}

// Rider making request for available cab type
export async function getAvailableCabOptions(
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/rider/ride/ride-options?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropoffLat=${dropoffLat}&dropoffLng=${dropoffLng}&radius=3000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Available Cab Options Error:",
        result.error || result.message
      );
      throw new Error(
        result.error ||
          result.message ||
          "Failed to fetch available cab options"
      );
    }
    console.log("Get Available Cab Options Success:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Get Available Cab Options Error:", error);
    throw new Error(`Failed to fetch available cab options: ${err.message}`);
  }
}

// Rider after successfull payment finishes the ride
export async function finishedRide(rideId: string | undefined) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/rider/ride/ongoing-ride/${rideId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || "Failed to finished ride";
      console.error(`Status update failed for ride ${rideId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    const successMessage = result.message || `Ride status updated to ${status}`;
    // await revalidateTagHandler("adminDashboard");
    await revalidatePathHandler("/trip", "layout");
    return successMessage;
  } catch (error) {
    const err = error as Error;
    console.error("Update Ride Status Error:", error);
    throw new Error(`Failed to update ride status: ${err.message}`);
  }
}
