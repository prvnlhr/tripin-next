import React from "react";

const loading = () => {
  return (
    <div
      className="w-[100%] md:w-[50%] h-full flex flex-col
      animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
    >
      <div className="w-full h-[70px] flex items-center justify-start">
        <p className="font-light text-[1.7rem] leading-tight">
          Ongoing ride <span className="text-[#B5E4FC]">.</span>
        </p>
      </div>
      <div
        className="w-full h-[calc(100%-70px)] border-green-500 overflow-y-scroll mb-[50px] md:mb-[0px]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* DriverInfoCard */}
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
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[70%]"></div>
          </div>
          <div className="w-full h-full flex flex-col items-start justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[70%]"></div>
          </div>
          <div className="w-full h-full flex flex-col items-start justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[70%]"></div>
          </div>
          <div className="w-full h-full flex flex-col items-start justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[70%]"></div>
          </div>
        </div>

        {/* TripDetails Card */}
        <div
          className="
          w-[100%] md:w-[60%]  h-[30%] min-h-[40%]
          grid
          grid-cols-2
          grid-rows-2
          p-[15px]
          border-t border-t-[#3C3C3C]
          border-b border-b-[#3C3C3C]
      "
        >
          <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[60%]"></div>
          </div>
          <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[60%]"></div>
          </div>
          <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
            <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
            <div className="h-[5px] rounded bg-[#454849] w-[60%]"></div>
          </div>
        </div>

        {/* RideStatus card */}
        <div
          className="w-[100%] md:w-[60%] h-[400px]
              border-red-500
              mt-[20px]"
        >
          <div className="w-full h-[40px] px-[15px] flex items-center">
            <p className="text-[0.8rem] text-[#B5E4FC]">LIVE TRACKING</p>
          </div>
          <div className="w-full flex-1 flex flex-col items-start justify-start px-[15px] py-[15px]">
            {Array.from({ length: 4 }).map((rStatus, rStatusIndx) => (
              <div
                className="w-auto h-auto flex  border-red-600"
                key={rStatusIndx}
              >
                <div className="w-[15px] h-auto flex flex-col items-center">
                  <div
                    className={`w-full aspect-square flex items-center justify-center border border-[#454849] rounded-full`}
                  >
                    <div
                      className={`w-[80%] aspect-square rounded-full border-2 border-[#454849]`}
                    ></div>
                  </div>
                  <div className={`w-[1px]  flex-1 bg-[#454849]`}></div>
                </div>
                <div className="w-auto h-auto flex flex-col pb-[20px]">
                  <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
                  <div className="h-[5px] rounded bg-[#454849] w-[80%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
