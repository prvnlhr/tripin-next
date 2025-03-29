import React from "react";
import IncomingRequestCard from "./IncomingRequestCard";

const IncomingRequestList = () => {
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
        <IncomingRequestCard />
        <IncomingRequestCard />
        <IncomingRequestCard />
        <IncomingRequestCard />
        <IncomingRequestCard />
      </div>
    </div>
  );
};

export default IncomingRequestList;
