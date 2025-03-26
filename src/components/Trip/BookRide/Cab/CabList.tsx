import React from "react";
import CabCard from "./CabCard";

import cabOptions from "@/utils/cabUtils";

const CabList = () => {
  // const queryParamsxx = await searchParams;
  // console.log(" queryParamsxx:", queryParamsxx);

  return (
    <div
      className="
      w-[100%] h-[100%] md:w-[90%]
      flex flex-col"
    >
      <div className="w-full h-[80px] flex flex-col justify-center items-start  border-green-400">
        <p className="font-light text-[1.7rem] leading-tight">
          Choose a
          <br />
          ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div className="w-full h-[calc(100%-80px)]  border-red-400 flex flex-col justify-evenly items-center">
        <div className="w-full h-[calc(100%-50px)] flex flex-col justify-evenly">
          {cabOptions.map((cab, index) => (
            <CabCard key={index} cab={cab} />
          ))}
        </div>
        <div className="w-full h-[50px] flex items-center justify-center">
          <button
            className="
            w-full h-[80%] 
            bg-[#46494a75]
            border border-[#3C3C3C]
            font-normal text-[0.8rem] text-[gray]
            rounded
            cursor-pointer"
          >
            Select ride option
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabList;
