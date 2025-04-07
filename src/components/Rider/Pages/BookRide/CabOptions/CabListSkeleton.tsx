import React from "react";
import CabCardSkeleton from "./CabCardSkeleton";

const CabListSkeleton = () => {
  return (
    <div className="w-[100%] md:w-[90%] h-[95%] flex flex-col">
      <div className="w-full h-[80px] flex flex-col justify-center items-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Choose a
          <br />
          ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>

      <div className="w-full h-[calc(100%-80px)] flex flex-col justify-between">
        <div className="w-full h-[calc(100%-70px)] space-y-4 flex flex-col justify-end overflow-y-auto">
          {Array.from({ length: 3 }).map((_, skIndex) => (
            <CabCardSkeleton key={skIndex} />
          ))}
        </div>

        <div className="w-full h-[60px] flex items-center justify-center mt-4">
          <button
            disabled={true}
            className={`
               w-full h-[80%] 
             bg-[#46494a75] cursor-not-allowed
              border border-[#3C3C3C]
              font-medium text-[0.9rem] 
            text-gray-400
              rounded-lg
              transition-colors duration-200
            `}
          >
            Select ride option
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabListSkeleton;
