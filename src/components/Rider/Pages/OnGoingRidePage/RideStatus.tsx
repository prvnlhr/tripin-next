"use client";
import { PaymentController } from "@/components/Payments/PaymentController";
import { useToast } from "@/context/ToastContext";
import { driverRideStatus } from "@/utils/rideUtils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import { createToastInfo, getCurrentTime } from "@/utils/rider/rideStatusUtils";
import { getStepsCompleted } from "@/utils/rider/rideStatusUtils";
import { finishedRide } from "@/lib/services/rider/ride/rideServices";
import { RiderRideResponse } from "@/types/rideTypes";

interface RideStatusProps {
  ongoingRide: RiderRideResponse | null;
}

const RideStatus: React.FC<RideStatusProps> = ({ ongoingRide }) => {
  const supabase = createClient();
  const { showToast } = useToast();
  const toastIdRef = useRef<string | number>("");

  const [rideStatusData, setRideStatusData] = useState(ongoingRide);
  const [stepsCompleted, setStepsCompleted] = useState(
    getStepsCompleted(ongoingRide?.status)
  );

  useEffect(() => {
    setStepsCompleted(getStepsCompleted(ongoingRide?.status));
    setRideStatusData(ongoingRide);
    console.log(" ongoingRide:", ongoingRide);
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
          const newStatus = updatedRide.status;
          const toastInfo = createToastInfo(newStatus);

          setRideStatusData(updatedRide);
          setStepsCompleted(getStepsCompleted(updatedRide.status));

          if (toastInfo) {
            if (toastIdRef.current) {
              // Update existing toast
              showToast({
                type: "info",
                title: `${toastInfo.title} - ${getCurrentTime()}`,
                description: toastInfo.desc,
                toastId: toastIdRef.current,
                persistent: true,
                showCloseButton: true,
                style: {
                  ["--toast-icon-color" as string]: toastInfo.color,
                  borderColor: toastInfo.borderColor,
                  color: toastInfo.color,
                  background: toastInfo.background,
                },
              });
            } else {
              // Create new toast and store its ID
              const newToastId = showToast({
                type: "info",
                title: `${toastInfo.title} - ${getCurrentTime()}`,
                description: toastInfo.desc,
                persistent: true,
                showCloseButton: true,
                style: {
                  ["--toast-icon-color" as string]: toastInfo.iconColor,
                  borderColor: toastInfo.borderColor,
                  color: toastInfo.color,
                  background: toastInfo.background,
                },
              });
              toastIdRef.current = newToastId;
            }
          }

          // Clear toast when ride is completed
          if (
            newStatus === "TRIP_ENDED" ||
            newStatus === "COMPLETED" ||
            newStatus === "CANCELLED"
          ) {
            // setToastId("");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ongoingRide?.id, supabase, showToast]);

  const handlePaymentSuccess = async () => {
    console.log("Payment succeeded!");
    await finishedRide(ongoingRide?.id);
  };
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

      <div className="w-[100%] h-auto flex items-center justify-start border-green-500 md:p-[5px]">
        {rideStatusData?.status === "TRIP_ENDED" && (
          <PaymentController
            amount={rideStatusData.fare}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default RideStatus;
