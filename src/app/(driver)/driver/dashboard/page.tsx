import DriverDashboardPage from "@/components/Driver/Pages/DriverDashboardPage/DriverDashboardPage";
import { getDriverDashboardData } from "@/lib/services/driver/driversServices";
import { DashboardData } from "@/types/rideTypes";
import { createClient } from "@/utils/supabase/server";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }
  const driverId = user?.user_metadata.driver_id as string;
  const dashboardData: DashboardData = await getDriverDashboardData(driverId);
  return <DriverDashboardPage dashboardData={dashboardData} />;
};

export default page;
