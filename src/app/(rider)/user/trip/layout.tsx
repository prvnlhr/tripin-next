import UserTripLayout from "@/components/Layout/User/UserTripLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <UserTripLayout>{children}</UserTripLayout>
    </div>
  );
}
