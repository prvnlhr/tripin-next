import { DriverRideResponse } from "@/types/ongoingRideType";
import React from "react";

interface UserInfoCardProps {
  ongoingRide: DriverRideResponse | null;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ ongoingRide }) => {
  return (
    <div
      className="
       w-[100%] md:w-[60%] h-[30%]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[30px]
       grid
       grid-cols-[100%]
       grid-rows-[minmax(0,1fr)_minmax(0,1fr)]
       p-[20px]"
    >
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">RIDERS NAME</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.rider_details.name}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">PHONE</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.rider_details.phone}
        </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
