"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const BookingForm = () => {
  const router = useRouter();
  const [sourceInput, setSourceInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const autocompleteOptions = {
    fields: ["address_components", "geometry", "name", "formatted_address"],
    types: ["address"],
    componentRestrictions: { country: "in" },
  };

  const [sourceAutocomplete, setSourceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [destAutocomplete, setDestAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onSourceLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSourceAutocomplete(autocomplete);
  };

  const onDestLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDestAutocomplete(autocomplete);
  };

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete) {
      const place = sourceAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";
        setSourceInput(address);
        router.push(
          `?src=${lat},${lng}&srcAddress=${encodeURIComponent(address)}${
            window.location.search.includes("dest=") ? "" : "&dest="
          }`
        );
      }
    }
  };

  const onDestPlaceChanged = () => {
    if (destAutocomplete) {
      const place = destAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";
        setDestInput(address);
        router.push(
          `${
            window.location.search.includes("src=")
              ? window.location.search
              : "?src="
          }&dest=${lat},${lng}&destAddress=${encodeURIComponent(address)}`
        );
      }
    }
  };

  const clearSource = () => {
    setSourceInput("");
    if (sourceInputRef.current) sourceInputRef.current.focus();
    router.push(`?${window.location.search.replace(/src=[^&]*&?/, "")}`);
  };

  const clearDestination = () => {
    setDestInput("");
    if (destInputRef.current) destInputRef.current.focus();
    router.push(`?${window.location.search.replace(/dest=[^&]*&?/, "")}`);
  };

  useEffect(() => {
    // Initialize input values from URL if present
    const params = new URLSearchParams(window.location.search);
    const srcAddress = params.get("srcAddress");
    const destAddress = params.get("destAddress");
    if (srcAddress) setSourceInput(decodeURIComponent(srcAddress));
    if (destAddress) setDestInput(decodeURIComponent(destAddress));
  }, []);

  if (!isLoaded)
    return (
      <div className="justify-center items-center w-[100%] h-[100%] md:w-[90%] flex flex-col">
        Loading...
      </div>
    );

  return (
    <div className="w-[100%] h-[100%] md:w-[90%] flex flex-col">
      <div className="w-full h-full">
        {/* Header */}
        <div className="w-full h-[80px] flex flex-col justify-center items-start">
          <p className="font-light text-[1.7rem] leading-tight">
            Lets book a ride
            <br />
            for you <span className="text-[#B5E4FC]">.</span>
          </p>
        </div>

        {/* Input wrapper */}
        <div className="w-full h-[calc(100%-130px)] md:h-[calc(80%-130px)] flex flex-col justify-evenly items-center">
          {/* Pickup point */}
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
                  className="w-full h-full"
                >
                  <input
                    ref={sourceInputRef}
                    className="h-full flex-1 font-light bg-transparent outline-none placeholder:text-[0.8rem]"
                    placeholder="Enter pickup location"
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                  />
                </Autocomplete>
                {sourceInput ? (
                  <button
                    onClick={clearSource}
                    className="h-full aspect-square flex items-center justify-center"
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

          {/* DropOff point */}
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
                  className="w-full h-full"
                >
                  <input
                    ref={destInputRef}
                    className="h-full flex-1 font-light bg-transparent outline-none placeholder:text-[0.8rem]"
                    placeholder="Enter destination"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                  />
                </Autocomplete>
                {destInput ? (
                  <button
                    onClick={clearDestination}
                    className="h-full aspect-square flex items-center justify-center"
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
          <button className="w-full h-[80%] bg-[#B5E4FC] border border-[#3C3C3C] font-normal text-[0.8rem] text-[#1F1F1F] rounded cursor-pointer">
            Select ride option
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
