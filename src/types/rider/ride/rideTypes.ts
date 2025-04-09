export type RideStatus =
  | "SEARCHING"
  | "DRIVER_ASSIGNED"
  | "REACHED_PICKUP"
  | "TRIP_STARTED"
  | "TRIP_ENDED"
  | "COMPLETED"
  | "CANCELLED";

interface Coordinates {
  lat: number;
  lng: number;
}
interface RiderDetails {
  name: string;
  phone: string;
  rider_id: string;
}
type CabType = "AUTO" | "COMFORT" | "ELITE";

interface DriverDetails {
  name: string;
  phone: string;
  cab_type: CabType;
  car_name: string;
  location: string;
  car_model: string;
  driver_id: string;
  is_online: boolean;
  license_plate: string;
}
export interface RiderPastRide {
  id: string;
  rider_id: string;
  driver_id: string;
  rider_details: RiderDetails;
  driver_details: DriverDetails;
  pickup_location: Coordinates;
  pickup_address: string;
  dropoff_location: Coordinates;
  dropoff_address: string;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status: RideStatus;
  created_at: string;
  completed_at: string;
}
