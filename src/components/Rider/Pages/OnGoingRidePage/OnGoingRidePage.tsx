import React from "react";
import TripDetailsCard from "./TripDetailsCard";
import RideStatus from "./RideStatus";
import DriverInfoCard from "./DriverInfoCard";
import { RiderRideResponse } from "@/types/rideTypes";

interface OnGoingRidePageProps {
  ongoingRide: RiderRideResponse | null;
}

const OnGoingRidePage: React.FC<OnGoingRidePageProps> = ({ ongoingRide }) => {
  return (
    <div className="w-[100%] md:w-[50%] h-full flex flex-col">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Ongoing ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div
        className="w-full h-[calc(100%-70px)] border-green-500 overflow-y-scroll mb-[50px] md:mb-[0px]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <DriverInfoCard ongoingRide={ongoingRide} />
        <TripDetailsCard ongoingRide={ongoingRide} />
        <RideStatus ongoingRide={ongoingRide} />
      </div>
    </div>
  );
};

export default OnGoingRidePage;
