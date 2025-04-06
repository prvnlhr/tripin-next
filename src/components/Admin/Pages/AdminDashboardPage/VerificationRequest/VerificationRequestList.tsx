import React from "react";
import VerificationRequestListCard from "./VerificationRequestListCard";
import { DriverData } from "@/types/driver/driverTypes";

interface VerificationRequestListProps {
  verificationRequestData: DriverData[];
}

const VerificationRequestList: React.FC<VerificationRequestListProps> = ({
  verificationRequestData,
}) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Pending verification requests
          <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="overflow-y-scroll border-red-500
         w-full h-[calc(95%-70px)] 
         flex flex-wrap justify-center items-start
         md:justify-start
         "
      >
        {verificationRequestData.map((driverRequest) => (
          <VerificationRequestListCard
            driverRequest={driverRequest}
            key={driverRequest.driver_id}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationRequestList;
