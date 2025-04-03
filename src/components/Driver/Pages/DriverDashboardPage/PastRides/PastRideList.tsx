import React from "react";
import PastRideListCard from "./PastRideListCard";
import { PastRide } from "@/types/rideTypes";
import IncomingRidePlaceholder from "../../Placeholder/IncomingRidePlaceholder";
interface PastRideListProps {
  pastRides: PastRide[];
}
const PastRideList: React.FC<PastRideListProps> = ({ pastRides }) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Past rides completed <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="
        overflow-y-scroll
        w-full h-[calc(95%-70px)] 
        grid grid-cols-1 md:grid-cols-2
        justify-items-center md:justify-items-start items-start"
      >
        {pastRides.length > 0 ? (
          pastRides.map((pastRide) => (
            <PastRideListCard key={pastRide.id} pastRide={pastRide} />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-[1rem] text-[#B5E4FC] font-normal mb-[20px]">
              No past rides
            </p>
            <IncomingRidePlaceholder />
          </div>
        )}
      </div>
    </div>
  );
};

export default PastRideList;
