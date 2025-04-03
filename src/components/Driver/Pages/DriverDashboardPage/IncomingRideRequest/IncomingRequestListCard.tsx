import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { RideRequest } from "@/types/rideTypes";
interface IncomingRequestListCardProps {
  rideRequest: RideRequest;
}
const IncomingRequestListCard: React.FC<IncomingRequestListCardProps> = ({
  rideRequest,
}) => {
  return (
    <div
      className="
       w-[90%] md:w-[80%]
       aspect-[4/2.5]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[30px]
       grid
       grid-cols-[50%_25%_25%]
       grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
       p-[20px]
       mb-[20px]
       "
    >
      <div className="col-start-1 col-end-2 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">FROM</p>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <p className="text-[1.2rem] text-[white] font-light">Pepper Pots</p>
        </div>
      </div>
      <div className="col-start-2 col-end-4 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">DISTANCE</p>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <p className="text-[0.8rem] text-[white] font-light">Approx 2.5km</p>
        </div>
      </div>
      <div className="col-span-3 row-start-2 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">PICKUP</p>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <p className="text-[0.8rem] text-[white] font-light truncate">
            {rideRequest.pickup_address}
          </p>
        </div>
      </div>
      <div className="col-span-2 row-start-3 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center border-red-500">
          <p className="text-[0.7rem] text-[white] font-medium">DROPOFF</p>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <p className="text-[0.8rem] text-[white] font-light truncate">
            {rideRequest.dropoff_address}
          </p>
        </div>
      </div>
      <div className="col-start-3 row-start-3 w-full h-full flex justify-end items-end">
        <Link
          href={`dashboard/ride-request/${rideRequest.id}`}
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

export default IncomingRequestListCard;
