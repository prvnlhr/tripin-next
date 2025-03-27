import BackBtn from "@/components/Common/BackBtn";
import React from "react";
import UserGreeting from "./UserGreeting";
const SubHeader = () => {
  return (
    <div
      className="
        h-[80px] w-[98%] 
        flex items-center justify-start 
 b      order-green-300"
    >
      <div className="w-auto h-[70%] flex">
        <div className="w-[60px] flex justify-start aspect-square ">
          <BackBtn />
        </div>
        <UserGreeting />
      </div>
    </div>
  );
};

export default SubHeader;
