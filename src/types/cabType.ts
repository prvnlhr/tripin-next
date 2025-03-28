import type { StaticImageData } from "next/image";

export type CabType = "Auto" | "Comfort" | "Elite" | string;

export interface CabOption {
  type: CabType;
  description: string;
  fareMultiplier: number;
  imgSrc: StaticImageData;
}
