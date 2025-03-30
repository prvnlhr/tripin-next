"use client";
import AppLogo from "@/components/Common/AppLogo";
import { signOut } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
// import useUserSession from "@/hooks/useUserSession";

const MainHeader = () => {
  const router = useRouter();
  // const session = useUserSession();

  const handleSignOut = async () => {
    try {
      const { success } = await signOut();
      if (success) {
        router.push("/user/auth");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="flex h-[80px] w-full items-center justify-between border-blue-300 px-4">
      <div className="flex h-[60%] items-center">
        <AppLogo />
      </div>

      {/* {session && (
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2"
          aria-label="Sign out"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-[#B5E4FC] p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#46494A] text-white font-medium">
              {session?.session?.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </button>
      )} */}
    </div>
  );
};

export default MainHeader;
