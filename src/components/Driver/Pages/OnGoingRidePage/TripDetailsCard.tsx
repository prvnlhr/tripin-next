import React from "react";

const TripDetailsCard = () => {
  return (
    <div
      className="
      w-[60%] h-[30%] 
      grid
      grid-cols-2
      grid-rows-2
      p-[15px]
      border-t border-t-[#3C3C3C]
      border-b border-b-[#3C3C3C]
      "
    >
      <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">PICKUP</p>
        <p className="w-[95%] text-[0.8rem] text-[white] font-light whitespace-nowrap truncate">
          Jodhpur, Sardarpura, near C road
        </p>
      </div>
      <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">DROPOFF</p>
        <p className="w-[95%] text-[0.8rem]  text-[white] font-light whitespace-nowrap truncate">
          Jodhpur, international airport
        </p>
      </div>
      <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">
          JOURNEY DISTANCE
        </p>
        <p className="text-[0.8rem] text-[white] font-light">Approx. - 2.5km</p>
      </div>
    </div>
  );
};

export default TripDetailsCard;
