import TripLayout from "@/components/Layout/TripLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <TripLayout>{children}</TripLayout>
    </div>
  );
}
