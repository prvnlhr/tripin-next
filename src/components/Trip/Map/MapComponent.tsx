"use client";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const MapComponent = () => {
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const srcAddress = searchParams.get("srcAddress");
  const destAddress = searchParams.get("destAddress");
  const options = searchParams.get("options") === "true";

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [srcCoords, setSrcCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destCoords, setDestCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Parse coordinates from URL
  useEffect(() => {
    if (src) {
      const [lat, lng] = src.split(",").map(Number);
      setSrcCoords({ lat, lng });
    }
    if (dest) {
      const [lat, lng] = dest.split(",").map(Number);
      setDestCoords({ lat, lng });
    }
  }, [src, dest]);

  // Calculate route when both points are available
  useEffect(() => {
    if (isLoaded && srcCoords && destCoords) {
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
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, srcCoords, destCoords]);

  // Fit map to bounds when markers or route changes
  useEffect(() => {
    if (map && (srcCoords || destCoords)) {
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

        // Prevent over-zooming for single markers
        if (!directions && (srcCoords || destCoords)) {
          const zoom = map.getZoom() || 12;
          map.setZoom(Math.min(zoom, 14));
        }
      }
    }
  }, [map, directions, srcCoords, destCoords]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#1F2224]">
        Loading Map...
      </div>
    );
  }

  return (
    <section
      className={`w-full ${options ? "md:w-[40%]" : "md:w-[70%]"} h-[60vh] md:h-[100%] flex items-center justify-center md:items-start md:justify-end`}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #1F2224 0%, #1F1F20 100%)",
        }}
        className="flex items-center justify-center w-[100%] h-[100%] md:w-[90%] md:h-[95%] border border-[#3C3C3C] rounded"
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 20.5937, lng: 78.9629 }} // Default center to India
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false,
          }}
        >
          {srcCoords && (
            <Marker
              position={srcCoords}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(32, 32),
              }}
              title={srcAddress || "Pickup location"}
            />
          )}

          {destCoords && (
            <Marker
              position={destCoords}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new google.maps.Size(32, 32),
              }}
              title={destAddress || "Drop-off location"}
            />
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </section>
  );
};

export default MapComponent;
