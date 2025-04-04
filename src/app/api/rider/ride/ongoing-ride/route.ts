import { createResponse } from "@/utils/apiResponseUtils";
import { wkbToLatLng } from "@/utils/geoUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

interface Coordinates {
  lat: number;
  lng: number;
}

interface RawDriverDetails {
  driver_id: string;
  user_id: string;
  name: string;
  phone: string;
  location: string | null;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type: string | null;
  is_online: boolean;
}

interface TransformedDriverDetails {
  driver_id: string;
  user_id: string;
  name: string;
  phone: string;
  location: Coordinates | null;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type: string | null;
  is_online: boolean;
}

interface RideData {
  id: string;
  rider_id: string;
  driver_id: string | null;
  pickup_location: string | null;
  pickup_address: string;
  dropoff_location: string | null;
  dropoff_address: string;
  current_driver_location: string | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status: string;
  created_at: string;
  drivers: RawDriverDetails | null;
}

interface RideResponse {
  id: string;
  rider_id: string;
  driver_id: string | null;
  driver_details: TransformedDriverDetails | null;
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
    const riderId = request.nextUrl.searchParams.get("riderId");
    console.log(" riderId>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.:", riderId);

    if (!riderId || typeof riderId !== "string") {
      return createResponse(400, null, "Valid riderId is required");
    }

    const { data: rideData, error } = (await supabase
      .from("rides_new")
      .select(
        `
        id,
        rider_id,
        driver_id,
        pickup_location,
        pickup_address,
        dropoff_location,
        dropoff_address,
        current_driver_location,
        distance_km,
        duration_minutes,
        fare,
        status,
        created_at,
        drivers:driver_id (
          driver_id,
          user_id,
          name,
          phone,
          location,
          car_name,
          car_model,
          license_plate,
          cab_type,
          is_online
        )
      `
      )
      .eq("rider_id", riderId)
      // .in("status", ["DRIVER_ASSIGNED", "REACHED_PICKUP", "TRIP_STARTED"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single()) as { data: RideData | null; error: unknown };

    if (error || !rideData) {
      console.error("Error fetching ongoing ride:", error);
      return createResponse(404, null, "Ongoing ride not found");
    }

    const transformLocation = (wkb: string | null): Coordinates | null => {
      if (!wkb) return null;
      const coords = wkbToLatLng(wkb);
      return coords || null;
    };

    // Transform driver details including location
    let driverDetails: TransformedDriverDetails | null = null;
    if (rideData.drivers) {
      driverDetails = {
        ...rideData.drivers,
        location: rideData.drivers.location
          ? wkbToLatLng(rideData.drivers.location)
          : null,
      };
    }

    const response: RideResponse = {
      id: rideData.id,
      rider_id: rideData.rider_id,
      driver_id: rideData.driver_id,
      driver_details: driverDetails,
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
