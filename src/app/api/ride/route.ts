import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { driverId: string } }
) {
  try {
    const supabase = await createClient();
    const { driverId } = params;

    // Validate driverId
    if (!driverId || typeof driverId !== "string") {
      return createResponse(400, null, "Valid driverId is required");
    }

    // Fetch ongoing ride for the driver
    const { data: ongoingRide, error } = await supabase
      .from("rides")
      .select(
        `
        id,
        request_id,
        rider_id,
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
        created_at,
        updated_at,
        riders:rider_id (name, phone)
      `
      )
      .eq("driver_id", driverId)
      .in("status", ["ACCEPTED", "ARRIVED", "STARTED"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error("Failed to fetch ongoing ride: " + error.message);
    }

    if (!ongoingRide) {
      return createResponse(200, null, "No ongoing ride found for this driver");
    }

    // Format the response with rider details
    const responseData = {
      ...ongoingRide,
      rider_name: ongoingRide.riders?.name || "Unknown",
      rider_phone: ongoingRide.riders?.phone || null,
    };

    return createResponse(200, responseData);
  } catch (error) {
    console.error("GET Ongoing Ride Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Failed to fetch ongoing ride"
    );
  }
}
