import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const RideStatus = () => {
  return (
    <div className="w-[60%] h-[30%]">
      <div className="w-full h-[30px] px-[15px] flex items-start">
        <p className="text-[0.7rem] text-[#B5E4FC]">RIDE STATUS</p>
      </div>
      <div className="w-full h-[calc(100%-30px)] flex items-start justify-evenly">
        <div className="h-full w-[20%] flex flex-col items-center">
          <div className="w-[50%] aspect-square flex items-center justify-center rounded-full border-2 border-[#6CE9A6]">
            <button className="w-[80%] aspect-square bg-[white] flex items-center justify-center rounded-full">
              <Icon
                icon="heroicons:check-20-solid"
                className="h-[40%] w-[40%]  text-[black]"
              />
              {/* teenyicons:pin-alt-solid */}
            </button>
          </div>
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-[0.7rem] text-[white] font-light">Request</p>
            <p className="text-[0.7rem] text-[white] font-light">Accepted</p>
          </div>
        </div>
        <div className="w-[6%] h-[3px] mt-[5%] bg-[#B5E4FC] rounded-full"></div>
        <div className="h-full w-[20%] flex flex-col items-center">
          <div className="w-[50%] aspect-square flex items-center justify-center rounded-full border-2 border-[#6CE9A6]">
            <button className="w-[80%] aspect-square bg-[white] flex items-center justify-center rounded-full">
              <Icon
                icon="teenyicons:pin-alt-solid"
                className="h-[40%] w-[40%]  text-[black]"
              />
            </button>
          </div>
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-[0.7rem] text-[white] font-light">Reached</p>
            <p className="text-[0.7rem] text-[white] font-light">Pickup</p>
          </div>
        </div>
        <div className="w-[6%] h-[3px] mt-[5%] bg-[#B5E4FC] rounded-full"></div>

        <div className="h-full w-[20%] flex flex-col items-center">
          <div className="w-[50%] aspect-square flex items-center justify-center rounded-full border-2 border-[#6CE9A6]">
            <button className="w-[80%] aspect-square bg-[white] flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:location-filled"
                className="h-[40%] w-[40%]  text-[black]"
              />
            </button>
          </div>
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-[0.7rem] text-[white] font-light">Trip</p>
            <p className="text-[0.7rem] text-[white] font-light">Start</p>
          </div>
        </div>
        <div className="w-[6%] h-[3px] mt-[5%] bg-[#B5E4FC] rounded-full"></div>
        <div className="h-full w-[20%] flex flex-col items-center">
          <div className="w-[50%] aspect-square flex items-center justify-center rounded-full border-2 border-[#6CE9A6]">
            <button className="w-[80%] aspect-square bg-[white] flex items-center justify-center rounded-full">
              <Icon
                icon="material-symbols-light:location-on-rounded"
                className="h-[40%] w-[40%]  text-[black]"
              />
            </button>
          </div>
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-[0.7rem] text-[white] font-light">Trip</p>
            <p className="text-[0.7rem] text-[white] font-light">End</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideStatus;
