import DriverDashboardLayout from "@/components/Layout/Driver/DriverDashboardLayout";
import React from "react";

const DriverLayout = ({ children }: { children: React.ReactNode }) => {
  return <DriverDashboardLayout>{children}</DriverDashboardLayout>;
};

export default DriverLayout;
