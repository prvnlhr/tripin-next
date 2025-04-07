import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface PlaceAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement> | React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
}

const PlaceAutocomplete = ({
  inputRef,
  value,
  onChange,
}: PlaceAutocompleteProps) => {
  const places = useMapsLibrary("places");
  const logValue = false;
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  if (logValue) {
    console.log(placeAutocomplete);
  }
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["formatted_address", "geometry", "name"],
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "in" },
    };

    const autocompleteInstance = new places.Autocomplete(
      inputRef.current,
      options
    );

    setPlaceAutocomplete(autocompleteInstance);

    // Add event listener for place changes
    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [places, inputRef, onChange]);

  return (
    <input
      ref={inputRef}
      className="h-full w-full font-light bg-transparent outline-none text-[0.8rem] placeholder:text-[0.8rem]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default PlaceAutocomplete;
