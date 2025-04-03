const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
import { revalidateTagHandler } from "@/lib/validation";
import { DashboardData, RideRequestDetails } from "@/types/rideTypes";
import { DriverData } from "@/types/userType";

export async function getDriverInfo(driverId: string): Promise<DriverData> {
  try {
    const response = await fetch(`${BASE_URL}/api/driver/${driverId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["driverInfo"],
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Get Driver Info Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to fetch driver information"
      );
    }

    // Validate and transform the data to match DriverData
    const driverData: DriverData = {
      driver_id: result.data.driver_id,
      user_id: result.data.user_id,
      name: result.data.name,
      phone: result.data.phone,
      car_name: result.data.car_name,
      car_model: result.data.car_model,
      license_plate: result.data.license_plate,
      cab_type: result.data.cab_type,
      is_online: result.data.is_online,
      approval_status: result.data.approval_status,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at,
      // Optional fields
      location: result.data.location || null,
      // is_first_login is excluded as it's not in DriverData
    };

    console.log("Get Driver Info Success:", result.message);
    return driverData;
  } catch (error) {
    const err = error as Error;
    console.error("Get Driver Info Error:", error);
    throw new Error(`Failed to fetch driver information: ${err.message}`);
  }
}

export async function toggleDriverOnlineStatus(
  driverId: string
): Promise<{ is_online: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/api/driver/${driverId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Toggle Driver Online Status Error:",
        result.error || result.message
      );
      throw new Error(
        result.error ||
          result.message ||
          "Failed to toggle driver online status"
      );
    }

    await revalidateTagHandler("driverInfo");

    console.log("Toggle Driver Online Status Success:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Toggle Driver Online Status Error:", error);
    throw new Error(`Failed to toggle driver online status: ${err.message}`);
  }
}

export async function getDriverDashboardData(
  driverId: string
): Promise<DashboardData> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/dashboard/${driverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["driverDashboardData"],
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Get Driver Info Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to fetch driver information"
      );
    }
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Get Driver Info Error:", error);
    throw new Error(`Failed to fetch driver information: ${err.message}`);
  }
}

export async function getRideRequestDetails(requestId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ride-request/${requestId}`,
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

export async function acceptRideRequest(
  requestId: string,
  rideDetails: RideRequestDetails
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ride-request/${requestId}`,
      {
        method: "POST",
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

    console.log("Accept Ride Request Success:", result.message);
    console.log("Accept Ride Request Success:", result.data);
    return result.data; // Returns the created ride object
  } catch (error) {
    const err = error as Error;
    console.error("Accept Ride Request Error:", error);
    throw new Error(`Failed to accept Ride Request: ${err.message}`);
  }
}

type RideStatus =
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export async function updateRideStatus(rideId: string, status: RideStatus) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/ongoing-ride/${rideId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || "Failed to update ride status";
      console.error(`Status update failed for ride ${rideId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    const successMessage = result.message || `Ride status updated to ${status}`;
    console.log(`Success: ${successMessage}`);
    return successMessage;
  } catch (error) {
    const err = error as Error;
    console.error("Update Ride Status Error:", error);
    throw new Error(`Failed to update ride status: ${err.message}`);
  }
}
