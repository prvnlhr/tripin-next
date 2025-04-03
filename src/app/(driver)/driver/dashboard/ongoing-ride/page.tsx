import OnGoingRidePage from "@/components/Driver/Pages/OnGoingRidePage/OnGoingRidePage";
import { getOngoingRide } from "@/lib/services/ride/rideServices";
import { createClient } from "@/utils/supabase/server";
import { NormalizedDriverRide } from "@/lib/services/ride/rideServices";
const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const driverId = user?.user_metadata.driver_id as string;
  const ongoingRide = (await getOngoingRide(
    "driver",
    driverId
  )) as NormalizedDriverRide | null;

  return <OnGoingRidePage ongoingRide={ongoingRide} />;
};

export default page;
