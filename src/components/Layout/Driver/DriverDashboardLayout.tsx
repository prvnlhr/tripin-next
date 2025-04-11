import React from "react";
import MainHeader from "./MainHeader/MainHeader";
import SubHeader from "./SubHeader/SubHeader";
import { createClient } from "@/utils/supabase/server";
import { getDriverInfo } from "@/lib/services/driver/driversServices";
// import MapComponent from "@/components/Common/Map/MapComponent";

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
      flex flex-col items-center p-[20px]"
    >
      <div
        className="
        w-[100%] h-[100%] 
        flex flex-col items-start md:items-end"
      >
        <MainHeader />
        <SubHeader driverInfo={driverInfo} />
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="border-red-500
          w-[100%] md:w-[calc(100%-60px)] h-[calc(100%-240px)] md:h-[calc(100%-160px)]
          md:flex md:flex-row
          overflow-y-scroll"
        >
          {children}
          {/* <MapComponent /> */}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
