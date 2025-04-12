import React from "react";


const PastRideCard = () => {
    return (
      <div
        className="animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]
        border border-[#3C3C3C]
        w-[90%] md:w-[80%]
        aspect-[2/1.3] md:aspect-[2/1.1]
        grid
        grid-cols-[25%_75%]
        grid-rows-[minmax(0,1fr)_minmax(0,1fr)_30px]
        mb-[20px]
        p-[10px]
        rounded"
      >
        <div className="w-full h-full col-start-1 col-end-2 row-start-1 row-end-4 flex flex-col justify-start items-center">
          <div className="aspect-square w-[70%] rounded border border-[#454849]"></div>
          <div className="h-[5px]  w-[60%] mt-[10px] rounded bg-[#454849]"></div>
        </div>
        <div className="w-full h-full col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col justify-evenly border-green-500">
          <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
          <div className="h-[5px] rounded bg-[#454849] w-[60%]"></div>
        </div>
        <div className="w-full h-full col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-evenly">
          <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
          <div className="h-[5px] rounded bg-[#454849] w-[60%]"></div>
        </div>
        <div className="w-full h-full col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col justify-evenly border-red-400">
          <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
        </div>
      </div>
    );
  };
const loading = () => {
  return (
    <div className="w-[100%] h-full flex">
      <div className="w-full h-full">
        <div className="w-full h-[70px] flex items-center justify-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Past rides completed <span className="text-[#B5E4FC]">.</span>
          </p>
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="
          overflow-y-scroll
          w-full h-[calc(95%-70px)] 
          grid grid-cols-1 md:grid-cols-3
          justify-items-center md:justify-items-start items-start"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <PastRideCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
