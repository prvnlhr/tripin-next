import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

interface DriverInfo {
  name: string;
  phone: string;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type: string | null;
  location: string | null; // Keep as WKB string
}

interface RideResponse {
  ongoing: boolean;
  ride: {
    id: string;
    request_id: string | null;
    driver_id: string;
    pickup_coordinates: string; // WKB format
    pickup_address: string;
    dropoff_coordinates: string; // WKB format
    dropoff_address: string;
    cab_type: string;
    estimated_distance_km: number;
    estimated_duration_minutes: number;
    fare_estimate: number;
    status: string;
    cancelled_by: string | null;
    created_at: string;
    updated_at: string;
    ongoing: boolean;
    driver_name: string;
    driver_phone: string;
    driver_car_name: string | null;
    driver_car_model: string | null;
    driver_license_plate: string | null;
    driver_cab_type: string | null;
    driver_location: string | null; // Now in WKB format
    drivers: undefined;
  } | null;
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const riderId = req.nextUrl.searchParams.get("riderId");

    if (!riderId) {
      return createResponse(400, null, "Rider ID is required.");
    }

    const { data: rideWithDriver, error } = await supabase
      .from("rides")
      .select(
        `
        id,
        request_id,
        driver_id,
        pickup_coordinates,
        pickup_address,
        dropoff_coordinates,
        dropoff_address,
        cab_type,
        estimated_distance_km,
        estimated_duration_minutes,
        fare_estimate,
        status,
        cancelled_by,
        created_at,
        updated_at,
        ongoing,
        drivers:driver_id (
          name,
          phone,
          car_name,
          car_model,
          license_plate,
          cab_type,
          location
        )
      `
      )
      .eq("rider_id", riderId)
      .eq("ongoing", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!rideWithDriver) {
      return createResponse<RideResponse>(
        200,
        { ongoing: false, ride: null },
        "No ongoing ride found."
      );
    }

    const drivers = rideWithDriver.drivers;
    const isDriverObject = drivers && !Array.isArray(drivers);
    const driverInfo = isDriverObject ? (drivers as DriverInfo) : null;

    const response: RideResponse = {
      ongoing: true,
      ride: {
        ...rideWithDriver,
        drivers: undefined,
        driver_name: driverInfo?.name || "",
        driver_phone: driverInfo?.phone || "",
        driver_car_name: driverInfo?.car_name || null,
        driver_car_model: driverInfo?.car_model || null,
        driver_license_plate: driverInfo?.license_plate || null,
        driver_cab_type: driverInfo?.cab_type || null,
        driver_location: driverInfo?.location || null, // Pass raw WKB string
      },
    };

    return createResponse<RideResponse>(200, response);
  } catch (error) {
    console.error("Error fetching ongoing ride:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Failed to fetch ongoing ride"
    );
  }
}
