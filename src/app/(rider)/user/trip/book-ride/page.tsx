import BookRidePage from "@/components/Rider/Pages/BookRide/BookRidePage";
import { getRiderInfo } from "@/lib/services/rider/riderServices";
import { createClient } from "@/utils/supabase/server";
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const riderId = user?.user_metadata.rider_id as string;
  if (!riderId) {
    return;
  }
  const riderInfo = await getRiderInfo(riderId);

  return (
    <BookRidePage
      src={src}
      dest={dest}
      rideOption={rideOption === "true"}
      riderInfo={riderInfo}
    />
  );
};

export default page;
