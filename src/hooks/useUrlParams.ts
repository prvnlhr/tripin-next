"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current params as object
  const currentParams = Object.fromEntries(searchParams.entries());

  /**
   * Set or update URL parameters
   * @param params - Key-value pairs to set/update
   */

  const setParams = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        newParams.set(key, value);
      });

      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  /**
   * Remove parameters from URL
   * @param keys - Array of keys to remove (empty array removes all)
   */

  const removeParams = useCallback(
    (keys: string[] = []) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (keys.length === 0) {
        router.push("?");
        return;
      }

      const shouldRemoveRideOption =
        newParams.has("rideOption") &&
        keys.some((k) => k === "src" || k === "dest");

      keys.forEach((key) => newParams.delete(key));

      if (shouldRemoveRideOption) {
        newParams.delete("rideOption");
      }

      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    params: currentParams,
    setParams,
    removeParams,
  };
};
