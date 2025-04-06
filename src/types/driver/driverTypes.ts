// DRIVER PROFILE -------------------------------------------------------------------
export interface DriverProfileData {
  name: string;
  phone: string;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type?: string | null;
}

export interface DriverData {
  cab_type?: "AUTO" | "COMFORT" | "ELITE" | null;
  car_model: string;
  car_name: string;
  created_at: string;
  driver_id: string;
  is_online: boolean;
  approval_status: "pending" | "approved" | "rejected";
  license_plate: string;
  location?: string | null;
  name: string;
  phone: string;
  updated_at: string;
  user_id: string;
  activeRides: number;
}

// DRIVER DASHBOARD -------------------------------------------------------------------

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
