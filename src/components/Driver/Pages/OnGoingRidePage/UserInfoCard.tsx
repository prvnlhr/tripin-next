import React from "react";

const UserInfoCard = () => {
  return (
    <div
      className="
       w-[60%] h-[30%]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[30px]
       grid
       grid-cols-[100%]
       grid-rows-[minmax(0,1fr)_minmax(0,1fr)]
       p-[20px]"
    >
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">RIDERS NAME</p>
        <p className="text-[0.8rem] text-[white] font-light">Pepper Pots</p>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-evenly">
        <p className="text-[0.8rem] text-[#B5E4FC] font-light">PHONE</p>
        <p className="text-[0.8rem] text-[white] font-light">9358583070 </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
