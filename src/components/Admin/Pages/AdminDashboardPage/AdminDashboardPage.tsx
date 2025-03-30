import React from "react";
import VerificationRequestList from "./VerificationRequest/VerificationRequestList";
import VerifiedDriverList from "./VerifiedDriver/VerifiedDriverList";
import { DriverData } from "@/types/userType";

interface AdminDashboardPageProps {
  dashboardData: {
    unverifiedDrivers: DriverData[];
    verifiedDrivers: DriverData[];
  };
}
const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  dashboardData,
}) => {
  const { unverifiedDrivers, verifiedDrivers } = dashboardData;

  return (
    <div
      className="
       w-full h-full overflow-y-scroll
       border-green-500"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <section className="w-full h-[80%]">
        <VerificationRequestList verificationRequestData={unverifiedDrivers} />
      </section>
      <section className="w-full h-[80%]">
        <VerifiedDriverList verifiedDrivers={verifiedDrivers} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
