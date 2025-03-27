import React from "react";
import UserInfoCard from "./UserInfoCard";
import TripDetailsCard from "./TripDetailsCard";
import RideStatus from "./RideStatus";

const OnGoingRidePage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Ongoing ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div className="w-full h-[calc(100%-70px)] flex flex-col justify-evenly">
        <UserInfoCard />
        <TripDetailsCard />
        <RideStatus />
      </div>
    </div>
  );
};

export default OnGoingRidePage;
