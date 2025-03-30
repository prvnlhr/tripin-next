"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DriverData } from "@/types/userType";
import { updateVerificationRequest } from "@/lib/services/admin/verificationRequestServices";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";

const CabTypeEnum = {
  AUTO: "AUTO",
  COMFORT: "COMFORT",
  ELITE: "ELITE",
};
interface VerificationRequestCardProps {
  verificationRequestDetails: DriverData;
}
const VerificationRequestCard: React.FC<VerificationRequestCardProps> = ({
  verificationRequestDetails,
}) => {
  const router = useRouter();
  const [cabType, setCabType] = useState<string>("");

  const [isLoading, setIsLoading] = useState<{
    state: boolean;
    type: string | null;
  }>({
    state: false,
    type: null,
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

  console.log(" message:", message);

  const handleCabTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCabType(e.target.value);
  };

  const handleAcceptRequest = async () => {
    if (!cabType) {
      setMessage({
        text: "Please assign a cab type before accepting the request.",
        type: "error",
      });
      return;
    }
    setIsLoading({ state: true, type: "accept" });
    setMessage({ text: "", type: null });

    try {
      const requestId = verificationRequestDetails.driver_id;
      await updateVerificationRequest(requestId, "approved", cabType);
      setMessage({
        text: "Driver request approved successfully.",
        type: "success",
      });
      router.push("/admin/dashboard");
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      setMessage({
        text: `Failed to approve driver request: ${errMessage}`,
        type: "error",
      });
      console.error("Error accepting request:", error);
    } finally {
      setIsLoading({ state: false, type: null });
    }
  };

  const handleRejectRequest = async () => {
    setIsLoading({ state: true, type: "reject" });
    setMessage({ text: "", type: null });
    try {
      const requestId = verificationRequestDetails.driver_id;
      await updateVerificationRequest(requestId, "rejected");
      setMessage({
        text: "Driver request rejected successfully.",
        type: "success",
      });
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      setMessage({
        text: `Failed to reject driver request: ${errMessage}`,
        type: "error",
      });
      console.error("Error rejecting request:", error);
    } finally {
      setIsLoading({ state: false, type: null });
    }
  };

  return (
    <div
      className="
       w-[100%]
       h-[80%]
       md:w-[400px] md:aspect-video
       grid  
       grid-cols-[100%] md:grid-cols-[50%_50%] 
       grid-rows-7 md:grid-rows-[70px_70px_70px_70px] 
       "
    >
      <div className="w-full h-full">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DRIVER NAME</p>
        <p className="text-[0.9rem] text-[white] font-light">
          {verificationRequestDetails.name}
        </p>
      </div>
      <div className="w-full h-full">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">DRIVER PHONE</p>
        <p className="text-[0.9rem] text-[white] font-light">
          {verificationRequestDetails.phone}
        </p>
      </div>
      <div className="w-full h-full">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">
          CAR MANUFACTURER
        </p>
        <p className="text-[0.9rem] text-[white] font-light">
          {verificationRequestDetails.car_name}
        </p>
      </div>
      <div className="w-full h-full">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">CAR MODEL</p>
        <p className="text-[0.8rem] text-[white] font-light">
          {verificationRequestDetails.car_model}
        </p>
      </div>
      <div className="w-full h-full">
        <p className="text-[0.9rem] text-[#B5E4FC] font-normal">
          LICENSE PLATE NUMBER
        </p>
        <p className="text-[0.9rem] text-[white] font-light">
          {verificationRequestDetails.license_plate}
        </p>
      </div>
      <div className="w-full h-full">
        <label className="w-full h-[50%] text-[0.9rem] text-[#B5E4FC] font-normal flex items-center">
          ASSIGN CAB TYPE
        </label>
        <select
          value={cabType}
          onChange={handleCabTypeChange}
          className="w-full h-[50%] flex items-center bg-transparent border-b border-[#505354]"
        >
          <option value="" className="bg-[#4c4c4c]">
            Select Cab Type
          </option>
          {Object.values(CabTypeEnum).map((type) => (
            <option
              key={type}
              value={type}
              className="bg-[#1F2224] text-[0.8rem] text-white"
            >
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-full flex items-end">
        <button
          onClick={handleRejectRequest}
          disabled={isLoading.state && isLoading.type === "reject"}
          type="button"
          className="flex h-[60%] ml-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#F04438] disabled:bg-[#4c4c4c]"
        >
          {isLoading.state && isLoading.type === "reject" ? (
            <Oval
              width="20"
              height="20"
              visible={true}
              color="white"
              secondaryColor="transparent"
              strokeWidth="3"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass="w-[70%] h-[70%] flex items-center justify-center"
            />
          ) : (
            <Icon icon="ep:close" className="h-[40%] w-[40%] text-[white]" />
          )}
        </button>
        <button
          disabled={isLoading.state && isLoading.type === "accept"}
          onClick={handleAcceptRequest}
          type="button"
          className="flex h-[60%] ml-[10px] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#32D583] disabled:bg-[#4c4c4c]"
        >
          {isLoading.state && isLoading.type === "accept" ? (
            <Oval
              width="20"
              height="20"
              visible={true}
              color="white"
              secondaryColor="transparent"
              strokeWidth="3"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass="w-[70%] h-[70%] flex items-center justify-center"
            />
          ) : (
            <Icon
              icon="heroicons:check-20-solid"
              className="h-[40%] w-[40%]  text-[white]"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationRequestCard;
