// ongoing ride response data
interface Coordinates {
  lat: number;
  lng: number;
}

export interface BaseRideResponse {
  id: string;
  rider_id: string;
  driver_id: string;
  pickup_location: Coordinates;
  pickup_address: string;
  dropoff_location: Coordinates;
  dropoff_address: string;
  current_driver_location: Coordinates | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status:
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "COMPLETED"
    | "CANCELLED";
  created_at: string;
}

// --- ROLE-SPECIFIC TYPES ---
export interface RiderDetails {
  rider_id: string;
  name: string;
  phone: string;
}

export interface DriverDetails {
  name: string;
  phone: string;
  user_id: string;
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  car_name: string;
  location: Coordinates;
  car_model: string;
  driver_id: string;
  is_online: boolean;
  license_plate: string;
}

// --- RESPONSE TYPES ---
export interface RiderRideResponse extends BaseRideResponse {
  driver_details: DriverDetails;
}

export interface DriverRideResponse extends BaseRideResponse {
  rider_details: RiderDetails;
}
