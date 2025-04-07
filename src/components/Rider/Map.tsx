"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const Map = () => {
  const searchParams = useSearchParams();
  // const src = searchParams.get("src");
  // const dest = searchParams.get("dest");
  // const srcAddress = searchParams.get("srcAddress");
  // const destAddress = searchParams.get("destAddress");
  const rideOption = searchParams.get("rideOption") === "true";
  return (
    <div
      className={`
        w-[100%] ${rideOption ? "md:w-[40%]" : "md:w-[70%]"} 
        h-[100%] md:h-[100%] 
        flex items-center justify-center
        ml-auto 
        bg-[#47494A]`}
    >
      
    </div>
  );
};

export default Map;
