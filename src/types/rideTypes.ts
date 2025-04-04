// Reusable interface for Rider's ride data
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

// Reusable interface for Driver's ride data
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

// Coordinates interface (reusable)
export interface Coordinates {
  longitude: number;
  latitude: number;
}

// ------------------------------------------------------

export interface RideRequestCoordinates {
  lat: number;
  lng: number;
}

interface RiderDetails {
  rider_id: string;
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

// ------------------------------------------------------------------
