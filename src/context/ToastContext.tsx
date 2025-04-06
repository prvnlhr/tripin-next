"use client";
import { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

type ToastType = "loading" | "success" | "error" | "info" | "default";

// Define our custom toast parameters without relying on ToastOptions
interface ShowToastParams {
  type?: ToastType;
  title: string;
  description?: string;
  toastId?: string | number;
  persistent?: boolean;
  showCloseButton?: boolean;
  duration?: number;
  // Add any other Sonner-specific options you need here
  className?: string;
  // style?: React.CSSProperties;
  style?: {
    background?: string;
    color?: string;
    borderColor?: string;
    iconColor?: string; // New icon color control

    // Include any other CSS properties you need
    // [key: string]: any;
  };
}

interface ToastContextType {
  showToast: (params: ShowToastParams) => string | number;
  dismissToast: (toastId?: string | number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = ({
    type = "default",
    title,
    description,
    toastId,
    persistent = false,
    showCloseButton = true,
    duration = 4000,
    style,
    ...restOptions
  }: ShowToastParams) => {
    const options = {
      description,
      id: toastId,
      duration: persistent ? Infinity : duration,
      closeButton: showCloseButton,
      ...(style && { style }), 
      ...restOptions, // Spread any additional options
    };

    switch (type) {
      case "loading":
        return toast.loading(title, options);
      case "success":
        return toast.success(title, options);
      case "error":
        return toast.error(title, options);
      case "info":
        return toast.info(title, options);
      default:
        return toast(title, options);
    }
  };

  const dismissToast = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
