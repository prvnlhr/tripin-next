"use client";

import { useEffect, useState } from "react";

interface UseMapDirectionsProps {
  isLoaded: boolean;
  map: google.maps.Map | null;
  srcCoords: google.maps.LatLngLiteral | null;
  destCoords: google.maps.LatLngLiteral | null;
}

export const useMapDirections = ({
  isLoaded,
  map,
  srcCoords,
  destCoords,
}: UseMapDirectionsProps) => {
  const [directions, setDirections] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);

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

  return { directions };
};
