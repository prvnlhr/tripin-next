const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface RideOptionsResponse {
  cabOptions: {
    AUTO: {
      fare: number;
      available: boolean;
      drivers: number;
    };
    COMFORT: {
      fare: number;
      available: boolean;
      drivers: number;
    };
    ELITE: {
      fare: number;
      available: boolean;
      drivers: number;
    };
  };
  distanceKm: number;
  currency: string;
  pickupPoint: string;
  dropoffPoint: string;
}

interface RideRequestResponse {
  bookingId: string;
  driverDetails?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
  };
  estimatedArrivalTime: string;
  fare: number;
  currency: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}

interface RideRequestPayload {
  userId: string;
  cabType: "AUTO" | "COMFORT" | "ELITE";
  pickup_coordinates: {
    lat: number;
    lng: number;
  };
  dropoff_coordinates: {
    lat: number;
    lng: number;
  };
  pickup_address: string;
  dropoff_address: string;
}

export async function requestRide(
  bookingDetails: RideRequestPayload
): Promise<RideRequestResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/ride/request-ride`, {
      method: "POST",
      body: JSON.stringify(bookingDetails),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Request Ride Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to request ride"
      );
    }

    console.log("Ride requested successfully:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Request Ride Error:", error);
    throw new Error(`Failed to request ride: ${err.message}`);
  }
}

export async function getAvailableCabOptions(
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number
): Promise<RideOptionsResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user/ride/ride-options?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropoffLat=${dropoffLat}&dropoffLng=${dropoffLng}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Available Cab Options Error:",
        result.error || result.message
      );
      throw new Error(
        result.error ||
          result.message ||
          "Failed to fetch available cab options"
      );
    }

    console.log("Get Available Cab Options Success:", result.message);
    console.log(" result:", result);

    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Get Available Cab Options Error:", error);
    throw new Error(`Failed to fetch available cab options: ${err.message}`);
  }
}
