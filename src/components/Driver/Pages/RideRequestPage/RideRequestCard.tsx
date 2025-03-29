import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const RideRequestCard = () => {
  return (
    <div
      className="
      w-auto h-auto
      grid
      grid-col-1
      gird-rows-5 
      mt-[20px]
      "
    >
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">FROM</p>
        <p className="text-[0.9rem] text-[white] font-light">Pepper Pots</p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">PICKUP</p>
        <p className="text-[0.9rem] text-[white] font-light">
          Jodhpur, Ratanada sector 2
        </p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DROPOFF</p>
        <p className="text-[0.8rem] text-[white] font-light">
          Jodhpur, C road Sardarpura
        </p>
      </div>
      <div className="w-full h-[auto] mb-[15px]">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DISTANCE</p>
        <p className="text-[0.9rem] text-[white] font-light">3.2KM</p>
      </div>
      <div className="w-full h-[50px] flex items-center">
        <button
          type="button"
          className="flex h-[80%] mr-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#F04438]"
        >
          <Icon icon="ep:close" className="h-[40%] w-[40%] text-[white]" />
        </button>
        <Link
          href={"/driver/dashboard/ongoing-ride"}
          type="button"
          className="flex h-[80%] ml-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#32D583]"
        >
          <Icon
            icon="heroicons:check-20-solid"
            className="h-[40%] w-[40%]  text-[white]"
          />
        </Link>
      </div>
    </div>
  );
};

export default RideRequestCard;
