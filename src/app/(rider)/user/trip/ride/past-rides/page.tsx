import { getPastRides } from "@/lib/services/rider/riderServices";
import { createClient } from "@/utils/supabase/server";
import { RiderPastRide } from "@/types/rider/ride/rideTypes";
import PastRideList from "@/components/Rider/Pages/PastRides/PastRideList";
const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const riderId = user?.user_metadata.rider_id as string;
  const { pastRides } = (await getPastRides(riderId)) as {
    pastRides: RiderPastRide[];
  };
  console.log(" pastRidesData:", pastRides);
  return (
    <div className="w-[100%] h-full flex">
      <PastRideList pastRides={pastRides} />
    </div>
  );
};

export default page;
