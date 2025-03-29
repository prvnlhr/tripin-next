"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRiderProfile } from "@/lib/services/user/profile/profileService";
import useUserSession from "@/hooks/useUserSession";
import authBannerImg from "../../../../../public/assets/banners/authPageBanner.png";
import Image from "next/image";
import AppLogo from "@/components/Common/AppLogo";
import { Icon } from "@iconify/react/dist/iconify.js";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\- ]+$/, "Invalid phone number format"),
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
    const userId = session?.session?.userId;
    if (!userId) return;
    setNotification(null);
    try {
      await createRiderProfile(userId, data);
      router.push("/user/trip/book-ride");
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
            className="object-cover"
            alt="Authentication banner"
          />
        </div>

        <div
          className="
       flex flex-col items-center justify-center  
       w-[100%] md:w-[40%] 
       h-[65%] md:h-[100%] border-red-600"
        >
          <div className="w-[85%] h-[50px] flex items-center">
            <div className="w-auto h-[60%] flex items-center">
              <AppLogo />
            </div>
          </div>
          <div
            className="
            w-[80%] h-[calc(100%-50px)] 
            grid
            grid-cols-[100%]
            grid-rows-[70px_50px_auto]"
          >
            {/* row-1 */}
            <div className="w-[100%] h-[100%] flex items-center">
              <p className="font-light text-[1.7rem] leading-tight">
                Tell us more
                <br />
                about you<span className="text-[#B5E4FC]">.</span>
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
              className="w-[100%] h-auto  border-green-500"
            >
              <div
                className="
                 w-full h-auto 
                 grid
                 grid-cols-[100%]
                 grid-rows-[auto_auto]"
              >
                {/* input group - Name */}
                <div className="w-full h-auto  border-red-500">
                  <label className="w-full h-[30px] flex items-center text-[0.9rem] text-[#B5E4FC] font-normal">
                    NAME
                  </label>
                  <div className="h-[40px] border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("name")}
                        className="flex-1 bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square flex  items-center justify-center">
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
                <div className="w-full h-auto  border-red-500">
                  <label className="w-full h-[30px] flex items-center text-[0.9rem] text-[#B5E4FC] font-normal">
                    PHONE
                  </label>
                  <div className="h-[40px] border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("phone")}
                        className="flex-1 bg-transparent outline-none font-light text-[0.8rem]"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                      <div className="h-full aspect-square flex  items-center justify-center">
                        <Icon
                          icon="solar:phone-bold"
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
              </div>
              <div className="w-[100%] h-[80px] flex items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[50px] w-[50px] flex items-center justify-center rounded-full bg-white disabled:opacity-50 cursor-pointer"
                >
                  <Icon
                    icon="bi:arrow-up"
                    className="h-[40%] w-[40%] rotate-90 text-black"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingForm;
