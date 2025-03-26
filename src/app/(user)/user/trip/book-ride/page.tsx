import BookRideView from "@/components/Trip/BookRide/BookRideView";
import React from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const queryParams = await searchParams;
  console.log(" queryParams:", queryParams);
  return <BookRideView />;
};

export default page;
