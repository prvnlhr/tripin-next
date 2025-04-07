import React from "react";

const BookingFormSkeleton = () => {
  return (
    <div className="w-[100%] min-w-[100%] h-[100%] md:w-[90%] md:min-w-[90%] flex flex-col">
      <div className="w-full h-full">
        <div className="w-full h-[80px] flex flex-col justify-center items-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Lets book a ride
            <br />
            for you <span className="text-[#B5E4FC]">.</span>
          </p>
        </div>
        <div
          className="
           animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]
           w-full h-[calc(100%-130px)] md:h-[calc(80%-130px)] flex flex-col justify-evenly items-center"
        >
          <div className="h-auto w-full grid grid-cols-[100%] grid-rows-[auto_auto_auto]">
            <div className="w-full h-[30px] flex items-center">
              <div className="w-[80%] h-[10px] rounded-full bg-[#454849]"></div>
            </div>
            <div className="w-full h-[30px] flex items-center">
              <div className="w-[80%] h-[10px] rounded-full bg-[#454849]"></div>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start">
                <div className="h-full aspect-square flex items-center justify-center"></div>
              </div>
            </div>
          </div>
          <div className="h-auto w-full grid grid-cols-[100%] grid-rows-[auto_auto_auto]">
            <div className="w-full h-[30px] flex items-center">
              <div className="w-[80%] h-[10px] rounded-full bg-[#454849]"></div>
            </div>
            <div className="w-full h-[30px] flex items-center">
              <div className="w-[80%] h-[10px] rounded-full bg-[#454849]"></div>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start">
                <div className="h-full aspect-square flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full h-[50px] flex items-center justify-center
           animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        >
          <button
            disabled={true}
            className={`w-full h-[80%] border border-[#3C3C3C] font-normal text-[0.8rem] rounded
             bg-gray-600 text-gray-400 cursor-not-allowed`}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default BookingFormSkeleton;
