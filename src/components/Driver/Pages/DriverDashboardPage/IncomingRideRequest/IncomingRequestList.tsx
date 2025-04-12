"use client";
import React, { useEffect, useState } from "react";
import IncomingRequestListCard from "./IncomingRequestListCard";
import { RideRequest } from "@/types/rideTypes";
import IncomingRidePlaceholder from "../../Placeholder/IncomingRidePlaceholder";
import { createClient } from "@/utils/supabase/client";
import useUserSession from "@/hooks/useUserSession";
interface IncomingRequestListProps {
  incomingRequests: RideRequest[];
}

const IncomingRequestList: React.FC<IncomingRequestListProps> = ({
  incomingRequests,
}) => {
  const [incomingRequestsData, setIncomingRequestsData] =
    useState(incomingRequests);

  const session = useUserSession();
  const supabase = createClient();

  const driverId = session?.driver_id;

  useEffect(() => {
    setIncomingRequestsData(incomingRequests);
  }, [incomingRequests]);

  useEffect(() => {
    if (!driverId) return;

    const channel = supabase
      .channel(`driver_requests_${driverId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rides_new",
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          console.log("Change received!", payload.new);
          setIncomingRequestsData((prev) => [
            payload.new as RideRequest,
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "rides_new",
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          setIncomingRequestsData((prev) =>
            prev.filter((request) => request.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, supabase]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Incoming ride requests <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>

      {incomingRequestsData.length > 0 ? (
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="border-green-500
          overflow-y-scroll
          w-full h-[calc(95%-70px)] 
          grid grid-cols-1 md:grid-cols-4
          justify-items-center md:justify-items-start items-start py-[20px] md:py-[0px]"
        >
          {incomingRequestsData.map((rideRequest) => (
            <IncomingRequestListCard
              key={rideRequest.id}
              rideRequest={rideRequest}
            />
          ))}
        </div>
      ) : (
        <div
          className="
          w-full h-[calc(95%-70px)] 
          flex flex-col
          items-center
          md:items-center md:justify-center py-[20px] md:py-[0px]"
        >
          <p className="text-[1rem] text-[#B5E4FC] font-normal mb-[20px]">
            No active Ride Requests at the moment
          </p>
          <IncomingRidePlaceholder />
        </div>
      )}
    </div>
  );
};

export default IncomingRequestList;
