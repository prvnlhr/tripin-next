// components/MapComponent.tsx
"use client";
import { useMap } from "@/context/MapProvider";
import { useMapDirections } from "@/hooks/map/useMapDirections";
import { useMapMarkers } from "@/hooks/map/useMapMarkers";
import { useMapSync } from "@/hooks/map/useMapSync";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const MapComponent = () => {
  const { isLoaded } = useMap();
  const {
    srcCoords,
    destCoords,
    defaultCenter,
    srcAddress,
    destAddress,
    rideOption,
    updateBounds,
  } = useMapSync({ isLoaded, map: null });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { directions } = useMapDirections({
    isLoaded,
    map,
    srcCoords,
    destCoords,
  });
  useMapMarkers({
    isLoaded,
    map,
    srcCoords,
    destCoords,
    srcAddress,
    destAddress,
  });

  const MAP_ID =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "YOUR_MAP_ID_HERE";

  // Update bounds when map or directions change
  useEffect(() => {
    if (map) updateBounds(map, directions);
  }, [map, directions, updateBounds]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#1F2224]">
        Loading Map...
      </div>
    );
  }

  return (
    <section
      className={`w-[100%] ${rideOption ? "md:w-[40%]" : "md:w-[50%]"} h-[100%] md:h-[100%] flex flex-col items-center justify-center ml-auto`}
    >
      <div className="w-full h-[50px] flex items-center"></div>
      <div className="flex items-center justify-center w-[100%] h-[calc(100%-50px)] md:w-[100%] md:h-[calc(95%-50px)] bg-gradient-to-b from-[#1F2224] to-[#1F1F20] rounded-[20px]">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
          }}
          center={defaultCenter}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapId: MAP_ID,
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#101323",
                  strokeWeight: 3,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </section>
  );
};

export default MapComponent;
