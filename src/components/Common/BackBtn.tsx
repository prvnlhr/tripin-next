"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex h-[70%] aspect-square cursor-pointer items-center justify-center rounded-full bg-white"
    >
      <Icon
        icon="bi:arrow-up"
        className="h-[40%] w-[40%] -rotate-90 text-[#000000]"
      />
    </button>
  );
};

export default BackBtn;
