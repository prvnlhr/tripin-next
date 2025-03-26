import BookingForm from "./BookingForm/BookingForm";
import CabList from "./Cab/CabList";

const BookRideView = () => {
  let isOptions = false;
  isOptions = true;
  return (
    <section
      className="
      border-blue-400
      w-full
      flex flex-col 
      h-[120vh] 
      md:w-[50%] md:h-[100%] md:flex-row"
    >
      <section className="flex items-center w-full h-[40%] md:w-[50%] md:h-[100%] border-[red]">
        <BookingForm />
      </section>
      {isOptions && (
        <section
          className="border
          flex items-center justify-center 
          w-full h-[60%] md:w-[50%] md:h-full 
          md:border-[#3C3C3C] border-l-1 border-none"
        >
          <CabList />
        </section>
      )}
    </section>
  );
};

export default BookRideView;
