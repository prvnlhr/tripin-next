import { DriverData } from "@/types/userType";
import React from "react";
interface VerifiedDriverListCardProps {
  verifiedDriver: DriverData;
}
const VerifiedDriverListCard: React.FC<VerifiedDriverListCardProps> = ({
  verifiedDriver,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };
  return (
    <div
      className="
      border border-[#3C3C3C]
      w-[90%] md:w-[23%]
      aspect-[2/1.2]
      grid grid-cols-[50%_50%] grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
      mb-[20px] md:m-[1%] p-[15px]
      rounded"
    >
      <div className="w-full h-full  flex flex-col justify-start items-start">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">DRIVER NAME</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {verifiedDriver.name}
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-evenly border-green-500">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">CAR</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {verifiedDriver.car_name + " " + verifiedDriver.car_model}
        </p>
      </div>
      <div className="w-full h-full  flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">STATUS</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {verifiedDriver.approval_status.toUpperCase()}
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-evenly border-green-500">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">CAB TYPE</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {verifiedDriver.cab_type}
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-evenly border-green-500">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">JOINED</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {formatDate(verifiedDriver.created_at)}
        </p>
      </div>
      <div className="w-full h-full  flex justify-start items-center border-red-400">
        <div
          className={`w-auto h-[60%] px-[10px] flex items-center rounded border text-[0.7rem]  font-medium border-green-500 ${verifiedDriver.is_online ? "bg-green-500/10 border-green-500 text-green-500" : "border-red-500 bg-red-500/10 text-red-500"}`}
        >
          <span
            className={`aspect-square h-[5px] ${verifiedDriver.is_online ? "bg-green-500" : "bg-red-500"} rounded-full mr-[5px]`}
          ></span>
          {verifiedDriver.is_online ? "ONLINE" : "OFFLINE"}
        </div>
      </div>
    </div>
  );
};

export default VerifiedDriverListCard;
