const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
import { revalidateTagHandler } from "@/lib/validation";
import { RideRequestDetails } from "@/types/rideTypes";

// Driver requests the rider's ride-request details
export async function getRideRequestDetails(requestId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ride/ride-request/${requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["rideRequestDetails"],
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Ride Request Details Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch Ride Request Details"
      );
    }

    console.log("Get Ride Request Details Success:", result.message);
    const rideRequestDetails: RideRequestDetails = result.data;
    return rideRequestDetails;
  } catch (error) {
    const err = error as Error;
    console.error("Get Ride Request Details Error:", error);
    throw new Error(`Failed to fetch Ride Request Details: ${err.message}`);
  }
}

// Driver accepts the ride request
export async function acceptRideRequest(
  requestId: string,
  rideDetails: RideRequestDetails
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ride/ride-request/${requestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rideDetails),
        next: {
          tags: ["acceptRideRequest"],
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Accept Ride Request Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to accept Ride Request"
      );
    }
    await revalidateTagHandler("driverInfo");
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Accept Ride Request Error:", error);
    throw new Error(`Failed to accept Ride Request: ${err.message}`);
  }
}

interface RideStatusData {
  rider_id: string;
  status: string;
}

// Driver updates the ride status from dashboard
export async function updateRideStatus(
  rideId: string,
  statusData: RideStatusData
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ride/ongoing-ride/${rideId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
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
