"use client";

import BackBtn from "@/components/Common/BackBtn";
// import React, { useEffect } from "react";
import UserGreeting from "./UserGreeting";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { RiderData } from "@/types/userType";
// import { useRouter } from "next/navigation";

interface SubHeaderProps {
  riderInfo: RiderData;
}
const SubHeader: React.FC<SubHeaderProps> = ({ riderInfo }) => {
  // const router = useRouter();

  // useEffect(() => {
  //   if (riderInfo.activeRides > 0) {
  //     router.push("ride/ongoing-ride");
  //   }
  // }, [riderInfo, router]);

  return (
    <div
      className="
       h-[160px]
       md:h-[80px] w-[98%] 
       flex flex-col md:flex-row items-start md:items-center justify-start 
       border-green-300"
    >
      <div className="w-auto h-[56px] md:h-[70%] flex">
        <div className="w-[60px] flex justify-start aspect-square">
          <BackBtn />
        </div>
        <UserGreeting />
      </div>
      <div className="h-[calc(100%-56px)] md:h-full w-[100%] md:flex-1 flex justify-end items-center">
        {/* DRIVER ONGOING RIDE LINK */}

        {riderInfo.activeRides > 0 && (
          <div className="h-full w-auto flex flex-col justify-center border-red-500">
            <Link
              href="ride/ongoing-ride"
              className="w-auto h-[40px] flex items-center p-[2px] rounded-full  border border-[#3C3C3C]"
            >
              <p className="text-[0.7rem] ml-[10px] whitespace-nowrap">
                On Going
              </p>
              <button
                type="button"
                className="h-[100%] aspect-square flex cursor-pointer items-center justify-center ml-[10px] rounded-full bg-[#47494A]"
              >
                <Icon
                  icon="bi:arrow-up"
                  className="h-[40%] w-[40%] rotate-45 text-white"
                />
              </button>
            </Link>
          </div>
        )}
        <div className="ml-[10px] h-full w-auto flex flex-col justify-center border-red-500">
          <Link
            href="ride/past-rides"
            className="w-auto h-[40px] flex items-center p-[2px] rounded-full  border border-[#3C3C3C]"
          >
            <p className="text-[0.7rem] ml-[10px] whitespace-nowrap">
              Past rides
            </p>
            <button
              type="button"
              className="h-[100%] aspect-square flex cursor-pointer items-center justify-center ml-[10px] rounded-full bg-[#47494A]"
            >
              <Icon
                icon="bi:arrow-up"
                className="h-[40%] w-[40%] rotate-45 text-white"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
