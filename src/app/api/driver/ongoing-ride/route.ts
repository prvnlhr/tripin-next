import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the driverId from query parameters
    const searchParams = req.nextUrl.searchParams;
    const driverId = searchParams.get("driverId");

    if (!driverId) {
      return createResponse(400, null, "Driver ID is required.");
    }

    // Get the ongoing ride with rider information
    const { data: rideWithRider, error } = await supabase
      .from("rides")
      .select(
        `
        id,
        request_id,
        rider_id,
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
        riders:rider_id (
          name,
          phone
        )
      `
      )
      .eq("driver_id", driverId)
      .eq("ongoing", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!rideWithRider) {
      return createResponse(
        200,
        {
          ongoing: false,
          ride: null,
        },
        "No ongoing ride found."
      );
    }

    // Handle the rider info similar to your example
    const rider_name =
      rideWithRider.riders && !Array.isArray(rideWithRider.riders)
        ? (rideWithRider.riders as { name: string }).name
        : "";

    const rider_phone =
      rideWithRider.riders && !Array.isArray(rideWithRider.riders)
        ? (rideWithRider.riders as { phone: string }).phone
        : "";

    // Construct the response
    const response = {
      ongoing: true,
      ride: {
        ...rideWithRider,
        // Remove the riders object from the response
        riders: undefined,
        // Add the rider info
        rider_name,
        rider_phone,
      },
    };

    return createResponse(200, response);
  } catch (error) {
    console.error("Error fetching ongoing ride:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Failed to fetch ongoing ride"
    );
  }
}
