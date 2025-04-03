import type { StaticImageData } from "next/image";

export type CabType = "Auto" | "Comfort" | "Elite" | string;

export interface CabOption {
  type: "AUTO" | "COMFORT" | "ELITE";
  fare: number;
  currency: string;
  description: string;
  imgSrc: StaticImageData;
  available: boolean;
}
