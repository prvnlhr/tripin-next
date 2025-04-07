import React from "react";
import MainHeader from "./MainHeader/MainHeader";
import SubHeader from "./SubHeader/SubHeader";
import MapComponent from "@/components/Common/Map/MapComponent";
import { createClient } from "@/utils/supabase/server";
import { getRiderInfo } from "@/lib/services/rider/riderServices";
const UserTripLayout = async ({ children }: { children: React.ReactNode }) => {
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
    <div
      className="border-red-500
       h-screen w-screen 
       flex flex-col items-center p-[20px]"
    >
      <div
        className="
        w-[100%] h-[100%] 
        flex flex-col items-start md:items-end"
      >
        <MainHeader />
        <SubHeader riderInfo={riderInfo} />
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
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default UserTripLayout;
