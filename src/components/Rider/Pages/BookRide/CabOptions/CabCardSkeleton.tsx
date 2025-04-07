import React from "react";
interface CabCardSkeletonProps {
  animate: boolean;
}
const CabCardSkeleton: React.FC<CabCardSkeletonProps> = ({ animate }) => {
  const animateStyle = animate
    ? "animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
    : "";
  return (
    <div
      className={`
         w-[100%] h-[28%] 
         bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
         border-2 border-[#3C3C3C] rounded-[15px]
         grid
         grid-cols-[auto_minmax(0,1fr)]
         grid-rows-[100%]
         p-[5px] 
         ${animateStyle}
         `}
    >
      <div
        className="
          h-full aspect-square 
          flex items-center justify-center"
      >
        <div className="w-[70%] aspect-square bg-[#454849] rounded-[15px]"></div>
      </div>
      <div
        className="
          h-full flex-1
          grid
          grid-rows-[25px_minmax(0,1fr)_25px]
          gird-cols-[100%]"
      >
        <div className="w-[100%] h-[100%] flex items-end">
          <div className="w-[80%] h-[5px] rounded-full bg-[#454849]"></div>
        </div>
        <div className="w-[100%] h-[100%] flex items-center">
          <div className="w-[70%] h-[5px] rounded-full bg-[#454849]"></div>
        </div>
        <div className="w-[100%] h-[100%] flex items-start">
          <div className="w-[60%] h-[5px] rounded-full bg-[#454849]"></div>
        </div>
      </div>
    </div>
  );
};

export default CabCardSkeleton;
