// Coordinates interface (reusable)
export interface Coordinates {
  longitude: number;
  latitude: number;
}

//  RIDE TYPE ---------------------------------------------------------------------
// Rider's ride data :: -----------------------------------------------------------------
export interface RiderRideData {
  id: string;
  request_id: string | null;
  driver_id: string;
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
  driver_name: string;
  driver_phone: string;
  driver_car_name: string;
  driver_car_model: string;
  driver_license_plate: string;
  driver_cab_type: string;
  driver_location: Coordinates;
}

// Driver's ride data :: -----------------------------------------------------------------
export interface DriverRideData {
  id: string;
  request_id: string | null;
  rider_id: string;
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
  rider_name: string;
  rider_phone: string;
}

//  RIDE REQUEST TYPE ---------------------------------------------------------------------

export interface RideRequestCoordinates {
  lat: number;
  lng: number;
}

export interface RiderProfileData {
  name: string;
  phone: string;
}

export interface RideRequest {
  id: string;
  rider_id: string;
  rider_details: RiderDetails;
  pickup_location: RideRequestCoordinates;
  pickup_address: string;
  dropoff_location: RideRequestCoordinates;
  dropoff_address: string;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  created_at: string;
  current_driver_location: RideRequestCoordinates | null;
}

export interface PastRide {
  id: string;
  request_id: string | null;
  rider_id: string;
  pickup_coordinates: string;
  pickup_address: string;
  dropoff_coordinates: string;
  dropoff_address: string;
  cab_type: string;
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  fare_estimate: number;
  status: string;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  rideRequests: RideRequest[];
  pastRides: PastRide[];
}

//  RIDE REQUEST DETAILS TYPES ---------------------------------------------------------------
export interface RideRequestDetails {
  id: string;
  rider_id: string;
  driver_id?: string | null;
  rider_details: RiderDetails;
  pickup_location: RideRequestCoordinates;
  pickup_address: string;
  dropoff_location: RideRequestCoordinates;
  dropoff_address: string;
  current_driver_location: RideRequestCoordinates | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status:
    | "SEARCHING"
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "COMPLETED"
    | "CANCELLED";
  created_at: string;
}

// REQUESTING RIDE PAYLOAD
export interface RideRequestPayload {
  riderId: string;
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

// RIDE REALTIME CHANGE TYPE --------------------------------

export interface RideNew {
  id: string; // UUID
  rider_id: string; // UUID
  driver_id: string | null; // Nullable UUID
  pickup_location: string; // Geography as WKT (e.g., "POINT(lng lat)") or use PostGIS type if mapped
  pickup_address: string;
  dropoff_location: string;
  dropoff_address: string;
  current_driver_location: string | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status:
    | "SEARCHING"
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "COMPLETED"
    | "CANCELLED";
  created_at: string; // ISO Timestamp
  accepted_at: string | null;
  reached_pickup_at: string | null;
  trip_started_at: string | null;
  completed_at: string | null;
}

// ONGOING RIDE TYPES ----------------------------------------------------------------------------
interface OnGoingRideCoordinates {
  lat: number;
  lng: number;
}

export interface BaseRideResponse {
  id: string;
  rider_id: string;
  driver_id: string;
  pickup_location: OnGoingRideCoordinates;
  pickup_address: string;
  dropoff_location: OnGoingRideCoordinates;
  dropoff_address: string;
  current_driver_location: OnGoingRideCoordinates | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status:
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "TRIP_ENDED"
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
  location: OnGoingRideCoordinates;
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
