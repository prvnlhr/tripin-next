"use client";
import { MarkerLibrary } from "@/types/mapType";
import { useEffect, useRef } from "react";

interface MarkerConfig {
  position: google.maps.LatLngLiteral;
  title?: string;
  icon: string; // URL to marker image
  zIndex?: number;
  onClick?: () => void;
}

interface UseMapMarkersProps {
  isLoaded: boolean;
  map: google.maps.Map | null;
  markers: MarkerConfig[];
}

export const useMapMarkers = ({
  isLoaded,
  map,
  markers = [],
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
        markersRef.current.forEach((marker) => {
          google.maps.event.clearInstanceListeners(marker);
          marker.map = null;
        });
        markersRef.current = [];

        // Add all markers from the array
        markers.forEach((markerConfig) => {
          const markerIcon = document.createElement("img");
          markerIcon.src = markerConfig.icon;
          markerIcon.style.width = "40px";
          markerIcon.style.height = "40px";

          const marker = new AdvancedMarkerElement({
            map,
            position: markerConfig.position,
            title: markerConfig.title,
            content: markerIcon,
            zIndex: markerConfig.zIndex,
          });

          if (markerConfig.onClick) {
            marker.addListener("click", markerConfig.onClick);
          }

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    updateMarkers();

    return () => {
      markersRef.current.forEach((marker) => {
        google.maps.event.clearInstanceListeners(marker);
        marker.map = null;
      });
    };
  }, [isLoaded, map, markers]);

  return { markers: markersRef.current };
};
