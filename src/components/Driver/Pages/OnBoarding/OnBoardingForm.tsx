"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import useUserSession from "@/hooks/useUserSession";
import authBannerImg from "../../../../../public/assets/banners/authPageBanner.png";
import Image from "next/image";
import AppLogo from "@/components/Common/AppLogo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createProfile } from "@/lib/services/profile/profileServices";
import SubmitBtn from "@/components/Common/SubmitBtn";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\- ]+$/, "Invalid phone number format"),
  car_name: z.string().max(50, "Car name is too long").nullable().optional(),
  car_model: z.string().max(50, "Car model is too long").nullable().optional(),
  license_plate: z
    .string()
    .max(20, "License plate is too long")
    .nullable()
    .optional(),
  cab_type: z.string().max(50, "Cab type is too long").nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const OnBoardingForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const session = useUserSession();
  const onSubmit = async (data: ProfileFormData) => {
    const userId = session.session?.userId;
    if (!userId) return;
    setNotification(null);
    try {
      await createProfile("driver", userId, data);
      router.push("/driver/dashboard");
    } catch (error) {
      console.error("Profile update error:", error);
      setNotification({
        message: "Failed to save profile. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full md:w-[70%] md:h-[70%] flex flex-col md:flex-row">
        <div className="relative w-[100%] md:w-[60%] h-[35%] md:h-[100%] rounded-[0px] md:rounded-[20px] overflow-hidden">
          <Image
            src={authBannerImg}
            fill
            priority={true}
            alt="Authentication banner"
            className="object-cover"
          />
        </div>

        <div
          className="
          flex flex-col items-center justify-center  
          w-[100%] md:w-[40%] 
          h-[65%] md:h-[100%] border-red-600"
        >
          <section className="w-[85%] h-[50px] flex items-center">
            <div className="w-auto h-[60%] flex items-center">
              <AppLogo />
            </div>
          </section>

          <section
            className="
            w-[85%] h-[calc(100%-50px)] 
            grid
            grid-cols-[100%]
            grid-rows-[70px_50px_auto]"
          >
            {/* row-1 */}
            <div className="w-[100%] h-[100%] flex items-center">
              <p className="font-light text-[1.7rem] leading-tight">
                Fill the Detail to
                <br />
                get started<span className="text-[#B5E4FC]">.</span>
              </p>
            </div>
            {/* row-2 */}
            <div className="w-[100%] h-[100%] flex items-center">
              {notification && (
                <div
                  className={`w-auto py-1 px-4 rounded text-[0.75rem] border ${
                    notification.variant === "success"
                      ? "text-green-500 border-green-500 bg-green-500/10"
                      : "text-red-500 border-red-500 bg-red-500/10"
                  }`}
                >
                  {notification.message}
                </div>
              )}
            </div>
            {/* row-3 */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-[100%] flex-1 flex flex-col border-green-500"
            >
              {/* Inputs fields */}
              <div
                className="
                 w-full h-full 
                 grid
                 grid-cols-[50%_50%]
                 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
              >
                {/* input group - Name */}
                <div className="w-[95%] flex flex-col h-full  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    NAME
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("name")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Enter your name"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square items-center justify-center hidden">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.name && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone input group */}
                <div className="w-[95%] flex flex-col h-full  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    PHONE
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("phone")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square hidden items-center justify-center">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.phone && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Car Manufacturer group */}
                <div className="w-[95%]  h-full flex flex-col  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    CAR MANUFACTURER
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("car_name")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Ex. Skoda, Hyundai"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square hidden items-center justify-center">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.car_name && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.car_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Car Model group */}
                <div className="w-[95%] h-full flex flex-col  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    CAR MODEL
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("car_model")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Ex. Kaylaq, Creta"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square hidden items-center justify-center">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-[95%] h-[30px] flex items-center">
                    {errors.car_model && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.car_model.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Car Licence plate */}
                <div className="w-[95%] h-full flex flex-col  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    LICENSE PLATE NO.
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("license_plate")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Ex. MH 04 AB 0000"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square hidden items-center justify-center">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.license_plate && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.license_plate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Car Type plate */}
                <div className="w-[95%] h-full flex flex-col  border-red-500">
                  <label className="w-full h-[20px] flex items-center text-[0.8rem] text-[#B5E4FC] font-normal">
                    CAR TYPE
                  </label>
                  <div className="w-full flex-1 border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("cab_type")}
                        className="w-full h-full bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Hatchback, Sedan, SUV"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square hidden items-center justify-center">
                        <Icon
                          icon="tdesign:user-1-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.cab_type && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.cab_type.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* submit button */}
              <div className="w-[100%] h-[80px] flex items-center">
                <SubmitBtn isSubmitting={isSubmitting} />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingForm;
