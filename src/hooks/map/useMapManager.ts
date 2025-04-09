"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { MarkerLibrary } from "@/types/mapType";
import { useUrlParams } from "../useUrlParams";

// STRICTLY define which params represent coordinates
const COORDINATE_KEYS = ["src", "dest", "driver"] as const;
type CoordinateKey = (typeof COORDINATE_KEYS)[number];

// Marker configuration for each coordinate type
const MARKER_CONFIG: Record<
  CoordinateKey,
  {
    icon: string;
    title: (address?: string) => string;
    zIndex: number;
  }
> = {
  src: {
    icon: "/assets/map/sourceMarker.png",
    title: (address) => address || "Pickup location",
    zIndex: 100,
  },
  dest: {
    icon: "/assets/map/destMarker.png",
    title: (address) => address || "Drop-off location",
    zIndex: 100,
  },
  driver: {
    icon: "/assets/map/driverMarker.png",
    title: () => "Driver location",
    zIndex: 90,
  },
};

export const useMapManager = ({
  isLoaded,
  map,
}: {
  isLoaded: boolean;
  map: google.maps.Map | null;
}) => {
  const { params } = useUrlParams();
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();
  const [defaultCenter] = useState<google.maps.LatLngLiteral>({
    lat: 26.2389,
    lng: 73.0243,
  });

  // Parse coordinates from a string "lat,lng"
  const parseCoords = useCallback((coordStr?: string) => {
    if (!coordStr) return null;
    const [lat, lng] = coordStr.split(",").map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  }, []);

  // Special handling for src/dest directions
  const { srcCoords, destCoords } = useMemo(
    () => ({
      srcCoords: parseCoords(params.src),
      destCoords: parseCoords(params.dest),
    }),
    [params.src, params.dest, parseCoords]
  );

  // Calculate directions (only between src and dest)
  useEffect(() => {
    if (!isLoaded || !map || !srcCoords || !destCoords) {
      setDirections(undefined);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: srcCoords,
        destination: destCoords,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.warn("Directions request failed:", status);
          setDirections(undefined);
        }
      }
    );
  }, [isLoaded, map, srcCoords, destCoords]);

  // Combined marker creation and update logic
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

        // Single loop: Process params AND create markers
        for (const key of COORDINATE_KEYS) {
          const coords = parseCoords(params[key]);
          if (!coords) continue;

          const config = MARKER_CONFIG[key];
          const addressParam = `${key}Address`;
          const address = params[addressParam]
            ? decodeURIComponent(params[addressParam])
            : undefined;

          // Create marker directly
          const markerIcon = document.createElement("img");
          markerIcon.src = config.icon;
          markerIcon.style.width = "40px";
          markerIcon.style.height = "40px";

          const marker = new AdvancedMarkerElement({
            map,
            position: coords,
            title: config.title(address),
            content: markerIcon,
            zIndex: config.zIndex,
          });

          markersRef.current.push(marker);
        }
        updateBounds();
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
  }, [isLoaded, map, params]);

  // Update map bounds to fit all visible elements
  const updateBounds = useCallback(() => {
    if (!map || !isLoaded) return;

    const bounds = new google.maps.LatLngBounds();
    let hasContent = false;

    // Include direction points if available
    if (directions) {
      directions.routes[0].legs.forEach((leg) => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
        hasContent = true;
      });
    }

    // Include all markers
    markersRef.current.forEach((marker) => {
      if (marker.position) {
        bounds.extend(marker.position);
        hasContent = true;
      }
    });

    if (hasContent && !bounds.isEmpty()) {
      const padding = 60;
      map.fitBounds(bounds, padding);

      // Ensure reasonable zoom level
      const listener = google.maps.event.addListenerOnce(
        map,
        "bounds_changed",
        () => {
          const zoom = map.getZoom() || 12;
          map.setZoom(Math.min(zoom, 14));
        }
      );

      // Cleanup listener
      setTimeout(() => google.maps.event.removeListener(listener), 1000);
    } else if (
      markersRef.current.length === 1 &&
      markersRef.current[0].position
    ) {
      // Center on single marker
      map.setCenter(markersRef.current[0].position);
      map.setZoom(14);
    } else {
      // Fallback to default
      map.setCenter(defaultCenter);
      map.setZoom(12);
    }
  }, [map, isLoaded, directions, defaultCenter]);

  useEffect(() => {
    updateBounds();
  }, [directions, updateBounds]);

  return { directions, markers: markersRef.current, defaultCenter };
};
