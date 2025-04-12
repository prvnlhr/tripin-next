const BASE_URL: string =
  process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
import { revalidateTagHandler } from "@/lib/validation";
import { DashboardData, DriverData } from "@/types/driver/driverTypes";

// Getting Driver's info
export async function getDriverInfo(driverId: string): Promise<DriverData> {
  try {
    const response = await fetch(`${BASE_URL}/api/driver/details/${driverId}`, {
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
      location: result.data.location || null,
      activeRides: result.data.active_rides_count,
    };

    console.log("Get Driver Info Success:", result.message);
    return driverData;
  } catch (error) {
    const err = error as Error;
    console.error("Get Driver Info Error:", error);
    throw new Error(`Failed to fetch driver information: ${err.message}`);
  }
}

// Driver changes his online status
export async function toggleDriverOnlineStatus(
  driverId: string
): Promise<{ is_online: boolean }> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/driver/dashboard/${driverId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

// Getting Drivers Dashboard Content Data
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
