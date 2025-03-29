import React from "react";
import PastRideCard from "./PastRideCard";

const PastRideList = () => {
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
        <PastRideCard />
        <PastRideCard />
        <PastRideCard />
        <PastRideCard />
        <PastRideCard />
        <PastRideCard />
        <PastRideCard />
      </div>
    </div>
  );
};

export default PastRideList;
