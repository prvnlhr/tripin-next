import React from "react";
import BookingForm from "./BookingForm/BookingForm";
import CabList from "./CabOptions/CabList";

interface BookRidePageProps {
  src: string;
  dest: string;
  rideOption: boolean;
}
const BookRidePage: React.FC<BookRidePageProps> = ({ rideOption }) => {
  return (
    <section
      className={`
       border-blue-400
       transition-transform duration-[100]
       w-full
       flex flex-col 
       ${rideOption ? "h-auto" : "h-[60vh]"} 
       ${rideOption ? "md:w-[60%]" : "md:w-[30%]"} 
       md:h-[100%] 
       md:flex-row`}
    >
      <section
        className={`
         flex items-center justify-center mb-[30px]
         ${rideOption ? "h-[60vh]" : "h-[100%]"} 
         ${rideOption ? "md:w-[50%]" : "md:w-[100%]"} 
         md:h-[100%] md:justify-start md:mb-[0px]
         border-[red]`}
      >
        <BookingForm />
      </section>

      {/* Cab Options */}
      {rideOption && (
        <section
          className="
           flex items-start justify-center 
           w-full h-[60vh] md:w-[50%] md:h-full md:justify-center
           md:border-[#3C3C3C] border-l-1 border-none"
        >
          
          <CabList />
        </section>
      )}
    </section>
  );
};

export default BookRidePage;
