import BookingFormSkeleton from "@/components/Rider/Pages/BookRide/BookingForm/BookingFormSkeleton";
import React from "react";

const loading = () => {
  return (
    <div
      className={`border-blue-500
    flex items-center justify-center md:justify-start
    w-[100%]
    md:w-[30%]
    h-[100%]"} md:h-[100%] 
    mb-[30px] md:mb-[0px]
    `}
    >
      <BookingFormSkeleton />
    </div>
  );
};

export default loading;
