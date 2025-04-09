import { RiderPastRide } from "@/types/rider/ride/rideTypes";
import { formatDateToObject } from "@/utils/dateUtils";

interface PastRideListCardProps {
  pastRide: RiderPastRide;
}

interface DateObj {
  day: number;
  month: string;
  year: number;
}
const PastRideListCard: React.FC<PastRideListCardProps> = ({ pastRide }) => {
  const dateObj: DateObj = formatDateToObject(pastRide.completed_at);
  return (
    <div
      className="d
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
        <p className="text-[2rem] text-[white] font-medium">{dateObj.day}</p>
        <p className="text-[1.2rem] text-[white] font-light">{dateObj.month}</p>
      </div>
      <div className="w-full h-full col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col justify-evenly border-green-500">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">FROM</p>
        <p className="text-[0.8rem] text-[white] w-[85%] font-light line-clamp-2">
          {pastRide.pickup_address}
        </p>
      </div>
      <div className="w-full h-full col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">FROM</p>
        <p className="text-[0.8rem] text-[white] w-[85%] font-light line-clamp-2">
          {pastRide.dropoff_address}
        </p>
      </div>
      <div className="w-full h-full col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col justify-evenly border-red-400">
        <p className="text-[0.8rem] text-[#B5E4FC] font-medium">
          {pastRide.distance_km} KM
        </p>
      </div>
    </div>
  );
};

export default PastRideListCard;
