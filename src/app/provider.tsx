"use client";
import { ToastProvider } from "@/context/ToastContext";
import { MapProvider } from "@/context/MapProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <MapProvider>{children}</MapProvider>
    </ToastProvider>
  );
}
