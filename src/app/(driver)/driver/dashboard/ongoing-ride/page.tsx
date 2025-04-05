import OnGoingRidePage from "@/components/Driver/Pages/OnGoingRidePage/OnGoingRidePage";
import { getOngoingRide } from "@/lib/services/ride/rideServices";
import { createClient } from "@/utils/supabase/server";
import { DriverRideResponse } from "@/types/ongoingRideType";
import { redirect } from "next/navigation";
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
