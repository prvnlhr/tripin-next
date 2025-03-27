import React from "react";
import IncomingRequestList from "./IncomingRideRequest/IncomingRequestList";
import PastRideList from "./PastRides/PastRideList";

const DriverDashboardPage = () => {
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
        <IncomingRequestList />
      </section>
      <section className="w-full h-[80%]">
        <PastRideList />
      </section>
    </div>
  );
};

export default DriverDashboardPage;
