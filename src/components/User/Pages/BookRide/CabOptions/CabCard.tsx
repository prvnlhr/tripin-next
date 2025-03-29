import Image from "next/image";
import React from "react";
import { CabOption } from "@/types/cabType";

interface CabCardProps {
  cab: CabOption;
}
const CabCard: React.FC<CabCardProps> = ({ cab }) => {
  const fare = 52.3;
  return (
    <div
      className="
         w-[100%] h-[28%] 
         bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
         border border-[#3C3C3C] rounded-[15px]
         grid
         grid-cols-[auto_minmax(0,1fr)]
         grid-rows-[100%]
         p-[5px]"
    >
      <div
        className="
          h-full aspect-square 
          flex items-center justify-center"
      >
        <Image
          src={cab.imgSrc}
          alt={cab.type}
          className="w-[70%] aspect-[1/1] object-contain"
        />
      </div>
      <div
        className="
          h-full flex-1
          grid
          grid-rows-[25px_minmax(0,1fr)_25px]
          gird-cols-[100%]"
      >
        <div className="w-[100%] h-[100%] flex items-center">
          <p className="text-[0.75rem] text-[#B5E4FC] uppercase font-normal">
            {cab.type}
          </p>
        </div>
        <div className="w-[100%] h-[100%] flex items-center">
          <p className="text-[0.8rem] w-[95%] text-white font-light">
            {cab.description}
          </p>
        </div>
        <div className="w-[100%] h-[100%] flex items-center">
          <p className="text-[0.75rem] text-[#B5E4FC] uppercase font-light">
            {Math.round(cab.fareMultiplier * fare * 100) / 100}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CabCard;
