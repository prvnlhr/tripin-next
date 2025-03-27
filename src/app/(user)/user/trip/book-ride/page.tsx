import BookRideView from "@/components/Trip/BookRide/BookRideView";
import React from "react";

interface RideSearchParams {
  src?: string;
  dest?: string;
  rideOption?: string;
}

type SearchParams = Promise<RideSearchParams>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const {
    src = "173.25,45.78",
    dest = "7854.85,22.34",
    rideOption = "false",
  } = await searchParams;
  return (
    <BookRideView
      src={src}
      dest={dest}
      rideOption={rideOption === "true"} // Converting to boolean
    />
  );
};

export default page;
