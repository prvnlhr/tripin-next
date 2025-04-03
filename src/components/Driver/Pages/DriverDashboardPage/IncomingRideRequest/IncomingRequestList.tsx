import React from "react";
import IncomingRequestListCard from "./IncomingRequestListCard";
import { RideRequest } from "@/types/rideTypes";
import IncomingRidePlaceholder from "../../Placeholder/IncomingRidePlaceholder";
interface IncomingRequestListProps {
  incomingRequests: RideRequest[];
}
const IncomingRequestList: React.FC<IncomingRequestListProps> = ({
  incomingRequests,
}) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Incoming ride requests <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="overflow-y-scroll
        w-full h-[calc(95%-70px)] 
        grid grid-cols-1 md:grid-cols-2 
        justify-items-center md:justify-items-start items-start"
      >
        {incomingRequests.length > 0 ? (
          incomingRequests.map((rideRequest) => (
            <IncomingRequestListCard
              key={rideRequest.id}
              rideRequest={rideRequest}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-[1rem] text-[#B5E4FC] font-normal mb-[20px]">
              No active ride requests at the moment
            </p>
            <IncomingRidePlaceholder />
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequestList;
