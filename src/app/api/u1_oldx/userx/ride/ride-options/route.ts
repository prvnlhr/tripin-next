import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

// Type definitions
interface Coordinate {
  lat: number;
  lng: number;
}

interface Driver {
  driver_id: string;
  user_id: string;
  name: string;
  cab_type: string;
  distance_meters?: number;
}

interface FarePricing {
  auto_base: number;
  auto_per_km: number;
  auto_min_fare: number;
  comfort_base: number;
  comfort_per_km: number;
  comfort_min_fare: number;
  elite_base: number;
  elite_per_km: number;
  elite_min_fare: number;
  currency: string;
}
function getFareComponents(farePricing: FarePricing, cabType: string) {
  const lowerType = cabType.toLowerCase() as "auto" | "comfort" | "elite";

  return {
    base: farePricing[`${lowerType}_base`],
    perKm: farePricing[`${lowerType}_per_km`],
    minFare: farePricing[`${lowerType}_min_fare`],
  };
}

interface CabOption {
  fare: number;
  available: boolean;
  drivers: number;
  closestDriver?: {
    id: string;
    distance: string;
    eta: string;
  };
}

// 1. Coordinate Validation
function validateCoordinates(coords: {
  pickup: Coordinate;
  dropoff: Coordinate;
}): { isValid: boolean; error?: Response } {
  const { pickup, dropoff } = coords;
  if (
    isNaN(pickup.lat) ||
    isNaN(pickup.lng) ||
    isNaN(dropoff.lat) ||
    isNaN(dropoff.lng)
  ) {
    return {
      isValid: false,
      error: createResponse(400, null, "Valid coordinates required"),
    };
  }
  return { isValid: true };
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
    // Try Google Maps first
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

  // Fallback to PostGIS calculation
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

// 3. Driver Availability Check
async function getAvailableDrivers(pickup: Coordinate): Promise<Driver[]> {
  const supabase = await createClient();
  const { data: nearbyDrivers, error } = await supabase.rpc(
    "find_nearby_drivers",
    {
      lat: pickup.lat,
      long: pickup.lng,
      max_distance_meters: 5000,
      max_duration_minutes: 15,
    }
  );

  if (error) throw new Error(`Driver query failed: ${error.message}`);

  return nearbyDrivers || [];
}

// 4. Filter Busy Drivers
async function filterBusyDrivers(drivers: Driver[]): Promise<Driver[]> {
  if (drivers.length === 0) return [];

  const supabase = await createClient();

  const { data: activeRides } = await supabase
    .from("rides")
    .select("driver_id")
    .in(
      "driver_id",
      drivers.map((d) => d.driver_id)
    )
    .in("status", ["ACCEPTED", "ARRIVED", "STARTED"]);

  const busyDriverIds = new Set(activeRides?.map((r) => r.driver_id) || []);
  return drivers.filter((d) => !busyDriverIds.has(d.driver_id));
}

// 5. Get Fare Pricing
async function getFarePricing(): Promise<FarePricing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fare_pricing")
    .select("*")
    .single();

  if (error) throw new Error(`Fare pricing query failed: ${error.message}`);
  return data;
}

// 3. Use it in your calculation
function calculateFareOptions(
  availableDrivers: Driver[],
  farePricing: FarePricing,
  distanceKm: number
): Record<string, CabOption> {
  return (["AUTO", "COMFORT", "ELITE"] as const).reduce(
    (acc, cabType) => {
      const drivers = availableDrivers
        .filter((d) => d.cab_type === cabType)
        .sort((a, b) => (a.distance_meters || 0) - (b.distance_meters || 0));

      // Type-safe access to fare components
      const { base, perKm, minFare } = getFareComponents(farePricing, cabType);

      const fare = Math.max(base + distanceKm * perKm, minFare);

      return {
        ...acc,
        [cabType]: {
          fare,
          available: drivers.length > 0,
          drivers: drivers.length,
          closestDriver: drivers[0]
            ? {
                id: drivers[0].driver_id,
                distance: `${((drivers[0].distance_meters || 0) / 1000).toFixed(1)} km`,
                eta: `${Math.ceil((drivers[0].distance_meters || 0) / 200)} mins`,
              }
            : undefined,
        },
      };
    },
    {} as Record<string, CabOption>
  );
}

// !! -- NOT IN USE -----------------------------
// Main API Handler
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);

  try {
    // 1. Parse and validate coordinates
    const coordinates = {
      pickup: {
        lat: parseFloat(searchParams.get("pickupLat") || ""),
        lng: parseFloat(searchParams.get("pickupLng") || ""),
      },
      dropoff: {
        lat: parseFloat(searchParams.get("dropoffLat") || ""),
        lng: parseFloat(searchParams.get("dropoffLng") || ""),
      },
    };

    const { isValid, error } = validateCoordinates(coordinates);
    if (!isValid) return error!;

    // 2. Calculate route distance and duration
    const { distanceKm, durationMinutes, source } =
      await calculateRouteDistance(coordinates);

    // 3. Find available drivers
    const nearbyDrivers = await getAvailableDrivers(coordinates.pickup);
    console.log(" nearbyDrivers:", nearbyDrivers);

    // 4. Filter out busy drivers
    const availableDrivers = await filterBusyDrivers(nearbyDrivers);
    console.log(" availableDrivers:", availableDrivers);

    // 5. Get fare pricing
    const farePricing = await getFarePricing();

    // 6. Calculate fare options
    const cabOptions = calculateFareOptions(
      availableDrivers,
      farePricing,
      distanceKm
    );

    // 7. return response
    return createResponse(200, {
      cabOptions,
      distance: {
        km: distanceKm.toFixed(1),
        miles: (distanceKm * 0.621371).toFixed(1),
        source,
      },
      duration: {
        minutes: durationMinutes.toFixed(0),
        hours: (durationMinutes / 60).toFixed(1),
      },
      currency: farePricing.currency,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Failed to process ride request"
    );
  }
}
