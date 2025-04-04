import { RiderRideResponse } from "@/types/ongoingRideType";
import React from "react";

interface DriverInfoCardProps {
  ongoingRide: RiderRideResponse | null;
}

const DriverInfoCard: React.FC<DriverInfoCardProps> = ({ ongoingRide }) => {
  // console.log(ongoingRide.)
  return (
    <div
      className="
       w-[100%] md:w-[60%] h-[30%] min-h-[30%] mb-[20px]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[30px]
       grid
       grid-cols-[50%_50%]
       grid-rows-[minmax(0,1fr)_minmax(0,1fr)]
       p-[20px]"
    >
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">DRIVER NAME</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.driver_details.name}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">DRIVER PHONE</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.driver_details.phone}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">CAR</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.driver_details.car_name}{" "}
          {ongoingRide?.driver_details.car_model}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">LICENSE PLATE</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {ongoingRide?.driver_details.license_plate}
        </p>
      </div>
    </div>
  );
};

export default DriverInfoCard;
