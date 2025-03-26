"use client";
import { useSearchParams } from "next/navigation";
import BookingForm from "./BookingForm/BookingForm";
import CabList from "./Cab/CabList";

const BookRideView = () => {
  const searchParams = useSearchParams();
  const options = searchParams.get("options");
  // const queryParamsyy = await searchParams;
  // console.log(" queryParamsyy:", queryParamsyy);
  // let options = false;
  // options = true;
  return (
    <section
      className={`
      border-blue-400
      transition-transform duration-[100]
      w-full
      flex flex-col 
      ${options ? "h-auto" : "h-[60vh]"} 
      ${options ? "md:w-[60%]" : "md:w-[30%]"} 
      md:h-[100%] 
      md:flex-row`}
    >
      <section
        className={`
        flex items-center justify-center mb-[30px]
        ${options ? "h-[60vh]" : "h-[100%]"} 
        ${options ? "md:w-[50%]" : "md:w-[100%]"} 
        md:h-[100%] md:justify-start md:mb-[0px]
        border-[red]`}
      >
        <BookingForm />
      </section>

      {/* Cab Options */}
      {options && (
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

export default BookRideView;
