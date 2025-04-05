import Image from "next/image";
import React from "react";
import { CabOption } from "@/types/cabType";

interface CabCardProps {
  cab: CabOption;
  isSelected: boolean;
  onSelect: (cab: CabOption) => void;
}
const CabCard: React.FC<CabCardProps> = ({ cab, isSelected, onSelect }) => {
  const handleClick = () => {
    if (cab.is_available) {
      onSelect(cab);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`
         ${cab.is_available ? "cursor-pointer" : "cursor-not-allowed"} 
         w-[100%] h-[28%] 
         bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
         border ${isSelected ? "border-[#B5E4FC]" : "border-[#3C3C3C] "} rounded-[15px]
         grid
         grid-cols-[auto_minmax(0,1fr)]
         grid-rows-[100%]
         p-[5px]
         ${cab.is_available ? "opacity-100" : "opacity-30"}
         `}
    >
      <div
        className=" 
          h-full aspect-square 
          flex items-center justify-center"
      >
        <div className="relative w-[70%] aspect-square flex items-center justify-center">
          <Image src={cab.imgSrc} alt={cab.cab_type} fill={true} />
        </div>
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
            {cab.cab_type}
          </p>
        </div>
        <div className="w-[100%] h-[100%] flex items-center">
          <p className="text-[0.8rem] w-[95%] text-white font-light">
            {cab.description}
          </p>
        </div>
        <div className="w-[100%] h-[100%] flex items-center">
          <p className="text-[0.75rem] text-[#B5E4FC] uppercase font-light">
            {cab.fare.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CabCard;
