"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { siginWithMagicLink } from "@/actions/auth/user/auth";
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "prvnlhr522@gmail.com" },
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const onSubmit = async (data: SignInFormData) => {
    setMessage(null);
    try {
      const result = await siginWithMagicLink(data.email);
      if (result.success) {
        setMessage({
          text: "Check your email for the magic link!",
          type: "success",
        });
      } else {
        setMessage({
          text: result.message || "Failed to send magic link",
          type: "error",
        });
      }
    } catch (error) {
      console.log(" error:", error);
      setMessage({
        text: "An unexpected error occurred",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3F7FA]">
      <div className="w-[90%] sm:w-[300px] bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
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

          <div className="space-y-2 mb-[10px]">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="text-[black] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Sending magic link..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
