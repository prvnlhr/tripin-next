export const driverRideStatus = [
  {
    label1: "Accepted",
    label2: "Driver accepted your ride request",
    statusValue: "DRIVER_ASSIGNED",
    icon: "heroicons:check-20-solid",
    border: "border-[#6CE9A6]",
  },
  {
    label1: "Arrived",
    label2: "Driver arrived at pickup",
    statusValue: "REACHED_PICKUP",
    icon: "teenyicons:pin-alt-solid",
    border: "border-[#4F85F3]",
  },
  {
    label1: "Trip Started",
    label2: "Driver initiated the trip",
    statusValue: "TRIP_STARTED",
    icon: "tabler:location-filled",
    border: "border-[#FDB022]",
  },
  {
    label1: "Trip End",
    label2: "Driver reached the dropff point",
    statusValue: "TRIP_ENDED",
    icon: "material-symbols-light:location-on-rounded",
    border: "border-[#907AEA]",
  },
];

export const riderRideStatus = [
  {
    label1: "Request",
    label2: "Accepted",
    statusValue: "DRIVER_ASSIGNED",
    icon: "heroicons:check-20-solid",
    ringColor: "border-[#6CE9A6]",
  },
  {
    label1: "Reached",
    label2: "Pickup",
    statusValue: "REACHED_PICKUP",
    icon: "teenyicons:pin-alt-solid",
    ringColor: "border-[#4F85F3]",
  },
  {
    label1: "Trip",
    label2: "Start",
    statusValue: "TRIP_STARTED",
    icon: "tabler:location-filled",
    ringColor: "border-[#FDB022]",
  },
  {
    label1: "Trip",
    label2: "End",
    statusValue: "TRIP_ENDED",
    icon: "material-symbols-light:location-on-rounded",
    ringColor: "border-[#907AEA]",
  },
];
