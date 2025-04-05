"use client";
import BackBtn from "@/components/Common/BackBtn";
import React, { useState } from "react";
import DriverGreeting from "./DriverGreeting";
import { DriverData } from "@/types/userType";
import { toggleDriverOnlineStatus } from "@/lib/services/driver/driversServices";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Oval } from "react-loader-spinner";
interface SubHeaderProps {
  driverInfo: DriverData;
}
const SubHeader: React.FC<SubHeaderProps> = ({ driverInfo }) => {
  const { is_online, driver_id, activeRides } = driverInfo;
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: boolean) => {
    if (isLoading || is_online === newStatus) return;
    setIsLoading(true);
    try {
      await toggleDriverOnlineStatus(driver_id);
    } catch (error) {
      console.error("Status change failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <DriverGreeting />
      </div>
      <div className="h-[calc(100%-56px)] md:h-full w-[100%] md:flex-1 flex justify-end items-center">
        {/* DRIVER ONGOING RIDE LINK */}

        {activeRides > 0 && (
          <div className="h-full w-auto flex flex-col justify-center border-red-500">
            <Link
              href="/driver/dashboard/ongoing-ride"
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

        {/* DRIVER STATUS TOGGLE */}
        <div className="ml-[10px] h-full w-auto flex flex-col justify-center border-red-500">
          <div className="w-[100px] h-[40px] flex items-center rounded-full bg-[#47494A] border border-[#3C3C3C] p-[2px]">
            <button
              onClick={() => handleStatusChange(!is_online)}
              type="button"
              className="relative w-[100%] h-[100%] flex items-center cursor-pointer"
            >
              <div
                className={`absolute h-[100%] aspect-square flex items-center justify-center ${is_online ? "translate-x-[60px]" : "translate-x-0"}  bg-[#1F1F1F] rounded-full transition-all duration-300 ease-in-out`}
              >
                {isLoading ? (
                  <Oval
                    width="20"
                    height="20"
                    visible={true}
                    color="white"
                    secondaryColor="transparent"
                    strokeWidth="3"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass="w-[70%] h-[70%] flex items-center justify-center"
                  />
                ) : (
                  <div
                    className={`aspect-square h-[5px] ${is_online ? "bg-green-500" : "bg-red-500"}  rounded-full`}
                  ></div>
                )}
              </div>
              <div
                className={`absolute ml-[5px] left-0 w-[calc(100%-40px)] h-[100%] ${is_online ? "flex" : "hidden"} justify-center items-center`}
              >
                <p className="text-[0.7rem] transition-all duration-300 ease-in-out">
                  ONLINE
                </p>
              </div>
              <div
                className={`absolute mr-[5px]  right-0 w-[calc(100%-40px)] h-[100%] ${is_online ? "hidden" : "flex"} justify-center items-center`}
              >
                <p className="text-[0.7rem] transition-all duration-300 ease-in-out">
                  OFFLINE
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
