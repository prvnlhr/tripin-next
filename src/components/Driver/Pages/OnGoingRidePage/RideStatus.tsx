"use client";
import { updateRideStatus } from "@/lib/services/driver/driversServices";
import { NormalizedDriverRide } from "@/lib/services/ride/rideServices";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";

type RideStatus =
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

const rideStatus = [
  {
    label1: "Request",
    label2: "Accepted",
    statusValue: "ACCEPTED",
    icon: "heroicons:check-20-solid",
    ringColor: "border-[#6CE9A6]",
  },
  {
    label1: "Reached",
    label2: "Pickup",
    statusValue: "ARRIVED",
    icon: "teenyicons:pin-alt-solid",
    ringColor: "border-[#4F85F3]",
  },
  {
    label1: "Trip",
    label2: "Start",
    statusValue: "STARTED",
    icon: "tabler:location-filled",
    ringColor: "border-[#FDB022]",
  },
  {
    label1: "Trip",
    label2: "End",
    statusValue: "COMPLETED",
    icon: "material-symbols-light:location-on-rounded",
    ringColor: "border-[#907AEA]",
  },
];

interface RideStatusProps {
  ongoingRide: NormalizedDriverRide | null;
}
const RideStatus: React.FC<RideStatusProps> = ({ ongoingRide }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRideStatus = async (rideStatus: string) => {
    if (!ongoingRide?.id) {
      console.error("No ride ID available");
      return;
    }
    setSelectedStatus(rideStatus);
    setIsLoading(true);

    try {
      const updatedRide = await updateRideStatus(
        ongoingRide.id,
        rideStatus as RideStatus
      );
      console.log(`Status changed to ${rideStatus}:`, updatedRide);
    } catch (error) {
      console.error(`Failed to update status to ${rideStatus}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[100%] md:w-[60%]  h-[30%]">
      <div className="w-full h-[30px] px-[15px] flex items-start">
        <p className="text-[0.7rem] text-[#B5E4FC]">RIDE STATUS</p>
      </div>
      <div className="w-full h-[calc(100%-30px)] flex items-start justify-evenly">
        {rideStatus.map((rStatus, rStatusIndx) => (
          <React.Fragment key={rStatusIndx}>
            <div className=" h-full w-[20%] flex flex-col items-center">
              <div
                className={`relative w-[50%] aspect-square flex items-center justify-center rounded-full border-2 ${rStatus.ringColor}`}
              >
                <button
                  onClick={() => handleUpdateRideStatus(rStatus.statusValue)}
                  className="w-[80%] aspect-square bg-[white] flex items-center justify-center rounded-full cursor-pointer"
                >
                  <Icon
                    icon={rStatus.icon}
                    className="h-[40%] w-[40%]  text-[black]"
                  />
                </button>
                {selectedStatus === rStatus.statusValue && isLoading && (
                  <Oval
                    visible={true}
                    color="white"
                    secondaryColor="transparent"
                    strokeWidth="2"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass="z-[10] absolute w-[130%] h-[130%] flex items-center justify-center"
                  />
                )}
              </div>
              <div className="w-full flex-1 flex flex-col items-center justify-center">
                <p className="text-[0.7rem] text-[white] font-light">
                  {rStatus.label1}
                </p>
                <p className="text-[0.7rem] text-[white] font-light">
                  {rStatus.label2}
                </p>
              </div>
            </div>
            {rStatusIndx !== rideStatus.length - 1 && (
              <div className="w-[6%] h-[3px] mt-[5%] bg-[#B5E4FC] rounded-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RideStatus;
