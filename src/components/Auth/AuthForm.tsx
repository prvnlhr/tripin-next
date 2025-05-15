"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signInWithMagicLink } from "@/actions/auth/auth";
import authBannerImg1 from "../../../public/assets/banners/authPageBanner_rider.jpg";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import AppLogo from "@/components/Common/AppLogo";
import Link from "next/link";
import SubmitBtn from "../Common/SubmitBtn";
// 
const ROLE_HEADER_MESSAGES = {
  rider: {
    line1: "Let's get you",
    line2: "signed in",
  },
  driver: {
    line1: "Sign in to Driver",
    line2: "partner portal",
  },
  admin: {
    line1: "Sign in to access",
    line2: "admin portal",
  },
};

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const headerHeaderLinks = [
  {
    label: "Rider",
    href: "/user/auth",
    role: "rider",
  },
  {
    label: "Driver",
    href: "/driver/auth",
    role: "driver",
  },
  {
    label: "Admin",
    href: "/admin/auth",
    role: "admin",
  },
];

type EmailFormData = z.infer<typeof emailSchema>;

type NotificationState =
  | {
      type: "success";
      message: string;
    }
  | {
      type: "unauthorized";
      message: string;
      redirectLink: string;
      role: string;
    }
  | {
      type: "error";
      message: string;
    };

export default function AuthForm() {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const getCurrentRole = (): "rider" | "driver" | "admin" => {
    if (pathname.includes("/admin/auth")) return "admin";
    if (pathname.includes("/driver/auth")) return "driver";
    return "rider";
  };

  const role = getCurrentRole();
  const { line1, line2 } = ROLE_HEADER_MESSAGES[role];

  const handleMagicLinkRequest = async ({ email }: EmailFormData) => {
    setNotification(null);
    try {
      const result = await signInWithMagicLink(email, role);

      if (!result.success) {
        if (result.errorType === "WRONG_ROLE") {
          setNotification({
            type: "unauthorized",
            message: "Unauthorized access",
            redirectLink: result.correctPortal,
            role: result.correctRole,
          });
        } else {
          setNotification({
            type: "error",
            message: result.message || "Failed to send magic link",
          });
        }
        return;
      }

      setNotification({
        type: "success",
        message: "Check your email for the sign in link",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      setNotification({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-[70px] md:h-[15%] flex justify-center items-center">
        {headerHeaderLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`${getCurrentRole() === link.role ? "border border-[#3C3C3C]" : "border border-transparent"}  
            w-auto h-auto px-[20px] py-[5px] 
            flex items-center justify-center
            text-[0.8rem] font-normal rounded
            mx-[5px]
            hover:bg-[#47494A]
          `}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="w-full h-[calc(100%-70px)] md:w-[80%] md:h-[70%] flex flex-col md:flex-row">
        {/* Left Banner Image */}
        <div className="relative w-[100%] md:w-[60%] h-[35%] md:h-[100%] rounded-[0px] md:rounded-[20px] overflow-hidden">
          <Image
            src={authBannerImg1}
            fill
            className="object-cover"
            priority={true}
            alt="Authentication banner"
          />
        </div>

        {/* Right Auth Form */}
        <div className="flex flex-col items-center justify-center w-[100%] md:w-[40%] h-[65%] md:h-[100%]">
          {/* Logo */}
          <div className="w-[85%] h-[50px] flex items-center">
            <div className="w-auto h-[60%] flex items-center">
              <AppLogo />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-[80%] h-[calc(100%-50px)] grid grid-cols-[100%] grid-rows-[70px_70px_auto]">
            {/* Header */}
            <div className="w-[100%] h-[100%] flex items-center">
              <p className="font-light text-[1.7rem] leading-tight">
                {line1}
                <br />
                {line2}
                <span className="text-[#B5E4FC]">.</span>
              </p>
            </div>

            {/* Notification Area */}
            <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
              {notification && (
                <>
                  {/* Message for all types */}
                  <div
                    className={`w-full h-[50%] flex items-center px-[10px] rounded text-[0.8rem] ${
                      notification.type === "success"
                        ? "text-green-500 border-green-500 bg-green-500/10"
                        : notification.type === "error" ||
                            notification.type === "unauthorized"
                          ? "text-red-500 border-red-500 bg-red-500/10"
                          : ""
                    }`}
                  >
                    {notification.message}
                  </div>

                  {/* Additional link for unauthorized */}
                  {notification.type === "unauthorized" && (
                    <div className="w-full flex items-center justify-center h-[50%]">
                      <Link
                        href={notification.redirectLink}
                        className="w-full h-full underline flex px-[10px] items-center justify-start text-[0.8rem] font-normal"
                      >
                        Click to sign in as {notification.role}
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(handleMagicLinkRequest)}
              className="w-[100%] h-auto"
            >
              <div className="w-full h-auto grid grid-cols-[100%] grid-rows-[auto]">
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
                <SubmitBtn isSubmitting={isSubmitting} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
