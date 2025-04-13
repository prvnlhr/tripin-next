"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { riderRideStatus } from "@/utils/rideUtils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { revalidateTagHandler } from "@/lib/validation";
import { updateRideStatus } from "@/lib/services/driver/ride/rideServices";
import { DriverRideResponse } from "@/types/rideTypes";
import { useUrlParams } from "@/hooks/useUrlParams";
type RideStatus =
  | "SEARCHING"
  | "DRIVER_ASSIGNED"
  | "REACHED_PICKUP"
  | "TRIP_STARTED"
  | "TRIP_ENDED"
  | "COMPLETED"
  | "CANCELLED";

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
interface RideStatusProps {
  ongoingRide: DriverRideResponse | null;
}
const RideStatus: React.FC<RideStatusProps> = ({ ongoingRide }) => {
  const router = useRouter();
  const supabase = createClient();
  const { setParams } = useUrlParams();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState(
    getStepsCompleted(ongoingRide?.status)
  );

  useEffect(() => {
    setStepsCompleted(getStepsCompleted(ongoingRide?.status));
  }, [ongoingRide]);

  const handleUpdateRideStatus = async (rideStatus: string) => {
    if (!ongoingRide?.id) {
      console.error("No ride ID available");
      return;
    }
    setSelectedStatus(rideStatus);
    setIsLoading(true);

    try {
      const updateData = {
        rider_id: ongoingRide.rider_id,
        status: rideStatus,
      };
      const updatedRide = await updateRideStatus(ongoingRide.id, updateData);
      console.log(`Status changed to ${rideStatus}:`, updatedRide);
    } catch (error) {
      console.error(`Failed to update status to ${rideStatus}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!ongoingRide?.id) return;

    setParams({
      rider_location: `${ongoingRide.pickup_location.lat},${ongoingRide.pickup_location.lng}`,
    });

    const channel = supabase
      .channel(`rides_new_driver_ongoing_${ongoingRide.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides_new",
          filter: `id=eq.${ongoingRide.id}`,
        },
        async (payload) => {
          console.log("Change event occured payload:", payload);
          const updatedRide = payload.new as DriverRideResponse;
          console.log(" updatedRide:", updatedRide);
          const newStatus = updatedRide.status;
          if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
            await revalidateTagHandler("driverInfo");
            router.push("/driver/dashboard");
          }
          setStepsCompleted(getStepsCompleted(updatedRide.status));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    ongoingRide?.id,
    ongoingRide?.pickup_location.lat,
    ongoingRide?.pickup_location.lng,
    supabase,
    router,
    setParams,
  ]);

  return (
    <div className="w-[100%] md:w-[60%]  h-[30%]">
      <div className="w-full h-[30px] px-[15px] flex items-start">
        <p className="text-[0.7rem] text-[#B5E4FC]">RIDE STATUS</p>
      </div>
      <div className="w-full h-[calc(100%-30px)] flex items-start justify-evenly">
        {riderRideStatus.map((rStatus, rStatusIndx) => (
          <React.Fragment key={rStatusIndx}>
            <div className=" h-full w-[20%] flex flex-col items-center">
              <div
                className={`relative w-[50%] aspect-square flex items-center justify-center rounded-full border-2 ${stepsCompleted >= rStatusIndx + 1 ? rStatus.ringColor : "border-[#454849]"}`}
              >
                <button
                  onClick={() => handleUpdateRideStatus(rStatus.statusValue)}
                  className={`w-[80%] aspect-square ${stepsCompleted >= rStatusIndx + 1 ? "bg-white" : "bg-[#454849]"} flex items-center justify-center rounded-full cursor-pointer`}
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
                <p
                  className={`text-[0.7rem] ${stepsCompleted >= rStatusIndx + 1 ? "text-white" : "text-[#454849]"} font-light`}
                >
                  {rStatus.label1}
                </p>
                <p
                  className={`text-[0.7rem] ${stepsCompleted >= rStatusIndx + 1 ? "text-white" : "text-[#454849]"} font-light`}
                >
                  {rStatus.label2}
                </p>
              </div>
            </div>
            {rStatusIndx !== riderRideStatus.length - 1 && (
              <div
                className={`w-[6%] h-[3px] mt-[5%]  ${stepsCompleted >= rStatusIndx + 2 ? "bg-[#B5E4FC]" : "bg-[#454849]"} rounded-full`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RideStatus;
