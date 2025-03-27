"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import { createContext, useContext, ReactNode, useMemo } from "react";

type MapContextType = {
  isLoaded: boolean;
};
const libraries: ("places" | "geometry" | "marker")[] = [
  "places",
  "geometry",
  "marker",
];

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    language: "en",
    region: "IN",
  });

  const value = useMemo(() => ({ isLoaded }), [isLoaded]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
