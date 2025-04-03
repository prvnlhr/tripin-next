import React from "react";
import MainHeader from "./MainHeader/MainHeader";
import SubHeader from "./SubHeader/SubHeader";
import { createClient } from "@/utils/supabase/server";
import { getDriverInfo } from "@/lib/services/driver/driversServices";
import Map from "@/components/Driver/Map/Map";
const DriverDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const driverId = user?.user_metadata.driver_id as string;
  if (!driverId) {
    return;
  }
  const driverInfo = await getDriverInfo(driverId);

  return (
    <div
      className="
       h-screen w-screen 
       flex flex-col items-center 
       px-[20px] py-[10px]
       "
    >
      <MainHeader />
      <SubHeader driverInfo={driverInfo} />
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="border-red-500
         h-[calc(100%-240px)] md:h-[calc(100%-160px)] 
         w-[98%] md:w-[calc(98%)] md:pl-[60px] 
         md:flex-row md:flex
         overflow-y-scroll"
      >
        <div className="w-[100%] md:w-[60%] h-full flex border-green-600">
          {children}
        </div>
        <Map driverInfo={driverInfo} />
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
