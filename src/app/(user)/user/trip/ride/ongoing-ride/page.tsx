import { getOngoingRide } from "@/lib/services/ride/rideServices";
import { createClient } from "@/utils/supabase/server";
import OnGoingRidePage from "@/components/User/Pages/OnGoingRidePage/OnGoingRidePage";
import { RiderRideResponse } from "@/types/ongoingRideType";
import { redirect } from "next/navigation";
const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const riderId = user?.user_metadata.rider_id as string;
  const ongoingRide: RiderRideResponse = await getOngoingRide("rider", riderId);
  if (!ongoingRide) {
    redirect("/");
  }
  return <OnGoingRidePage ongoingRide={ongoingRide} />;
};

export default page;
