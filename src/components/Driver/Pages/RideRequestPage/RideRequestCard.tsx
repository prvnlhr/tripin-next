"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RideRequestDetails } from "@/types/rideTypes";
import useUserSession from "@/hooks/useUserSession";
import { acceptRideRequest } from "@/lib/services/driver/driversServices";
import { useRouter } from "next/navigation";

interface RideRequestCardProps {
  rideRequestDetails: RideRequestDetails;
}
const RideRequestCard: React.FC<RideRequestCardProps> = ({
  rideRequestDetails,
}) => {
  const session = useUserSession();
  const router = useRouter();

  const handleAcceptRideRequest = async () => {
    const rideDetails = {
      ...rideRequestDetails,
      driver_id: session?.driver_id,
    };
    rideDetails.status = "DRIVER_ASSIGNED";
    const requestId = rideRequestDetails.id;
    try {
      const response = await acceptRideRequest(requestId, rideDetails);
      console.log(" response:", response);
      router.push("/driver/dashboard/ongoing-ride");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
      w-auto h-auto
      grid
      grid-col-1
      gird-rows-5 
      mt-[20px]
      "
    >
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">FROM</p>
        <p className="text-[0.9rem] text-[white] font-light">
          {rideRequestDetails.rider_details.name}
        </p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">PICKUP</p>
        <p className="text-[0.9rem] text-[white] font-light">
          {rideRequestDetails.pickup_address}
        </p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DROPOFF</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {rideRequestDetails.dropoff_address}
        </p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DISTANCE</p>
        <p className="text-[0.9rem] text-[white] font-light">
          {rideRequestDetails.distance_km} KM
        </p>
      </div>
      <div className="w-full h-[50px] flex items-center">
        <button
          type="button"
          className="flex h-[80%] mr-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#F04438]"
        >
          <Icon icon="ep:close" className="h-[40%] w-[40%] text-[white]" />
        </button>
        <button
          onClick={handleAcceptRideRequest}
          type="button"
          className="flex h-[80%] ml-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#32D583]"
        >
          <Icon
            icon="heroicons:check-20-solid"
            className="h-[40%] w-[40%]  text-[white]"
          />
        </button>
      </div>
    </div>
  );
};

export default RideRequestCard;
