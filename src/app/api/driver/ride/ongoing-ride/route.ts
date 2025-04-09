import { createResponse } from "@/utils/apiResponseUtils";
import { wkbToLatLng } from "@/utils/geoUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
interface Coordinates {
  lat: number;
  lng: number;
}

interface RiderDetails {
  rider_id: string;
  name: string;
  phone: string;
}

interface DriverDetails {
  driver_id: string;
  name: string;
  phone: string;
  location: string;
  car_name: string;
  car_model: string;
  license_plate: string;
  cab_type: string;
  is_online: boolean;
}

interface RideResponse {
  id: string;
  rider_id: string;
  driver_id: string | null;
  rider_details: RiderDetails;
  driver_details: DriverDetails | null;
  pickup_location: Coordinates;
  pickup_address: string;
  dropoff_location: Coordinates;
  dropoff_address: string;
  current_driver_location: Coordinates | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const driverId = request.nextUrl.searchParams.get("driverId");

    // Validate driverId
    if (!driverId || typeof driverId !== "string") {
      return createResponse(400, null, "Valid driverId is required");
    }

    const { data: rideData, error } = await supabase
      .from("rides_new")
      .select(
        `
        id,
        rider_id,
        driver_id,
        rider_details,
        driver_details,
        pickup_location,
        pickup_address,
        dropoff_location,
        dropoff_address,
        current_driver_location,
        distance_km,
        duration_minutes,
        fare,
        status,
        created_at
      `
      )
      .eq("driver_id", driverId)
      .in("status", [
        "DRIVER_ASSIGNED",
        "REACHED_PICKUP",
        "TRIP_STARTED",
        "TRIP_ENDED",
      ])
      .maybeSingle();

    if (error) {
      console.error("Error fetching ongoing ride:", error);
      return createResponse(404, null, "Ongoing ride not found");
    }

    if (!rideData) {
      return createResponse(200, null, "No ongoing ride found");
    }

    // Transform the data
    const transformLocation = (wkb: string | null): Coordinates | null => {
      if (!wkb) return null;
      const coords = wkbToLatLng(wkb);
      return coords || null;
    };

    const response: RideResponse = {
      id: rideData.id,
      rider_id: rideData.rider_id,
      driver_id: rideData.driver_id,
      rider_details: rideData.rider_details as RiderDetails,
      driver_details: rideData.driver_details as DriverDetails | null,
      pickup_location: transformLocation(rideData.pickup_location)!,
      pickup_address: rideData.pickup_address,
      dropoff_location: transformLocation(rideData.dropoff_location)!,
      dropoff_address: rideData.dropoff_address,
      current_driver_location: transformLocation(
        rideData.current_driver_location
      ),
      distance_km: rideData.distance_km,
      duration_minutes: rideData.duration_minutes,
      fare: rideData.fare,
      status: rideData.status,
      created_at: rideData.created_at,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error("Error in GET ongoing ride:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
