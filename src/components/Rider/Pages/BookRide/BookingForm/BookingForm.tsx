"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Autocomplete } from "@react-google-maps/api";
import { useMap } from "@/context/MapProvider";

const BookingForm = () => {
  const router = useRouter();
  const [sourceInput, setSourceInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useMap();

  const autocompleteOptions = {
    fields: ["address_components", "geometry", "formatted_address", "name"],
    types: ["geocode", "establishment"],
    componentRestrictions: { country: "in" },
    bounds: { east: 97.415, north: 37.084, south: 6.753, west: 68.162 },
  };

  const [sourceAutocomplete, setSourceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [destAutocomplete, setDestAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onSourceLoad = (autocomplete: google.maps.places.Autocomplete) =>
    setSourceAutocomplete(autocomplete);
  const onDestLoad = (autocomplete: google.maps.places.Autocomplete) =>
    setDestAutocomplete(autocomplete);

  const updateURL = (params: Record<string, string | null>) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (
      (params.src === null || params.dest === null) &&
      searchParams.has("rideOption")
    ) {
      searchParams.delete("rideOption");
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) searchParams.delete(key);
      else searchParams.set(key, value);
    });
    router.push(`?${searchParams.toString()}`);
  };

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete) {
      const place = sourceAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.warn("No details available for input: '" + place.name + "'");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name || "";
      const pinCode =
        place.address_components?.find((c) => c.types.includes("postal_code"))
          ?.long_name || "";

      setSourceInput(address);
      updateURL({
        src: `${lat},${lng}`,
        srcAddress: encodeURIComponent(address),
        srcPin: pinCode,
      });
    }
  };

  const onDestPlaceChanged = () => {
    if (destAutocomplete) {
      const place = destAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.warn("No details available for input: '" + place.name + "'");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name || "";
      const pinCode =
        place.address_components?.find((c) => c.types.includes("postal_code"))
          ?.long_name || "";

      setDestInput(address);
      updateURL({
        dest: `${lat},${lng}`,
        destAddress: encodeURIComponent(address),
        destPin: pinCode,
      });
    }
  };

  const clearSource = () => {
    setSourceInput("");
    if (sourceInputRef.current) sourceInputRef.current.focus();
    updateURL({ src: null, srcAddress: null, srcPin: null });
  };

  const clearDestination = () => {
    setDestInput("");
    if (destInputRef.current) destInputRef.current.focus();
    updateURL({ dest: null, destAddress: null, destPin: null });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const srcAddress = params.get("srcAddress");
    const destAddress = params.get("destAddress");
    if (srcAddress) setSourceInput(decodeURIComponent(srcAddress));
    if (destAddress) setDestInput(decodeURIComponent(destAddress));
  }, []);

  if (!isLoaded)
    return (
      <div className="w-[100%] h-[100%] md:w-[90%] md:min-w-[90%] flex flex-col">
        Loading...
      </div>
    );

  const handleSearchRide = () => {
    if (sourceInput && destInput) {
      const sourceLatLng = sourceAutocomplete?.getPlace()?.geometry?.location;
      const destLatLng = destAutocomplete?.getPlace()?.geometry?.location;

      if (sourceLatLng && destLatLng) {
        const sourceLat = sourceLatLng.lat();
        const sourceLng = sourceLatLng.lng();
        const destLat = destLatLng.lat();
        const destLng = destLatLng.lng();
        console.log("Source Location Latitude:", sourceLat);
        console.log("Source Location Longitude:", sourceLng);
        console.log("Destination Location Latitude:", destLat);
        console.log("Destination Location Longitude:", destLng);
      }

      updateURL({ rideOption: "true" });
    }
  };

  const isButtonActive = sourceInput && destInput;
  return (
    <div className="w-[100%] h-[100%] md:w-[90%] flex flex-col">
      <div className="w-full h-full">
        <div className="w-full h-[80px] flex flex-col justify-center items-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Lets book a ride
            <br />
            for you <span className="text-[#B5E4FC]">.</span>
          </p>
        </div>
        <div className="w-full h-[calc(100%-130px)] md:h-[calc(80%-130px)] flex flex-col justify-evenly items-center">
          <div className="h-auto w-full grid grid-cols-[100%] grid-rows-[auto_auto_auto]">
            <div className="w-full h-auto flex items-center">
              <p className="text-[1.2rem] text-[#B5E4FC] font-normal">FROM</p>
            </div>
            <div className="w-full h-auto flex items-center">
              <p className="text-[0.8rem] font-light">Pickup point</p>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start">
                <Autocomplete
                  onLoad={onSourceLoad}
                  onPlaceChanged={onSourcePlaceChanged}
                  options={autocompleteOptions}
                  className="flex-1 h-full"
                >
                  <input
                    ref={sourceInputRef}
                    className="h-full w-full font-light bg-transparent outline-none text-[0.8rem] placeholder:text-[0.8rem]"
                    placeholder="Enter pickup location"
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                  />
                </Autocomplete>
                {sourceInput ? (
                  <button
                    onClick={clearSource}
                    className="h-full aspect-square flex items-center justify-center cursor-pointer"
                  >
                    <Icon
                      icon="mdi:close"
                      className="text-gray-400 w-[35%] h-[35%]"
                    />
                  </button>
                ) : (
                  <div className="h-full aspect-square flex items-center justify-center">
                    <Icon
                      icon="tabler:location-filled"
                      className="text-[#B5E4FC] w-[35%] h-[35%]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-auto w-full grid grid-cols-[100%] grid-rows-[auto_auto_auto]">
            <div className="w-full h-auto flex items-center">
              <p className="text-[1.2rem] text-[#B5E4FC] font-normal">WHERE</p>
            </div>
            <div className="w-full h-auto flex items-center">
              <p className="text-[0.8rem] font-light">Drop off</p>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start">
                <Autocomplete
                  onLoad={onDestLoad}
                  onPlaceChanged={onDestPlaceChanged}
                  options={autocompleteOptions}
                  className="flex-1 h-full"
                >
                  <input
                    ref={destInputRef}
                    className="h-full w-full font-light bg-transparent outline-none text-[0.8rem] placeholder:text-[0.8rem]"
                    placeholder="Enter destination"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                  />
                </Autocomplete>
                {destInput ? (
                  <button
                    onClick={clearDestination}
                    className="h-full aspect-square flex items-center justify-center cursor-pointer"
                  >
                    <Icon
                      icon="mdi:close"
                      className="text-gray-400 w-[35%] h-[35%]"
                    />
                  </button>
                ) : (
                  <div className="h-full aspect-square flex items-center justify-center">
                    <Icon
                      icon="material-symbols-light:location-on-rounded"
                      className="text-[#B5E4FC] w-[45%] h-[45%]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[50px] flex items-center justify-center">
          <button
            disabled={!isButtonActive}
            onClick={handleSearchRide}
            className={`w-full h-[80%] border border-[#3C3C3C] font-normal text-[0.8rem] rounded cursor-pointer ${
              isButtonActive
                ? "bg-[#B5E4FC] text-[#1F1F1F]"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Search ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
