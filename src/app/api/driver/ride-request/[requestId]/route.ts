import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { RideRequestDetails } from "@/types/rideTypes";

type Params = Promise<{ requestId: string }>;

// Get the details of the Ride Request
export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { requestId } = await segmentData.params;

    // Validate requestId
    if (!requestId || typeof requestId !== "string") {
      return createResponse(400, null, "Valid requestId is required");
    }

    // Fetch ride request details with rider name from 'ride_requests' and 'riders' tables
    const { data: rideRequest, error: rideRequestError } = await supabase
      .from("ride_requests")
      .select(
        `
        id,
        rider_id,
        pickup_coordinates,
        pickup_address,
        dropoff_coordinates,
        dropoff_address,
        distance_km,
        duration_minutes,
        cab_type,
        created_at,
        expires_at,
        riders (name)
      `
      )
      .eq("id", requestId)
      .single();

    if (rideRequestError || !rideRequest) {
      return createResponse(
        404,
        null,
        `Ride request not found for requestId: ${requestId}`
      );
    }

    const rider_name =
      rideRequest.riders && !Array.isArray(rideRequest.riders)
        ? (rideRequest.riders as { name: string }).name
        : "Unknown";

    // Construct the response with rider_name
    const responseData: RideRequestDetails = {
      id: rideRequest.id,
      rider_id: rideRequest.rider_id,
      pickup_coordinates: rideRequest.pickup_coordinates,
      pickup_address: rideRequest.pickup_address,
      dropoff_coordinates: rideRequest.dropoff_coordinates,
      dropoff_address: rideRequest.dropoff_address,
      distance_km: rideRequest.distance_km,
      duration_minutes: rideRequest.duration_minutes,
      cab_type: rideRequest.cab_type,
      created_at: rideRequest.created_at,
      expires_at: rideRequest.expires_at,
      rider_name,
    };

    // Return the ride request details with rider_name
    return createResponse<RideRequestDetails>(200, responseData);
  } catch (error) {
    console.error("Ride Request API Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Failed to fetch ride request details"
    );
  }
}

interface Coordinate {
  lat: number;
  lng: number;
}

async function calculateRouteDistance(points: {
  pickup: Coordinate;
  dropoff: Coordinate;
}): Promise<{
  distanceKm: number;
  durationMinutes: number;
  source: "google" | "postgis";
}> {
  const { pickup, dropoff } = points;
  const supabase = await createClient();

  try {
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${pickup.lat},${pickup.lng}&` +
        `destinations=${dropoff.lat},${dropoff.lng}&` +
        `key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const googleData = await googleResponse.json();

    if (
      googleData.status === "OK" &&
      googleData.rows[0]?.elements[0]?.distance
    ) {
      return {
        distanceKm: googleData.rows[0].elements[0].distance.value / 1000,
        durationMinutes: googleData.rows[0].elements[0].duration.value / 60,
        source: "google",
      };
    }
  } catch (error) {
    console.warn("Google Maps API failed, falling back to PostGIS:", error);
  }

  const { data: straightLineDistance } = await supabase.rpc(
    "calculate_distance_meters",
    {
      point1: `POINT(${pickup.lng} ${pickup.lat})`,
      point2: `POINT(${dropoff.lng} ${dropoff.lat})`,
    }
  );

  const distanceKm = (straightLineDistance || 0) / 1000;
  return {
    distanceKm: distanceKm * 1.3, // Add 30% buffer for urban routes
    durationMinutes: distanceKm * 2, // Estimate 2 mins per km
    source: "postgis",
  };
}

