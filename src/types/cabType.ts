import type { StaticImageData } from "next/image";

export type CabType = "Auto" | "Comfort" | "Elite" | string;

export interface CabOption {
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  fare: number;
  distance_km: number;
  duration_minutes: number;
  is_available: boolean;
  imgSrc: StaticImageData;
  description: string;
}
