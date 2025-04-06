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
      className="
       h-screen w-screen 
       flex flex-col items-center 
       px-[20px] py-[10px]"
    >
      <MainHeader />
      <SubHeader riderInfo={riderInfo} />
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="
         h-[calc(100%-240px)] md:h-[calc(100%-160px)] 
         w-[98%] md:w-[calc(98%)] md:pl-[60px] 
         md:flex-row md:flex
         overflow-y-scroll"
      >
        {children}
        <MapComponent />
      </div>
    </div>
  );
};

export default UserTripLayout;
