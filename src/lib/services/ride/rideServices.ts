import { wkbToLatLng } from "@/utils/geoUtils";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type UserRole = "rider" | "driver";

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface BaseRideFields {
  id: string;
  request_id: string | null;
  pickup_coordinates: string;
  pickup_address: string;
  dropoff_coordinates: string;
  dropoff_address: string;
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  fare_estimate: number;
  status: "ACCEPTED" | "ARRIVED" | "STARTED" | "COMPLETED" | "CANCELLED";
  cancelled_by: "RIDER" | "DRIVER" | "SYSTEM" | null;
  created_at: string;
  updated_at: string;
  ongoing: boolean;
}

interface RiderRideFields extends BaseRideFields {
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_car_name: string;
  driver_car_model: string;
  driver_license_plate: string;
  driver_cab_type: string;
  driver_location: string;
}

interface DriverRideFields extends BaseRideFields {
  rider_id: string;
  rider_name: string;
  rider_phone: string;
}

interface NormalizedRideBase {
  id: string;
  request_id: string | null;
  pickup_coordinates: Coordinates;
  pickup_address: string;
  dropoff_coordinates: Coordinates;
  dropoff_address: string;
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  fare_estimate: number;
  status: "ACCEPTED" | "ARRIVED" | "STARTED" | "COMPLETED" | "CANCELLED";
  cancelled_by: "RIDER" | "DRIVER" | "SYSTEM" | null;
  created_at: string;
  updated_at: string;
  ongoing: boolean;
}

export interface NormalizedRiderRide extends NormalizedRideBase {
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_car_name: string;
  driver_car_model: string;
  driver_license_plate: string;
  driver_cab_type: string;
  driver_location: Coordinates;
}

export interface NormalizedDriverRide extends NormalizedRideBase {
  rider_id: string;
  rider_name: string;
  rider_phone: string;
}

export type NormalizedRide = NormalizedRiderRide | NormalizedDriverRide;

interface ApiResponse<T> {
  status: number;
  data: {
    ongoing: boolean;
    ride: T;
  };
  error: string | null;
  message: string | null;
}

function normalizeRideData<T extends RiderRideFields | DriverRideFields>(
  response: ApiResponse<T>,
  role: UserRole
): NormalizedRide {
  const { data } = response;
  const ride = data.ride;

  // console.log("data", ride.pickup_coordinates);
  // Convert coordinates
  const pickupCoords = wkbToLatLng(ride.pickup_coordinates);
  const dropoffCoords = wkbToLatLng(ride.dropoff_coordinates);

  if (!pickupCoords || !dropoffCoords) {
    throw new Error("Failed to parse ride coordinates");
  }

  const baseRide: NormalizedRideBase = {
    ...ride,
    pickup_coordinates: {
      longitude: pickupCoords.lng,
      latitude: pickupCoords.lat,
    },
    dropoff_coordinates: {
      longitude: dropoffCoords.lng,
      latitude: dropoffCoords.lat,
    },
    ongoing: data.ongoing,
  };

  if (role === "rider") {
    const driverRide = ride as RiderRideFields;
    const driverLocation = wkbToLatLng(driverRide.driver_location);

    if (!driverLocation) {
      throw new Error("Failed to parse driver location");
    }

    return {
      ...baseRide,
      driver_id: driverRide.driver_id,
      driver_name: driverRide.driver_name,
      driver_phone: driverRide.driver_phone,
      driver_car_name: driverRide.driver_car_name,
      driver_car_model: driverRide.driver_car_model,
      driver_license_plate: driverRide.driver_license_plate,
      driver_cab_type: driverRide.driver_cab_type,
      driver_location: {
        longitude: driverLocation.lng,
        latitude: driverLocation.lat,
      },
    };
  } else {
    const riderRide = ride as DriverRideFields;
    return {
      ...baseRide,
      rider_id: riderRide.rider_id,
      rider_name: riderRide.rider_name,
      rider_phone: riderRide.rider_phone,
    };
  }
}

export async function fetchOngoingRide(
  role: UserRole,
  roleId: string
): Promise<NormalizedRide | null> {
  try {
    const endpointMap: Record<UserRole, string> = {
      rider: "/api/user/ride/ongoing-ride",
      driver: "/api/driver/ongoing-ride",
    };

    const url = new URL(`${BASE_URL}${endpointMap[role]}`);
    const paramName = role === "rider" ? "riderId" : "driverId";
    url.searchParams.append(paramName, roleId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message || `Failed to fetch ongoing ride for ${role}`
      );
    }

    const result: ApiResponse<RiderRideFields | DriverRideFields> =
      await response.json();

    if (!result.data || !result.data.ride) {
      return null;
    }

    return normalizeRideData(result, role);
  } catch (error) {
    console.error("Fetch Ongoing Ride Error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred while fetching ride details");
  }
}

export async function getOngoingRide(
  role: UserRole,
  roleId: string
): Promise<NormalizedRide | null> {
  return fetchOngoingRide(role, roleId);
}
