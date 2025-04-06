"use client";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useMap } from "../../../context/MapProvider";

interface MarkerLibrary {
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
}

const MapComponent = () => {
  const { isLoaded } = useMap();
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const srcAddress = searchParams.get("srcAddress");
  const destAddress = searchParams.get("destAddress");
  const rideOption = searchParams.get("rideOption") === "true";

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [srcCoords, setSrcCoords] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [destCoords, setDestCoords] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    { lat: 20.5937, lng: 78.9629 }
  );
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const MAP_ID =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "YOUR_MAP_ID_HERE";

  useEffect(() => {
    if (isLoaded && !map) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDefaultCenter({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.warn("Error getting user location:", error.message);
          },
          { timeout: 10000 }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
      }
    }
  }, [isLoaded, map]);

  // Parse coordinates from URL and clear if not present
  useEffect(() => {
    if (src) {
      const [lat, lng] = src.split(",").map(Number);
      setSrcCoords({ lat, lng });
    } else {
      setSrcCoords(null);
    }
    if (dest) {
      const [lat, lng] = dest.split(",").map(Number);
      setDestCoords({ lat, lng });
    } else {
      setDestCoords(null);
    }
  }, [src, dest]);

  // Calculate route only when both points are available
  useEffect(() => {
    if (isLoaded && map && srcCoords && destCoords) {
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
            setDirections(null);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, map, srcCoords, destCoords]);

  // Manage markers
  useEffect(() => {
    if (!isLoaded || !map) return;

    const updateMarkers = async () => {
      const markerLib = (await google.maps.importLibrary(
        "marker"
      )) as MarkerLibrary;
      const { AdvancedMarkerElement } = markerLib;

      // Clear existing markers
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];

      if (srcCoords) {
        const srcIcon = document.createElement("img");
        srcIcon.src = "/assets/map/sourceMarker.png";
        srcIcon.style.width = "40px";
        srcIcon.style.height = "40px";

        const srcMarker = new AdvancedMarkerElement({
          map,
          position: srcCoords,
          title: srcAddress
            ? decodeURIComponent(srcAddress)
            : "Pickup location",
          content: srcIcon,
        });
        markersRef.current.push(srcMarker);
      }
      if (destCoords) {
        const destIcon = document.createElement("img");
        destIcon.src = "/assets/map/destMarker.png";
        destIcon.style.width = "40px";
        destIcon.style.height = "40px";

        const destMarker = new AdvancedMarkerElement({
          map,
          position: destCoords,
          title: destAddress
            ? decodeURIComponent(destAddress)
            : "Drop-off location",
          content: destIcon,
        });
        markersRef.current.push(destMarker);
      }
    };

    updateMarkers().catch(console.error);
  }, [isLoaded, map, srcCoords, destCoords, srcAddress, destAddress]);

  // Fit map to bounds
  const updateBounds = useCallback(() => {
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
        if (!directions && (srcCoords || destCoords)) {
          const zoom = map.getZoom() || 12;
          map.setZoom(Math.min(zoom, 14));
        }
      }
    } else if (map && defaultCenter) {
      // Center on user's location if no markers are present
      map.setCenter(defaultCenter);
      map.setZoom(12);
      // Default zoom level when centered on user location
    }
  }, [map, directions, srcCoords, destCoords, defaultCenter]);

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
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
    <section
      className={`border-red-500
        w-full ${rideOption ? "md:w-[40%]" : "md:w-[70%]"} h-[60vh] md:h-[100%] flex items-center justify-center md:items-start md:justify-end`}
    >
      <div
        className="
         flex items-center justify-center 
         w-[100%] h-[100%] md:w-[90%] md:h-[95%] 
         border border-[#3C3C3C] 
         bg-gradient-to-b from-[#1F2224] to-[#1F1F20]
         rounded-[20px]"
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
