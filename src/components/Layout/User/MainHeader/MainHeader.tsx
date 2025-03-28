"use client";
import AppLogo from "@/components/Common/AppLogo";
import React from "react";
import { signOut } from "@/actions/auth/user/auth";
import useUserSession from "@/hooks/useUserSession";
const MainHeader = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  const session = useUserSession();
  console.log(" session:", session);

  return (
    <div className="flex h-[80px] w-[100%] items-center justify-start border-blue-300">
      <div className="flex h-[60%] w-auto items-center justify-start ">
        <AppLogo />
      </div>
      <div
        onClick={handleSignOut}
        className="flex-1 h-full flex items-center justify-end"
      >
        <div
          className="
            h-[60%] aspect-square mr-[1%]
            flex items-center justify-center
            rounded-full 
            border-[2px] border-[#B5E4FC]
            p-[2px]"
        >
          <div
            className="
              h-full w-full
              rounded-full
              bg-[#46494A]"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
