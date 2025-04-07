import React from "react";
import BookingForm from "./BookingForm/BookingForm";
import CabList from "./CabOptions/CabList";
import { RiderData } from "@/types/rider/riderTypes";

interface BookRidePageProps {
  src: string;
  dest: string;
  rideOption: boolean;
  riderInfo: RiderData;
}
const BookRidePage: React.FC<BookRidePageProps> = ({
  rideOption,
  riderInfo,
}) => {
  return (
    <>
      <section
        className={`border-blue-500
         flex items-center justify-center md:justify-start
         w-[100%]
         ${rideOption ? "min-w-[30%] md:w-[30%]" : "md:w-[30%]"}
         ${rideOption ? "h-[60vh]" : "h-[100%]"} md:h-[100%] 
         mb-[30px] md:mb-[0px]
         `}
      >
        <BookingForm />
      </section>
      {rideOption && (
        <section
          className="border-green-400
           flex items-start justify-center md:justify-start
           w-full md:w-[30%] md:min-w-[30%]
           h-[60vh] md:h-full"
        >
          <CabList riderInfo={riderInfo} />
        </section>
      )}
    </>
  );
};

export default BookRidePage;
// ${rideOption ? "md:w-[30%]" : "md:w-[30%]"}
