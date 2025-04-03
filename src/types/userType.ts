export interface RiderProfileData {
  name: string;
  phone: string;
}

export interface DriverProfileData {
  name: string;
  phone: string;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type: string | null;
}

export interface AdminProfileData {
  name: string;
  phone: string;
  adminId?: string;
  department?: string;
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
}
