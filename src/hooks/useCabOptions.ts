"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAvailableCabOptions } from "@/lib/services/rider/ride/rideServices";
import { CabOption } from "@/types/cabType";

export const useCabOptions = () => {
  const searchParams = useSearchParams();
  const [cabOptions, setCabOptions] = useState<CabOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const rideOption = searchParams.get("rideOption");

  const fetchCabOptions = useCallback(async () => {
    if (!src || !dest) {
      setError("Missing pickup or dropoff locations");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [srclat, srclng] = src.split(",").map(Number);
      const [destlat, destlng] = dest.split(",").map(Number);

      const response = await getAvailableCabOptions(
        srclat,
        srclng,
        destlat,
        destlng
      );

      // Transform the API response to include imgSrc and desc
      const transformedOptions = response.options.map(
        (option: {
          cab_type: "AUTO" | "COMFORT" | "ELITE";
          fare: number;
          distance_km: number;
          duration_minutes: number;
          is_available: boolean;
        }) => ({
          ...option,
          imgSrc: getCabImage(option.cab_type),
          description: getCabDescription(option.cab_type),
        })
      );

      setCabOptions(transformedOptions);
    } catch (err) {
      console.error("Failed to fetch cab options:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load ride options"
      );
    } finally {
      setIsLoading(false);
    }
  }, [src, dest]);

  useEffect(() => {
    if (rideOption === "true") {
      fetchCabOptions();
    }
  }, [rideOption, fetchCabOptions]);

  return {
    cabOptions,
    isLoading,
    setIsLoading,
    error,
    fetchCabOptions,
  };
};

// Helper functions
const getCabImage = (cabType: string) => {
  const cabImages: Record<string, string> = {
    AUTO: "/assets/cab/auto.png",
    COMFORT: "/assets/cab/comfort.png",
    ELITE: "/assets/cab/elite.png",
  };
  return cabImages[cabType] || "";
};

const getCabDescription = (cabType: string) => {
  const cabDescriptions: Record<string, string> = {
    AUTO: "Fast and cost-effective for short rides and quick commutes",
    COMFORT: "Reliable and smooth for everyday travel",
    ELITE: "Premium and luxurious for a high-end experience",
  };
  return cabDescriptions[cabType] || "";
};
