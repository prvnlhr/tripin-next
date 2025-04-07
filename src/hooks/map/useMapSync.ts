// hooks/useMapSync.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface UseMapSyncProps {
  isLoaded: boolean;
  map: google.maps.Map | null;
}

export const useMapSync = ({ isLoaded, map }: UseMapSyncProps) => {
  const searchParams = useSearchParams();
  const [srcCoords, setSrcCoords] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [destCoords, setDestCoords] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    {
      lat: 20.5937,
      lng: 78.9629,
    }
  );

  // Parse coordinates from URL
  useEffect(() => {
    const src = searchParams.get("src");
    const dest = searchParams.get("dest");

    setSrcCoords(
      src
        ? {
            lat: parseFloat(src.split(",")[0]),
            lng: parseFloat(src.split(",")[1]),
          }
        : null
    );

    setDestCoords(
      dest
        ? {
            lat: parseFloat(dest.split(",")[0]),
            lng: parseFloat(dest.split(",")[1]),
          }
        : null
    );
  }, [searchParams]);

  // Get user location if available
  useEffect(() => {
    if (isLoaded && !map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        },
        { timeout: 10000 }
      );
    }
  }, [isLoaded, map]);

  // Fit map to bounds
  const updateBounds = useCallback(
    (map: google.maps.Map, directions: google.maps.DirectionsResult | null) => {
      if (!srcCoords && !destCoords) {
        map.setCenter(defaultCenter);
        map.setZoom(12);
        return;
      }

      const bounds = new google.maps.LatLngBounds();

      if (directions) {
        directions.routes[0].legs.forEach((leg) => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
      } else {
        if (srcCoords) bounds.extend(srcCoords);
        if (destCoords) bounds.extend(destCoords);
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        if (!directions) {
          const zoom = map.getZoom() || 12;
          map.setZoom(Math.min(zoom, 14));
        }
      }
    },
    [srcCoords, destCoords, defaultCenter]
  );

  return {
    srcCoords,
    destCoords,
    defaultCenter,
    srcAddress: searchParams.get("srcAddress"),
    destAddress: searchParams.get("destAddress"),
    rideOption: searchParams.get("rideOption") === "true",
    updateBounds,
  };
};
