"use client";
import React, { useEffect, useState, useCallback } from "react";
import CabCard from "./CabCard";
import { useSearchParams } from "next/navigation";
import {
  getAvailableCabOptions,
  requestRide,
} from "@/lib/services/user/ride/rideServices";
import autoImg from "../../../../../../public/assets/cab/auto.png";
import comfortImg from "../../../../../../public/assets/cab/comfort.png";
import eliteImg from "../../../../../../public/assets/cab/elite.png";
import { CabOption } from "@/types/cabType";
import useUserSession from "@/hooks/useUserSession";
import CabCardSkeleton from "./CabCardSkeleton";

const CabList = () => {
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const srcAddress = searchParams.get("srcAddress");
  const destAddress = searchParams.get("destAddress");

  const session = useUserSession();

  const [loading, setLoading] = useState(true);
  const [cabOptions, setCabOptions] = useState<CabOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCabOption, setSelectedCabOption] = useState<CabOption | null>(
    null
  );

  const fetchCabOptions = useCallback(async () => {
    if (!src || !dest) {
      setError("Missing pickup or dropoff locations");
      setLoading(false);
      return;
    }

    try {
      const [srclat, srclng] = src.split(",").map(Number);
      const [destlat, destlng] = dest.split(",").map(Number);

      const response = await getAvailableCabOptions(
        srclat,
        srclng,
        destlat,
        destlng
      );

      // Map the API response to include imgSrc and desc
      const transformedOptions: CabOption[] = response.options.map(
        (option: {
          cab_type: "AUTO" | "COMFORT" | "ELITE";
          fare: number;
          distance_km: number;
          duration_minutes: number;
          is_available: boolean;
        }) => {
          const cabDetails = {
            AUTO: {
              imgSrc: autoImg.src,
              desc: "Fast and cost-effective for short rides and quick commutes",
            },
            COMFORT: {
              imgSrc: comfortImg.src,
              desc: "Reliable and smooth for everyday travel",
            },
            ELITE: {
              imgSrc: eliteImg.src,
              desc: "Premium and luxurious for a high-end experience",
            },
          };

          return {
            cab_type: option.cab_type,
            fare: option.fare,
            distance_km: option.distance_km,
            duration_minutes: option.duration_minutes,
            is_available: option.is_available,
            imgSrc: cabDetails[option.cab_type].imgSrc,
            description: cabDetails[option.cab_type].desc,
          };
        }
      );

      setCabOptions(transformedOptions);

      // Auto-select the first available option if none is selected
      if (!selectedCabOption) {
        const firstAvailable = transformedOptions.find(
          (option) => option.is_available
        );
        if (firstAvailable) {
          setSelectedCabOption(firstAvailable);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cab options:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load ride options"
      );
    } finally {
      setLoading(false);
    }
  }, [src, dest, selectedCabOption]);

  useEffect(() => {
    fetchCabOptions();
  }, [fetchCabOptions]);

  const handleCabSelect = (cab: CabOption) => {
    if (cab.is_available) {
      setSelectedCabOption(cab);
    }
  };

  const handleConfirmCabSelection = async () => {
    if (
      selectedCabOption &&
      src &&
      dest &&
      srcAddress &&
      destAddress &&
      session?.rider_id
    ) {
      const [pickupLat, pickupLng] = src.split(",").map(Number);
      const [dropoffLat, dropoffLng] = dest.split(",").map(Number);

      const decodeAddress = (encodedAddress: string) => {
        try {
          return decodeURIComponent(
            encodedAddress.replace(/%20/g, " ").replace(/%2C/g, ",")
          );
        } catch (error) {
          console.error("Error decoding address:", error);
          return encodedAddress;
        }
      };

      const bookingDetails = {
        riderId: session.rider_id,
        cabType: selectedCabOption.cab_type,
        pickup_coordinates: {
          lat: pickupLat,
          lng: pickupLng,
        },
        dropoff_coordinates: {
          lat: dropoffLat,
          lng: dropoffLng,
        },
        pickup_address: decodeAddress(srcAddress),
        dropoff_address: decodeAddress(destAddress),
      };

      try {
        const res = await requestRide(bookingDetails);
        console.log(" res:", res);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Missing required booking information");
      // You might want to show an error to the user here
    }
  };
  if (loading) {
    return (
      <div className="w-full h-[calc(100%-70px)] space-y-4 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <CabCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-400 text-lg mb-2">Error</div>
        <div className="text-gray-300 text-sm">{error}</div>
        <button
          onClick={fetchCabOptions}
          className="mt-4 px-4 py-2 bg-[#B5E4FC] text-black rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-[100%] md:w-[90%] h-[95%] flex flex-col">
      <div className="w-full h-[80px] flex flex-col justify-center items-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Choose a
          <br />
          ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>

      <div className="w-full h-[calc(100%-80px)] flex flex-col justify-between">
        <div className="w-full h-[calc(100%-70px)] space-y-4 overflow-y-auto">
          {cabOptions.map((cab) => (
            <CabCard
              key={cab.cab_type}
              cab={cab}
              isSelected={selectedCabOption?.cab_type === cab.cab_type}
              onSelect={handleCabSelect}
            />
          ))}
        </div>

        <div className="w-full h-[60px] flex items-center justify-center mt-4">
          <button
            disabled={!selectedCabOption}
            onClick={handleConfirmCabSelection}
            className={`
              w-full h-[80%] 
              ${
                selectedCabOption
                  ? "bg-[#B5E4FC] hover:bg-[#9fd4f0] cursor-pointer"
                  : "bg-[#46494a75] cursor-not-allowed"
              } 
              border border-[#3C3C3C]
              font-medium text-[0.9rem] 
              ${selectedCabOption ? "text-black" : "text-gray-400"} 
              rounded-lg
              transition-colors duration-200
            `}
          >
            {selectedCabOption
              ? `Confirm ${selectedCabOption.cab_type} ( INR. ${selectedCabOption.fare.toFixed(2)})`
              : "Select ride option"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabList;
