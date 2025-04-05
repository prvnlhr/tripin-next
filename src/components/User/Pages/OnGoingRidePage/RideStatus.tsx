"use client";
import { RiderRideResponse } from "@/types/ongoingRideType";
import { driverRideStatus } from "@/utils/rideUtils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type RideStatus =
  | "SEARCHING"
  | "DRIVER_ASSIGNED"
  | "REACHED_PICKUP"
  | "TRIP_STARTED"
  | "TRIP_ENDED"
  | "COMPLETED"
  | "CANCELLED";

interface RideStatusProps {
  ongoingRide: RiderRideResponse | null;
}

const getStepsCompleted = (status: RideStatus | undefined): number => {
  if (!status) return 0;

  switch (status) {
    case "DRIVER_ASSIGNED":
      return 1;
    case "REACHED_PICKUP":
      return 2;
    case "TRIP_STARTED":
      return 3;
    case "TRIP_ENDED":
      return 4;
    case "COMPLETED":
    case "CANCELLED":
      return 5;
    default:
      return 0;
  }
};
const RideStatus: React.FC<RideStatusProps> = ({ ongoingRide }) => {
  const supabase = createClient();

  const [rideStatusData, setRideStatusData] = useState(ongoingRide);
  const [stepsCompleted, setStepsCompleted] = useState(
    getStepsCompleted(ongoingRide?.status)
  );

  useEffect(() => {
    setStepsCompleted(getStepsCompleted(ongoingRide?.status));
    setRideStatusData(ongoingRide);
    console.log(ongoingRide);
  }, [ongoingRide]);

  useEffect(() => {
    if (!ongoingRide?.id) return;

    const channel = supabase
      .channel(`rides_new_rider_ongoing_${ongoingRide.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides_new",
          filter: `id=eq.${ongoingRide.id}`,
        },
        (payload) => {
          const updatedRide = payload.new as RiderRideResponse;
          // const newStatus = updatedRide.status;
          // if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
          // }
          // if (newStatus === "TRIP_ENDED") {
          // }
          setRideStatusData(updatedRide);
          setStepsCompleted(getStepsCompleted(updatedRide.status));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ongoingRide?.id, supabase]);

  return (
    <div
      className="w-[100%] md:w-[60%] h-[400px]
      border-red-500
      mt-[20px]
      "
    >
      <div className="w-full h-[40px] px-[15px] flex items-center">
        <p className="text-[0.8rem] text-[#B5E4FC]">LIVE TRACKING</p>
      </div>
      <div className="w-full flex-1 flex flex-col items-start justify-start px-[15px] py-[15px]">
        {driverRideStatus.map((rStatus, rStatusIndx) => (
          <div className="w-auto h-auto flex  border-red-600" key={rStatusIndx}>
            <div className="w-[15px] h-auto flex flex-col items-center">
              <div
                className={`w-full aspect-square flex items-center justify-center border ${stepsCompleted >= rStatusIndx + 1 ? "border-white" : "border-[#454849]"} rounded-full`}
              >
                <div
                  className={`w-[80%] aspect-square rounded-full border-2 ${stepsCompleted >= rStatusIndx + 1 ? rStatus.border : "border-[#454849]"} `}
                ></div>
              </div>
              <div
                className={`w-[1px]  flex-1 ${stepsCompleted >= rStatusIndx + 1 ? "bg-white" : "bg-[#454849]"}`}
              ></div>
            </div>
            <div className="w-auto h-auto flex flex-col pb-[20px]">
              <p
                className={`text-[1rem] font-normal ml-[20px] ${stepsCompleted >= rStatusIndx + 1 ? "text-white" : "text-[#454849]"}`}
              >
                {rStatus.label1}
              </p>
              <p
                className={`text-[0.8rem] font-light ml-[20px] ${stepsCompleted >= rStatusIndx + 1 ? "text-white" : "text-[#454849]"}`}
              >
                {rStatus.label2}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[100%] h-[50px] flex items-center justify-center">
        {rideStatusData?.status === "TRIP_ENDED" && (
          <button
            className={`
              w-full h-[80%] bg-[#B5E4FC] hover:bg-[#9fd4f0] cursor-pointer
              border border-[#3C3C3C]
              font-medium text-[0.9rem] 
              text-black
              rounded-lg
              transition-colors duration-200
            `}
          >
            Make Payement INR - {rideStatusData?.fare}
          </button>
        )}
      </div>
    </div>
  );
};

export default RideStatus;
