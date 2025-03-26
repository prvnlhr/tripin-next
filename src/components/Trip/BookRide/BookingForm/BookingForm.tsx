"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
const BookingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchRide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("src", "173.25,45.78");
    params.set("dest", "7854.85,22.34");
    params.set("options", "true");
    router.push(`book-ride?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div
      className="
       w-[100%] h-[100%] md:w-[90%]
       flex flex-col
      border-green-400"
    >
      <div className="w-full h-full">
        {/* Header ---------------------------------------- */}
        <div className="w-full h-[80px] flex flex-col justify-center items-start border-green-400">
          <p className="font-light text-[1.7rem] leading-tight">
            Lets book a ride
            <br />
            for you <span className="text-[#B5E4FC]">.</span>
          </p>
        </div>

        {/* Input wrapper ---------------------------------------- */}
        <div
          className="
          w-full h-[calc(100%-130px)] 
          md:h-[calc(80%-130px)] 
         border-red-400 
          flex flex-col justify-evenly items-center
          "
        >
          {/* Pickup point ------------ */}
          <div
            className="
            h-auto 
            w-full 
            grid
            grid-cols-[100%] 
            grid-rows-[auto_auto_auto]"
          >
            <div className="w-full h-auto flex items-center">
              <p className="text-[1.2rem] text-[#B5E4FC] font-normal">FROM</p>
            </div>
            <div className="w-full h-auto flex items-center">
              <p className="text-[0.8rem] font-light">Pickup point</p>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start border-red-400">
                <input className="h-full flex-1 font-light" />
                <div className="h-full aspect-square flex items-center justify-center">
                  <Icon
                    icon="tabler:location-filled"
                    className="text-[#B5E4FC] w-[35%] h-[35%]"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* DropOff point ------------ */}
          <div
            className="
            h-auto 
            w-full 
            grid
            grid-cols-[100%] 
            grid-rows-[auto_auto_auto]"
          >
            <div className="w-full h-auto flex items-center">
              <p className="text-[1.2rem] text-[#B5E4FC] font-normal">WHERE</p>
            </div>
            <div className="w-full h-auto flex items-center">
              <p className="text-[0.8rem] font-light">Drop off</p>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start border-red-400">
                <input className="h-full flex-1 font-light" />
                <div className="h-full aspect-square flex items-center justify-center">
                  <Icon
                    icon="material-symbols-light:location-on-rounded"
                    className="text-[#B5E4FC] w-[45%] h-[45%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[50px] flex items-center justify-center">
          <button
            onClick={handleSearchRide}
            className="
            w-full h-[80%] 
            bg-[#B5E4FC]
            border border-[#3C3C3C]
            font-normal text-[0.8rem] text-[#1F1F1F]
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

export default BookingForm;
