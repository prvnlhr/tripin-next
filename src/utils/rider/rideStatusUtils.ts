import { RideStatus } from "@/types/rider/ride/rideTypes";

export const createToastInfo = (responseStatus: string) => {
  const statusMessages = {
    DRIVER_ASSIGNED: {
      title: "Driver Assigned",
      desc: "Your driver is on the way to pick you up.",
      color: "#027A48",
      borderColor: "#027A48",
      background: "#A6F4C5",
      iconColor: "#027A48",
    },
    REACHED_PICKUP: {
      title: "Driver Has Arrived",
      desc: "Your driver is waiting at the pickup location.",
      color: "#4F85F3",
      borderColor: "#4F85F3",
      background: "#B9E6FE",
      iconColor: "#4F85F3",
    },
    TRIP_STARTED: {
      title: "Trip Started",
      desc: "You're on your way. Sit back and enjoy the ride!",
      color: "#F79009",
      borderColor: "#F79009",
      background: "#FEF0C7",
      iconColor: "#F79009",
    },
    TRIP_ENDED: {
      title: "Trip Completed",
      desc: "You've arrived at your destination. Hope you had a great ride!",
      color: "#907AEA",
      borderColor: "#907AEA",
      background: "#F4EBFF",
      iconColor: "#907AEA",
    },
  };

  return statusMessages[responseStatus as keyof typeof statusMessages];
};

export const getStepsCompleted = (status: RideStatus | undefined): number => {
  if (!status) return 0;

  switch (status) {
    case "DRIVER_ASSIGNED":
      return 1;
    case "REACHED_PICKUP":
      return 2;
    case "TRIP_STARTED":
      return 3;
    case "TRIP_ENDED":
      return 4;
    case "COMPLETED":
    case "CANCELLED":
      return 5;
    default:
      return 0;
  }
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
