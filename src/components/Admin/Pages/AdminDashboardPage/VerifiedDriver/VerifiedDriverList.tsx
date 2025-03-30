import React from "react";
import VerifiedDriverListCard from "./VerifiedDriverListCard";
import { DriverData } from "@/types/userType";

interface VerifiedDriverListProps {
  verifiedDrivers: DriverData[];
}

const VerifiedDriverList: React.FC<VerifiedDriverListProps> = ({
  verifiedDrivers,
}) => {
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
         overflow-y-scroll border-red-500
         w-full h-[calc(95%-70px)] 
         flex flex-wrap justify-center items-start
         md:justify-start"
      >
        {verifiedDrivers.map((verifiedDriver) => (
          <VerifiedDriverListCard key={verifiedDriver.driver_id} verifiedDriver={verifiedDriver} />
        ))}
      </div>
    </div>
  );
};

export default VerifiedDriverList;
