"use client";
import { GoogleMap } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMap } from "../../../context/MapProvider";
import { wkbToLatLng } from "@/utils/geoUtils";
import { DriverData } from "@/types/driver/driverTypes";

interface MapProps {
  driverInfo: DriverData;
}

interface MarkerLibrary {
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
}

const Map: React.FC<MapProps> = ({ driverInfo }) => {
  const { isLoaded } = useMap();
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [driverCoords, setDriverCoords] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    { lat: 20.5937, lng: 78.9629 }
  );
  const [currentAddress, setCurrentAddress] = useState<string>(
    "Fetching location..."
  );
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const MAP_ID =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "YOUR_MAP_ID_HERE";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Current location:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser");
    }
  }, []);

  // Initialize geocoder when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
      // console.log("Geocoder initialized successfully");
    }
  }, [isLoaded]);

  // Reverse geocode coordinates to get address
  const getAddressFromCoords = useCallback(
    async (coords: google.maps.LatLngLiteral) => {
      if (!geocoderRef.current) {
        console.warn("Geocoder not initialized yet");
        return "Initializing location service...";
      }

      return new Promise<string>((resolve) => {
        geocoderRef.current?.geocode(
          { location: coords },
          (results, status) => {
            if (status === "OK" && results?.[0]) {
              // console.log(
              //   "Geocoding successful:",
              //   results[0].formatted_address
              // );
              resolve(results[0].formatted_address);
            } else {
              console.warn("Geocoding failed with status:", status);
              resolve("Location details unavailable");
            }
          }
        );
      });
    },
    []
  );

  // Parse and set driver location
  useEffect(() => {
    const updateLocation = async () => {
      if (driverInfo?.location) {
        const coords = wkbToLatLng(driverInfo.location);
        if (coords) {
          setDriverCoords(coords);
          if (!src && !dest) {
            setDefaultCenter(coords);

            // Get address after ensuring geocoder is ready
            const timer = setTimeout(async () => {
              try {
                const address = await getAddressFromCoords(coords);
                setCurrentAddress(address);
              } catch (error) {
                console.error("Address fetch error:", error);
                setCurrentAddress("Could not determine address");
              }
            }, 300);

            return () => clearTimeout(timer);
          }
        }
      }
    };

    updateLocation();
  }, [driverInfo?.location, src, dest, getAddressFromCoords]);

  // Manage markers - only driver marker when no src/dest
  useEffect(() => {
    if (!isLoaded || !map || !driverCoords || src || dest) return;

    const updateMarkers = async () => {
      try {
        const markerLib = (await google.maps.importLibrary(
          "marker"
        )) as MarkerLibrary;
        const { AdvancedMarkerElement } = markerLib;

        // Clear existing markers
        markersRef.current.forEach((marker) => (marker.map = null));
        markersRef.current = [];

        // Add driver marker
        const driverIcon = document.createElement("img");
        driverIcon.src = "/assets/map/driverMarker.png";
        driverIcon.style.width = "40px";
        driverIcon.style.height = "40px";

        const driverMarker = new AdvancedMarkerElement({
          map,
          position: driverCoords,
          title: "Your Location",
          content: driverIcon,
        });
        markersRef.current.push(driverMarker);
      } catch (error) {
        console.error("Marker creation error:", error);
      }
    };

    updateMarkers();
  }, [isLoaded, map, driverCoords, src, dest]);

  // Center map on driver when no src/dest
  const updateBounds = useCallback(() => {
    if (!map) return;

    if (!src && !dest && driverCoords) {
      map.setCenter(driverCoords);
      map.setZoom(14); // Close zoom on driver location
    } else if (!src && !dest) {
      map.setCenter(defaultCenter);
      map.setZoom(12); // Default zoom level
    }
  }, [map, driverCoords, defaultCenter, src, dest]);

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    geocoderRef.current = null;
    markersRef.current = [];
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#1F2224]">
        Loading Map...
      </div>
    );
  }

  return (
    <section className="w-full md:w-[50%] h-[60vh] md:h-[100%] flex items-center justify-center md:items-start md:justify-end">
      <div className="border-red-500 flex flex-col items-center justify-center w-[100%] h-[100%] md:w-[100%] md:h-[95%]">
        <div className="w-full h-[70px] flex items-center">
          <div>
            <p className="text-[0.9rem] font-normal text-[#B5E4FC]">
              CURRENT LOCATION:
            </p>
            <p className="font-light text-[0.7rem] text-white">
              {currentAddress}
            </p>
          </div>
        </div>
        <div className="w-full h-[calc(100%-70px)] flex rounded-[20px]">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
            }}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              mapId: MAP_ID,
              disableDefaultUI: true,
              zoomControl: true,
              clickableIcons: false,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Map;
