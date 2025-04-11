import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { DriverData } from "@/types/driver/driverTypes";

interface VerificationRequestListCardProps {
  driverRequest: DriverData;
}
const VerificationRequestListCard: React.FC<
  VerificationRequestListCardProps
> = ({ driverRequest }) => {
  return (
    <div
      className="
       w-[90%] md:w-[23%]
       aspect-[4/2.7]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[30px]
       grid grid-cols-[50%_25%_25%] grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
       p-[15px] mb-[20px] md:m-[1%]
       "
    >
      <div className="col-start-1 col-end-2 w-full h-full flex flex-col">
        <div className="w-full  h-[15px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">DRIVER NAME</p>
        </div>
        <div className="w-full  h-[calc(100%-15px)] flex items-start border-red-500">
          <p className="text-[1.2rem] text-[white] font-light truncate whitespace-nowrap">
            {driverRequest.name}
          </p>
        </div>
      </div>
      <div className="col-start-2 col-end-4 w-full h-full flex flex-col ">
        <div className="w-full  h-[15px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">PHONE</p>
        </div>
        <div className="w-full  h-[calc(100%-15px)] flex items-start border-red-500">
          <p className="text-[0.8rem] text-[white] font-light">
            {driverRequest.phone}
          </p>
        </div>
      </div>
      <div className="col-span-3 row-start-2 w-full h-full flex flex-col ">
        <div className="w-full  h-[15px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">
            LICENSE PLATE NUMBER
          </p>
        </div>
        <div className="w-full  h-[calc(100%-15px)] flex items-start border-red-500">
          <p className="text-[0.8rem] text-[white] font-light">
            {driverRequest.license_plate}
          </p>
        </div>
      </div>
      <div className="col-span-2 row-start-3 w-full h-full flex flex-col ">
        <div className="w-full  h-[15px] flex items-center border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">CAR</p>
        </div>
        <div className="w-full  h-[calc(100%-15px)] flex items-start border-red-500">
          <p className="text-[0.8rem] text-[white] font-light">
            {driverRequest.car_name + " " + driverRequest.car_model}
          </p>
        </div>
      </div>
      <div className="col-start-3 row-start-3 w-full h-full flex justify-end items-end">
        <Link
          href={`dashboard/verification-request/${driverRequest.driver_id}`}
          type="button"
          className="flex h-[80%] aspect-square cursor-pointer items-center justify-center rounded-full bg-white"
        >
          <Icon
            icon="bi:arrow-up"
            className="h-[40%] w-[40%] rotate-45 text-[#000000]"
          />
        </Link>
      </div>
    </div>
  );
};

export default VerificationRequestListCard;
