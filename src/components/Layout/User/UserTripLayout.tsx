import React from "react";
import MainHeader from "./MainHeader/MainHeader";
import SubHeader from "./SubHeader/SubHeader";
import MapComponent from "@/components/Common/Map/MapComponent";
const UserTripLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="
       h-screen w-screen 
       flex flex-col items-center 
       px-[20px] py-[10px]"
    >
      <MainHeader />
      <SubHeader />
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="
         h-[calc(100%-160px)] 
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
