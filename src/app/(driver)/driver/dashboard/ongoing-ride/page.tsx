import React from "react";
import OnGoingRidePage from "@/components/Driver/Pages/OnGoingRidePage/OnGoingRidePage";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getOngoingRide } from "@/lib/services/common/ride/rideServices";
import { DriverRideResponse } from "@/types/rideTypes";
const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const driverId = user?.user_metadata.driver_id as string;
  const ongoingRide: DriverRideResponse = await getOngoingRide(
    "driver",
    driverId
  );
  if (!ongoingRide) {
    redirect("/");
  }
  return <OnGoingRidePage ongoingRide={ongoingRide} />;
};

export default page;
