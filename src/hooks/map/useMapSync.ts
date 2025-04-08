"use client";
import { useEffect, useState, useCallback } from "react";
import { useUrlParams } from "../useUrlParams";

interface UseMapSyncProps {
  isLoaded: boolean;
  map: google.maps.Map | null;
}

export const useMapSync = ({ isLoaded, map }: UseMapSyncProps) => {
  const { params } = useUrlParams();
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    {
      lat: 20.5937,
      lng: 78.9629,
    }
  );

  const getAllCoordinates = useCallback(() => {
    const coordinates: google.maps.LatLngLiteral[] = [];

    const parseCoords = (coordStr: string) => {
      const [lat, lng] = coordStr.split(",").map(Number);
      return { lat, lng };
    };

    Object.entries(params).forEach(([key, value]) => {
      // Skip non-coordinate params
      if (key === "rideOption" || key.includes("Address")) return;

      try {
        if (value && value.includes(",")) {
          coordinates.push(parseCoords(value));
        }
      } catch {
        console.warn(`Failed to parse coordinates from param ${key}: ${value}`);
      }
    });

    return coordinates;
  }, [params]);

  useEffect(() => {
    if (isLoaded && !map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
        { timeout: 10000 }
      );
    }
  }, [isLoaded, map]);

  const updateBounds = useCallback(
    (map: google.maps.Map, directions?: google.maps.DirectionsResult) => {
      const coordinates = getAllCoordinates();
      const bounds = new google.maps.LatLngBounds();

      if (directions) {
        directions.routes[0].legs.forEach((leg) => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
      } else if (coordinates.length > 0) {
        coordinates.forEach((coord) => bounds.extend(coord));
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(12);
        return;
      }

      if (!bounds.isEmpty()) {
        const padding = 60;
        map.fitBounds(bounds, padding);

        const zoom = map.getZoom() || 12;
        map.setZoom(Math.min(zoom, 14));
      }
    },
    [getAllCoordinates, defaultCenter]
  );

  return {
    defaultCenter,
    updateBounds,
    rideOption: params.rideOption === "true",
  };
};
