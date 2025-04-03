import { getOngoingRide } from "@/lib/services/ride/rideServices";
import { createClient } from "@/utils/supabase/server";
import { NormalizedRiderRide } from "@/lib/services/ride/rideServices";
import OnGoingRidePage from "@/components/User/Pages/OnGoingRidePage/OnGoingRidePage";
const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const riderId = user?.user_metadata.rider_id as string;
  const ongoingRide = (await getOngoingRide(
    "rider",
    riderId
  )) as NormalizedRiderRide | null;

  return <OnGoingRidePage ongoingRide={ongoingRide} />;
};

export default page;
