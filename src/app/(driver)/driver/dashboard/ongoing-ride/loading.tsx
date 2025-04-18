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
              border-b border-b-[#3C3C3C]"
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
        <div className="w-[100%] md:w-[60%] h-[30%] mt-[20px]">
          <div className="w-full h-[30px] px-[15px] flex items-start">
            <p className="text-[0.7rem] text-[#B5E4FC]">RIDE STATUS</p>
          </div>
          <div className="w-full h-[calc(100%-30px)] flex items-start justify-evenly">
            {Array.from({ length: 4 }).map((rStatus, rStatusIndx) => (
              <React.Fragment key={rStatusIndx}>
                <div className=" h-full w-[20%] flex flex-col items-center">
                  <div
                    className={`relative w-[50%] aspect-square flex items-center justify-center rounded-full border-2 bg-[#454849]`}
                  >
                    <div
                      className={`w-[80%] aspect-square bg-[#454849] flex items-center justify-center rounded-full cursor-pointer`}
                    ></div>
                  </div>
                  <div className="w-full flex-1 flex flex-col items-center justify-center"></div>
                </div>
                {rStatusIndx !== 2 && (
                  <div
                    className={`w-[6%] h-[3px] mt-[5%] text-[#454849] rounded-full`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
