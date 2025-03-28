"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRiderProfile } from "@/lib/services/user/profile/profileService";
import useUserSession from "@/hooks/useUserSession";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\- ]+$/, "Invalid phone number format"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const session = useUserSession();
  const onSubmit = async (data: ProfileFormData) => {
    const userId = session?.userId;
    if (!userId) return;
    setMessage(null);
    try {
      await createRiderProfile(userId, data);
      router.push("/user/trip/book-ride");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        text: "Failed to save profile. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3F7FA]">
      <div className="w-[90%] sm:w-[400px] bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4">Complete Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="text-[black] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="text-[black] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
