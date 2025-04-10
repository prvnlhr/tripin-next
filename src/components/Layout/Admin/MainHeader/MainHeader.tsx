"use client";
import AppLogo from "@/components/Common/AppLogo";
import { signOut } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import useUserSession from "@/hooks/useUserSession";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

const MainHeader = () => {
  const router = useRouter();
  const session = useUserSession();

  const [isSigningOut, setIsSigningOut] = useState<boolean>();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { success } = await signOut();
      if (success) {
        router.push("/user/auth");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-[80px] w-full items-center justify-between border-blue-300 px-4">
      <div className="flex h-[60%] items-center">
        <AppLogo />
      </div>

      {session && (
        <div className="ml-[10px] h-full w-auto flex flex-col justify-center border-red-500">
          <button
            onClick={handleSignOut}
            className="w-auto h-[40px] cursor-pointer flex items-center p-[2px] rounded-full  hover:border-white border border-[#3C3C3C]"
          >
            <p className="text-[0.7rem] ml-[10px] whitespace-nowrap">
              Sign Out
            </p>
            <div className="h-[100%] aspect-square flex cursor-pointer items-center justify-center ml-[10px] rounded-full bg-[#47494A]">
              {isSigningOut ? (
                <Oval
                  visible={true}
                  color="white"
                  secondaryColor="transparent"
                  strokeWidth="3"
                  ariaLabel="oval-loading"
                  height="70%"
                  width="70%"
                  wrapperClass="flex items-center justify-center"
                />
              ) : (
                <p className="text-[#B5E4FC] text-[0.8rem] font-light">
                  {session?.userName.charAt(0).toUpperCase()}
                  <span className="text-[0.5rem]">
                    {session?.userName?.split(" ")[1]?.charAt(0)?.toUpperCase()}
                  </span>
                </p>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MainHeader;
