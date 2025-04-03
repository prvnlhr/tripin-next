import React from "react";
import UserInfoCard from "./UserInfoCard";
import TripDetailsCard from "./TripDetailsCard";
import RideStatus from "./RideStatus";
import { NormalizedDriverRide } from "@/lib/services/ride/rideServices";

interface OnGoingRidePageProps {
  ongoingRide: NormalizedDriverRide | null;
}

const OnGoingRidePage: React.FC<OnGoingRidePageProps> = ({ ongoingRide }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Ongoing ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div className="w-full h-[calc(100%-70px)] flex flex-col justify-evenly">
        <UserInfoCard ongoingRide={ongoingRide} />
        <TripDetailsCard ongoingRide={ongoingRide} />
        <RideStatus ongoingRide={ongoingRide} />
      </div>
    </div>
  );
};

export default OnGoingRidePage;
