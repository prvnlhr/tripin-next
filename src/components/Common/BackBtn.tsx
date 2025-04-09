"use client";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
const BackBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const isOnGoingRidePage = pathSegments.includes("ongoing-ride");

  return (
    <button
      type="button"
      onClick={() => (isOnGoingRidePage ? router.push("/") : router.back())}
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
