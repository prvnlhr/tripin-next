import React from "react";

const DriverDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center px-[20px] py-[10px]">
      {children}
    </div>
  );
};

export default DriverDashboardLayout;
