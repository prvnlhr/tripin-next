"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signInWithMagicLink } from "@/actions/auth/user/auth";
import authBannerImg from "../../../public/assets/banners/authPageBanner.png";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import AppLogo from "@/components/Common/AppLogo";

const ROLE_HEADER_MESSAGES = {
  rider: {
    line1: "Let's get you",
    line2: "signed in",
  },
  driver: {
    line1: "Sigin to Driver",
    line2: "partner portal",
  },
  admin: {
    line1: "Sigin to access",
    line2: "admin portal",
  },
};

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function AuthForm() {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const getCurrentRole = () => {
    if (pathname.includes("/admin/auth")) return "admin";
    if (pathname.includes("/driver/auth")) return "driver";
    return "rider";
  };

  const role = getCurrentRole();
  const { line1, line2 } = ROLE_HEADER_MESSAGES[role];

  const handleMagicLinkRequest = async ({ email }: EmailFormData) => {
    setNotification(null);
    try {
      const { success, message } = await signInWithMagicLink(email, role);

      setNotification({
        message: success
          ? "Magic link sent! Check your email."
          : message || "Failed to send magic link",
        variant: success ? "success" : "error",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      setNotification({
        message: "An unexpected error occurred",
        variant: "error",
      });
    }
  };

  // UI remains exactly the same as before
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full md:w-[70%] md:h-[70%] flex flex-col md:flex-row">
        <div className="relative w-[100%] md:w-[60%] h-[35%] md:h-[100%] rounded-[0px] md:rounded-[20px] overflow-hidden">
          <Image
            src={authBannerImg}
            fill
            className="object-cover"
            priority={true}
            alt="Authentication banner"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-[100%] md:w-[40%] h-[65%] md:h-[100%]">
          <div className="w-[85%] h-[50px] flex items-center">
            <div className="w-auto h-[60%] flex items-center">
              <AppLogo />
            </div>
          </div>
          <div className="w-[80%] h-[calc(100%-50px)] grid grid-cols-[100%] grid-rows-[70px_50px_auto]">
            {/* row-1 */}
            <div className="w-[100%] h-[100%] flex items-center">
              <p className="font-light text-[1.7rem] leading-tight">
                {line1}
                <br />
                {line2}
                <span className="text-[#B5E4FC]">.</span>
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
              onSubmit={handleSubmit(handleMagicLinkRequest)}
              className="w-[100%] h-auto"
            >
              <div className="w-full h-auto grid grid-cols-[100%] grid-rows-[auto]">
                {/* input group */}
                <div className="w-full h-auto">
                  <label className="w-full h-[30px] flex items-center text-[0.9rem] text-[#B5E4FC] font-normal">
                    EMAIL ADDRESS
                  </label>
                  <div className="h-[40px] border-b border-[#505354]">
                    <div className="flex-1 h-full flex items-center">
                      <input
                        {...register("email")}
                        className="h-full flex-1 outline-none font-light text-white text-[0.8rem] bg-transparent"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                        autoComplete="email"
                      />
                      <div className="h-full aspect-square flex items-center justify-center">
                        <Icon
                          icon="tabler:mail-filled"
                          className="text-[#B5E4FC] w-[40%] h-[40%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[30px] flex items-center">
                    {errors.email && (
                      <p className="text-red-500 text-[0.75rem] font-medium">
                        {errors.email.message}
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
}
