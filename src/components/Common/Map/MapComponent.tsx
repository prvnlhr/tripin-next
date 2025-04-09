"use client";
import { useMap } from "@/context/MapProvider";
import { useMapManager } from "@/hooks/map/useMapManager";
import { useUrlParams } from "@/hooks/useUrlParams";
import { getAddressFromLatLng } from "@/utils/geoUtils";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

const MapComponent = () => {
  // MAP_ID -> custom styled map_id from the google cloud console
  const MAP_ID =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "YOUR_MAP_ID_HERE";

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded } = useMap();
  const { params } = useUrlParams();

  const [locationAddress, setLocationAddress] = useState<{
    address: string | null;
    type: "rider" | "driver" | null;
  }>({ address: null, type: null });

  const rideOption = params.rideOption === "true";
  const driver_location = params.driver_location;
  const rider_location = params.rider_location;

  const { directions, defaultCenter } = useMapManager({ isLoaded, map });

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const parseCoords = useCallback((coordStr?: string) => {
    if (!coordStr) return null;
    const [lat, lng] = coordStr.split(",").map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  }, []);

  // Fetch address for either rider or driver location
  useEffect(() => {
    const fetchLocationAddress = async () => {
      let coords: { lat: number; lng: number } | null = null;
      let locationType: "rider" | "driver" | null = null;

      if (rider_location) {
        coords = parseCoords(rider_location);
        locationType = "rider";
      } else if (driver_location) {
        coords = parseCoords(driver_location);
        locationType = "driver";
      }

      if (coords && locationType) {
        const { lat, lng } = coords;
        const address = await getAddressFromLatLng(lat, lng);
        console.log(" address:", address);
        setLocationAddress({
          address: address || "Address not found",
          type: locationType,
        });
      } else {
        setLocationAddress({ address: null, type: null });
      }
    };

    if (isLoaded) {
      fetchLocationAddress();
    }
  }, [rider_location, driver_location, isLoaded, parseCoords]);

  if (!isLoaded) {
    return (
      <section
        className={`w-[100%] ${rideOption ? "md:w-[40%]" : "md:w-[50%]"} h-[100%] md:h-[100%] flex flex-col items-center justify-center ml-auto`}
      >
        <div className="w-full h-[50px] flex items-center"></div>
        <div
          className="border border-[#3C3C3C] flex items-center justify-center w-[100%] h-[calc(100%-50px)] md:w-[100%] md:h-[calc(95%-50px)] bg-gradient-to-b from-[#1F2224] to-[#1F1F20] rounded-[20px]
          animate-[pulse_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        ></div>
      </section>
    );
  }

  return (
    <section
      className={`w-[100%] ${rideOption ? "md:w-[40%]" : "md:w-[50%]"} h-[100%] md:h-[100%] flex flex-col items-center justify-center ml-auto`}
    >
      <div
        className={`w-full ${rider_location || driver_location ? "h-[70px] px-[5px]" : "h-[0px]"}  flex items-center overflow-hidden`}
      >
        {locationAddress.address && locationAddress.type ? (
          <p className="w-[100%] md:w-[70%] text-[0.8rem]">
            <span className="text-[#B5E4FC]">
              {locationAddress.type === "rider"
                ? "Rider's Location : "
                : "Driver's Location : "}
            </span>
            {locationAddress.address}
          </p>
        ) : rider_location || driver_location ? (
          <p className="w-[100%] md:w-[70%] text-[0.8rem] text-white">
            Loading address...
          </p>
        ) : null}
      </div>
      <div
        className={`border border-[#3c3c3c] 
          flex items-center justify-center 
          w-[100%] md:w-[100%] 
          ${driver_location ? " h-[calc(100%-70px)] md:h-[calc(95%-70px)] " : "h-[100%] md:h-[95%]"}
          bg-gradient-to-b from-[#1F2224] to-[#1F1F20] 
          rounded-[20px]`}
      >
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
            zoomControl: false,
            clickableIcons: true,
            colorScheme: "DARK",
            keyboardShortcuts: false,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#B5E4FC",
                  strokeWeight: 4,
                  strokeOpacity: 1,
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
