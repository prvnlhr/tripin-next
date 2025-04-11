import React from "react";
import IncomingRequestList from "./IncomingRideRequest/IncomingRequestList";
import PastRideList from "./PastRides/PastRideList";
import { DashboardData } from "@/types/driver/driverTypes";

interface DriverDashboardPageProps {
  dashboardData: DashboardData;
}
const DriverDashboardPage: React.FC<DriverDashboardPageProps> = ({
  dashboardData,
}) => {
  return (
    <div
      className="
       w-[100%] h-full overflow-y-scroll
       border-green-500"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <section className="w-full md:h-[80%]">
        <IncomingRequestList incomingRequests={dashboardData?.rideRequests} />
      </section>
      <section className="w-full md:h-[80%]">
        <PastRideList pastRides={dashboardData?.pastRides} />
      </section>
    </div>
  );
};

export default DriverDashboardPage;
