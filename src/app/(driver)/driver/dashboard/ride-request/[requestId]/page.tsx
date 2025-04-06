import RideRequestPage from "@/components/Driver/Pages/RideRequestPage/RideRequestPage";
import { getRideRequestDetails } from "@/lib/services/driver/ride/rideServices";
import { RideRequestDetails } from "@/types/rideTypes";
import React from "react";

const page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;
  const rideRequestDetails: RideRequestDetails =
    await getRideRequestDetails(requestId);
  return <RideRequestPage rideRequestDetails={rideRequestDetails} />;
};

export default page;
