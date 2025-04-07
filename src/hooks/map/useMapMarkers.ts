// hooks/useMapMarkers.ts
"use client";

import { MarkerLibrary } from "@/types/mapType";
import { useEffect, useRef } from "react";

interface UseMapMarkersProps {
  isLoaded: boolean;
  map: google.maps.Map | null;
  srcCoords: google.maps.LatLngLiteral | null;
  destCoords: google.maps.LatLngLiteral | null;
  srcAddress: string | null;
  destAddress: string | null;
}

export const useMapMarkers = ({
  isLoaded,
  map,
  srcCoords,
  destCoords,
  srcAddress,
  destAddress,
}: UseMapMarkersProps) => {
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!isLoaded || !map) return;

    const updateMarkers = async () => {
      try {
        const markerLib = (await google.maps.importLibrary(
          "marker"
        )) as MarkerLibrary;
        const { AdvancedMarkerElement } = markerLib;

        // Clear existing markers
        markersRef.current.forEach((marker) => (marker.map = null));
        markersRef.current = [];

        // Add source marker if exists
        if (srcCoords) {
          const srcIcon = document.createElement("img");
          srcIcon.src = "/assets/map/sourceMarker.png";
          srcIcon.style.width = "40px";
          srcIcon.style.height = "40px";

          markersRef.current.push(
            new AdvancedMarkerElement({
              map,
              position: srcCoords,
              title: srcAddress
                ? decodeURIComponent(srcAddress)
                : "Pickup location",
              content: srcIcon,
            })
          );
        }

        // Add destination marker if exists
        if (destCoords) {
          const destIcon = document.createElement("img");
          destIcon.src = "/assets/map/destMarker.png";
          destIcon.style.width = "40px";
          destIcon.style.height = "40px";

          markersRef.current.push(
            new AdvancedMarkerElement({
              map,
              position: destCoords,
              title: destAddress
                ? decodeURIComponent(destAddress)
                : "Drop-off location",
              content: destIcon,
            })
          );
        }
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    updateMarkers();

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
    };
  }, [isLoaded, map, srcCoords, destCoords, srcAddress, destAddress]);

  return { markers: markersRef.current };
};
