import { RiderData } from "@/types/rider/riderTypes";
import React from "react";

interface UserGreetingProps {
  riderInfo: RiderData;
}
const UserGreeting: React.FC<UserGreetingProps> = ({ riderInfo }) => {
  return (
    <div className="w-auto h-full flex flex-col ">
      <p className="text-[1rem] font-light">Hi,</p>
      <p className="text-[1.2rem] font-normal">{riderInfo.name}</p>
    </div>
  );
};

export default UserGreeting;