async function calculateFare(
  cabType: string,
  distanceKm: number
): Promise<number> {
  const supabase = await createClient();

  // Get fare pricing from database
  const { data: farePricing, error } = await supabase
    .from("fare_pricing")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !farePricing) {
    throw new Error(
      "Failed to fetch fare pricing: " + (error?.message || "No pricing data")
    );
  }

  let fare: number;

  switch (cabType) {
    case "AUTO":
      fare = farePricing.auto_base + distanceKm * farePricing.auto_per_km;
      fare = Math.max(fare, farePricing.auto_min_fare);
      break;
    case "COMFORT":
      fare = farePricing.comfort_base + distanceKm * farePricing.comfort_per_km;
      fare = Math.max(fare, farePricing.comfort_min_fare);
      break;
    case "ELITE":
      fare = farePricing.elite_base + distanceKm * farePricing.elite_per_km;
      fare = Math.max(fare, farePricing.elite_min_fare);
      break;
    default:
      throw new Error("Invalid cab type: " + cabType);
  }

  return parseFloat(fare.toFixed(2)); // Round to 2 decimal places
}

export async function POST(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { requestId } = await segmentData.params;
    const rideDetails = await request.json();

    if (!requestId) {
      return createResponse(
        400,
        null,
        "Request ID is required",
        "Missing required parameters"
      );
    }

    if (!rideDetails) {
      return createResponse(
        400,
        null,
        "Ride details are required",
        "Missing required parameters"
      );
    }

    // 1. First check if a ride already exists for this request_id
    const { data: existingRide, error: checkError } = await supabase
      .from("rides")
      .select("id")
      .eq("request_id", requestId)
      .maybeSingle();

    if (checkError) {
      throw new Error(
        "Failed to check for existing ride: " + checkError.message
      );
    }

    if (existingRide) {
      return createResponse(
        409,
        null,
        "A ride already exists for this request",
        "Conflict"
      );
    }

    // 2. Calculate accurate distance and duration
    const pickupCoords = rideDetails.pickup_coordinates.match(/[0-9.]+/g);
    const dropoffCoords = rideDetails.dropoff_coordinates.match(/[0-9.]+/g);

    if (
      !pickupCoords ||
      !dropoffCoords ||
      pickupCoords.length < 2 ||
      dropoffCoords.length < 2
    ) {
      throw new Error("Invalid coordinate format");
    }

    const { distanceKm, durationMinutes } = await calculateRouteDistance({
      pickup: {
        lat: parseFloat(pickupCoords[1]),
        lng: parseFloat(pickupCoords[0]),
      },
      dropoff: {
        lat: parseFloat(dropoffCoords[1]),
        lng: parseFloat(dropoffCoords[0]),
      },
    });

    // 3. Calculate fare based on cab type and distance
    const fareEstimate = await calculateFare(rideDetails.cab_type, distanceKm);

    // 4. Delete all ride_requests for this rider_id
    const { error: deleteError } = await supabase
      .from("ride_requests")
      .delete()
      .eq("rider_id", rideDetails.rider_id);

    if (deleteError) {
      throw new Error("Failed to delete ride requests: " + deleteError.message);
    }

    // 5. Create the new ride with accurate calculations
    const { data: newRide, error: insertError } = await supabase
      .from("rides")
      .insert({
        request_id: requestId,
        rider_id: rideDetails.rider_id,
        driver_id: rideDetails.driver_id,
        pickup_coordinates: rideDetails.pickup_coordinates,
        pickup_address: rideDetails.pickup_address,
        dropoff_coordinates: rideDetails.dropoff_coordinates,
        dropoff_address: rideDetails.dropoff_address,
        cab_type: rideDetails.cab_type,
        estimated_distance_km: distanceKm,
        estimated_duration_minutes: Math.ceil(durationMinutes),
        fare_estimate: fareEstimate,
        status: "ACCEPTED",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to create ride: " + insertError.message);
    }

    return createResponse(
      201,
      {
        ...newRide,
        calculated_distance_km: distanceKm,
        calculated_duration_minutes: durationMinutes,
        fare_estimate: fareEstimate,
      },
      null,
      "Ride successfully created with accurate pricing and all related requests cleaned up"
    );
  } catch (error) {
    console.error("POST Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in processing ride acceptance"
    );
  }
}
