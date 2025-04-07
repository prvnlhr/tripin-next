"use client";
import { useState } from "react";

interface UsePlaceAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  initialValue?: string;
  onPlaceSelect: (place: {
    lat: number;
    lng: number;
    address: string;
    pinCode: string;
  }) => void;
  onClear?: () => void;
}

export const usePlaceAutocomplete = ({
  inputRef,
  initialValue = "",
  onPlaceSelect,
  onClear,
}: UsePlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const autocompleteOptions = {
    fields: ["address_components", "geometry", "formatted_address", "name"],
    types: ["geocode", "establishment"],
    componentRestrictions: { country: "in" },
    bounds: { east: 97.415, north: 37.084, south: 6.753, west: 68.162 },
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
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

      setInputValue(address);
      onPlaceSelect({ lat, lng, address, pinCode });
    }
  };

  const clearInput = () => {
    setInputValue("");
    if (inputRef.current) inputRef.current.focus();
    onClear?.();
  };

  return {
    inputValue,
    setInputValue,
    autocompleteOptions,
    onLoad,
    onPlaceChanged,
    clearInput,
  };
};
