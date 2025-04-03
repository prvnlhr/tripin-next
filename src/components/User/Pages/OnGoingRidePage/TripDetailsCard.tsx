import { NormalizedRiderRide } from "@/lib/services/ride/rideServices";
import React from "react";

interface TripDetailsCardProps {
  ongoingRide: NormalizedRiderRide | null;
}
const TripDetailsCard: React.FC<TripDetailsCardProps> = ({ ongoingRide }) => {
  return (
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
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">PICKUP</p>
        <p className="w-[95%] text-[0.8rem] text-[white] font-light whitespace-nowrap truncate">
          {ongoingRide?.pickup_address}
        </p>
      </div>
      <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">DROPOFF</p>
        <p className="w-[95%] text-[0.8rem]  text-[white] font-light whitespace-nowrap truncate">
          {ongoingRide?.dropoff_address}
        </p>
      </div>
      <div className="w-[100%] h-[100%] flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">
          JOURNEY DISTANCE
        </p>
        <p className="text-[0.8rem] text-[white] font-light">
          Approx - {ongoingRide?.estimated_distance_km}
        </p>
      </div>
    </div>
  );
};

export default TripDetailsCard;
