import React from "react";
import RideRequestCard from "./RideRequestCard";

const RideRequestPage = () => {
  return (
    <div
      className="
      w-full h-full 
       border-green-500"
    >
      <div className="w-full h-full">
        <div className="w-full h-[70px] flex items-center justify-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Ride request<span className="text-[#B5E4FC]">.</span>
          </p>
        </div>
        <div className="w-full h-[calc(100%-70px)] flex justify-start items-start">
          <RideRequestCard />
        </div>
      </div>
    </div>
  );
};

export default RideRequestPage;
