"use client";
import { NormalizedRiderRide } from "@/lib/services/ride/rideServices";
import { rideStatus } from "@/utils/rideUtils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
type RideStatus =
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

interface RideStatusProps {
  ongoingRide: NormalizedRiderRide | null;
}

const getStepsCompleted = (status: RideStatus | undefined): number => {
  if (!status) return 0;

  switch (status) {
    case "ACCEPTED":
      return 1;
    case "ARRIVED":
      return 2;
    case "STARTED":
      return 3;
    case "COMPLETED":
    case "CANCELLED":
      return 4;
    default:
      return 0;
  }
};
const RideStatus: React.FC<RideStatusProps> = ({ ongoingRide }) => {
  const [rideData, setRideData] = useState(ongoingRide);
  const [stepsCompleted, setStepsCompleted] = useState(
    getStepsCompleted(ongoingRide?.status)
  );

  const supabase = createClient();

  useEffect(() => {
    setRideData(ongoingRide);
    setStepsCompleted(getStepsCompleted(ongoingRide?.status));
  }, [ongoingRide]);

  useEffect(() => {
    if (!ongoingRide?.id) return;

    const channel = supabase
      .channel(`ride_status_${ongoingRide.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
          filter: `id=eq.${ongoingRide.id}`,
        },
        (payload) => {
          const updatedRide = payload.new as NormalizedRiderRide;
          setRideData(updatedRide);
          console.log(" rideData:", rideData);
          setStepsCompleted(getStepsCompleted(updatedRide.status));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ongoingRide?.id, supabase]);

  return (
    <div className="w-[100%] md:w-[60%]  h-[400px] border-red-500 mt-[20px]">
      <div className="w-full h-[40px] px-[15px] flex items-center">
        <p className="text-[0.8rem] text-[#B5E4FC]">LIVE TRACKING</p>
      </div>
      <div className="w-full h-[calc(100%-40px)] flex flex-col items-start justify-start px-[15px] py-[15px]">
        {rideStatus.map((rStatus, rStatusIndx) => (
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
    </div>
  );
};

export default RideStatus;
