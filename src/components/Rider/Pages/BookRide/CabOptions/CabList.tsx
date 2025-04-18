"use client";
import React, { useState, useEffect, useRef } from "react";
import CabCard from "./CabCard";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { RiderData } from "@/types/rider/riderTypes";
import { requestRide } from "@/lib/services/rider/ride/rideServices";
import CabListSkeleton from "./CabListSkeleton";
import CabCardSkeleton from "./CabCardSkeleton";
import { useCabOptions } from "@/hooks/useCabOptions";
import { Oval } from "react-loader-spinner";
import useUserSession from "@/hooks/useUserSession";
import { CabOption } from "@/types/cabType";

interface CabListProps {
  riderInfo: RiderData;
}

const CabList: React.FC<CabListProps> = ({ riderInfo }) => {
  const logRider = false;
  if (logRider) {
    console.log(" riderInfo:", riderInfo);
  }
  const { cabOptions, isLoading, error } = useCabOptions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useUserSession();
  const { showToast } = useToast();
  const supabase = createClient();
  const riderId = session?.rider_id;
  const [selectedCabOption, setSelectedCabOption] = useState<CabOption | null>(
    null
  );
  const toastIdRef = useRef<string | number>("");

  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const srcAddress = searchParams.get("srcAddress");
  const destAddress = searchParams.get("destAddress");

  // Auto-select the first available option when options load
  useEffect(() => {
    if (cabOptions.length > 0 && !selectedCabOption) {
      const firstAvailable = cabOptions.find((option) => option.is_available);
      if (firstAvailable) {
        setSelectedCabOption(firstAvailable);
      }
    }
  }, [cabOptions, selectedCabOption]);

  const handleCabSelect = (cab: CabOption) => {
    if (cab.is_available) {
      setSelectedCabOption(cab);
    }
  };

  const handleAlreadyOngoingRide = ({ msg }: { msg: string }) => {
    showToast({
      type: "error",
      title: "Ride Request Failed",
      description: `${msg}`,
      toastId: toastIdRef.current,
      persistent: true,
      duration: Infinity,
      style: {
        ["--toast-icon-color" as string]: "#B42318",
        borderColor: "#B42318",
        color: "#B42318",
        background: "#FEE4E2",
      },
    });
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

      const newToastId = showToast({
        type: "loading",
        title: "Ride Request Sent",
        description: `Waiting for drivers to accept your request...`,
        persistent: true,
        duration: Infinity,
        style: {
          ["--toast-icon-color" as string]: "#1570EF",
          borderColor: "#101323",
          color: "#101323",
          background: "#B9E6FE",
        },
      });
      toastIdRef.current = newToastId;

      try {
        await requestRide(bookingDetails, handleAlreadyOngoingRide);
      } catch (error) {
        console.log(error);
        showToast({
          type: "error",
          title: "Ride Request Failed",
          description: `${error}`,
          toastId: toastIdRef.current,
          persistent: true,
          duration: Infinity,
          style: {
            ["--toast-icon-color" as string]: "#B42318",
            borderColor: "#B42318",
            color: "#B42318",
            background: "#FEE4E2",
          },
        });
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(`driver_requests_accept_${riderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides_new",
          filter: `rider_id=eq.${riderId}`,
        },
        (payload) => {
          if (payload.new.status === "DRIVER_ASSIGNED") {
            const driverName = payload.new.driver_details.name;
            showToast({
              type: "success",
              title: "Ride Request Accepted",
              description: `${driverName} arriving to you`,
              toastId: toastIdRef.current,
              duration: 3000,
              showCloseButton: true,
            });
          }
          router.push("ride/ongoing-ride");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [riderId, supabase, router, showToast]);

  if (isLoading) {
    return <CabListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-400 text-lg mb-2">Error</div>
        <div className="text-gray-300 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
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
        <div className="w-full h-[calc(100%-70px)] space-y-4 flex flex-col justify-end overflow-y-auto">
          {cabOptions.length > 0 ? (
            cabOptions.map((cab) => (
              <CabCard
                key={cab.cab_type}
                cab={cab}
                isSelected={selectedCabOption?.cab_type === cab.cab_type}
                onSelect={handleCabSelect}
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-[0.8rem] text-[#B5E4FC] font-light">
                No cab options are currently available.
              </p>
              <p className="text-[0.8rem] text-[#B5E4FC] font-light mb-[20px]">
                Please try again later.
              </p>
              <CabCardSkeleton animate={false} />
            </div>
          )}
        </div>

        <div className="w-full h-[60px] flex items-center justify-center mt-4">
          <button
            disabled={!selectedCabOption || isLoading}
            onClick={handleConfirmCabSelection}
            className={`
              w-full h-[80%] 
              ${
                selectedCabOption && !isLoading
                  ? "bg-[#B5E4FC] hover:bg-[#9fd4f0] cursor-pointer"
                  : "bg-[#46494a75] cursor-not-allowed"
              } 
              border border-[#3C3C3C]
              font-medium text-[0.8rem] 
              ${selectedCabOption && !isLoading ? "text-black" : "text-gray-400"} 
              rounded-lg
              transition-colors duration-200
              flex items-center justify-center
            `}
          >
            {isLoading ? (
              <Oval
                width={20}
                height={20}
                color="#1F1F1F"
                secondaryColor="#B5E4FC"
                strokeWidth={5}
              />
            ) : selectedCabOption ? (
              `Confirm ${selectedCabOption?.cab_type} ( INR. ${selectedCabOption?.fare.toFixed(2)})`
            ) : (
              "Select ride option"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabList;
