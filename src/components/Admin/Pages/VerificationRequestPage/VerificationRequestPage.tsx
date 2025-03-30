import React from "react";
import VerificationRequestCard from "./VerificationRequestCard";

import { DriverData } from "@/types/userType";

interface VerificationRequestPageProps {
  verificationRequestDetails: DriverData;
}
const VerificationRequestPage: React.FC<VerificationRequestPageProps> = ({
  verificationRequestDetails,
}) => {
  return (
    <div
      className="
      w-full h-full 
       border-green-500"
    >
      <div className="w-full h-full">
        <div className="w-full h-[70px] flex items-center justify-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Verification request<span className="text-[#B5E4FC]">.</span>
          </p>
        </div>
        <div className="w-full h-[calc(100%-70px)] flex justify-start items-start">
          <VerificationRequestCard
            verificationRequestDetails={verificationRequestDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationRequestPage;
