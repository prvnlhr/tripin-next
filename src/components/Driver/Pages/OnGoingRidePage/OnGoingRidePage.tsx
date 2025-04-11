import React from "react";
import UserInfoCard from "./UserInfoCard";
import TripDetailsCard from "./TripDetailsCard";
import RideStatus from "./RideStatus";
import { DriverRideResponse } from "@/types/rideTypes";
import MapComponent from "@/components/Common/Map/MapComponent";

interface OnGoingRidePageProps {
  ongoingRide: DriverRideResponse | null;
}

const OnGoingRidePage: React.FC<OnGoingRidePageProps> = ({ ongoingRide }) => {
  return (
    <div
      className="w-full h-full md:flex
      overflow-y-scroll"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="w-full md:w-[50%] mb-[30px] md:mb-[0px] h-[70vh] md:h-[100%] flex flex-col">
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
      <MapComponent />
    </div>
  );
};

export default OnGoingRidePage;
