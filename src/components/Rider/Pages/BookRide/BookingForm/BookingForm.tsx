"use client";
import { useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Autocomplete } from "@react-google-maps/api";
import { useMap } from "@/context/MapProvider";
import BookingFormSkeleton from "./BookingFormSkeleton";
import { usePlaceAutocomplete } from "@/hooks/autoComplete/usePlaceAutocomplete";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useCabOptions } from "@/hooks/useCabOptions";
import { Oval } from "react-loader-spinner";

const BookingForm = () => {
  const { isLoaded } = useMap();
  const { params, setParams, removeParams } = useUrlParams();
  const { isLoading: isCabOptionsLoading } = useCabOptions();

  const sourceInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const initialSource = params.srcAddress
    ? decodeURIComponent(params.srcAddress)
    : "";
  const initialDest = params.destAddress
    ? decodeURIComponent(params.destAddress)
    : "";

  const {
    inputValue: sourceInput,
    setInputValue: setSourceInput,
    autocompleteOptions,
    onLoad: onSourceLoad,
    onPlaceChanged: onSourcePlaceChanged,
    clearInput: clearSource,
  } = usePlaceAutocomplete({
    inputRef: sourceInputRef,
    initialValue: initialSource,
    onPlaceSelect: ({ lat, lng, address, pinCode }) => {
      setParams({
        src: `${lat},${lng}`,
        srcAddress: encodeURIComponent(address),
        srcPin: pinCode,
      });
    },
    onClear: () => {
      removeParams(["src", "srcAddress", "srcPin"]);
    },
  });

  const {
    inputValue: destInput,
    setInputValue: setDestInput,
    onLoad: onDestLoad,
    onPlaceChanged: onDestPlaceChanged,
    clearInput: clearDestination,
  } = usePlaceAutocomplete({
    inputRef: destInputRef,
    initialValue: initialDest,
    onPlaceSelect: ({ lat, lng, address, pinCode }) => {
      setParams({
        dest: `${lat},${lng}`,
        destAddress: encodeURIComponent(address),
        destPin: pinCode,
      });
    },
    onClear: () => {
      removeParams(["dest", "destAddress", "destPin"]);
    },
  });

  const handleSearchRide = () => {
    if (sourceInput && destInput) {
      setParams({ rideOption: "true" });
    }
  };

  if (!isLoaded) return <BookingFormSkeleton />;

  const isSourceSelected = Boolean(params.src); // Check if source is in URL params
  const isDestSelected = Boolean(params.dest); // Check if destination is in URL params
  const isButtonActive = isSourceSelected && isDestSelected;
  // const showSpinner = params.rideOption === "true" && isCabOptionsLoading;
  const showSpinner = isCabOptionsLoading;

  return (
    <div className="w-[100%] min-w-[100%] h-[100%] md:w-[90%] md:min-w-[90%] flex flex-col">
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
              <p
                className={`text-[1.2rem] ${!isSourceSelected ? "text-[#454849]" : "text-[#B5E4FC]"}  font-normal`}
              >
                WHERE
              </p>
            </div>
            <div className="w-full h-auto flex items-center">
              <p
                className={`text-[0.8rem] ${!isSourceSelected ? "text-[#454849]" : "text-white"}  font-light`}
              >
                Drop off
              </p>
            </div>
            <div className="w-full h-[40px] border-b-1 border-[#505354]">
              <div className="w-full h-full flex items-center justify-start">
                <Autocomplete
                  onLoad={onDestLoad}
                  onPlaceChanged={onDestPlaceChanged}
                  options={autocompleteOptions}
                  className="flex-1 h-full"
                  // disabled={!isSourceSelected} // Disable autocomplete until source is selected
                >
                  <input
                    ref={destInputRef}
                    className={`h-full w-full font-light bg-transparent outline-none text-[0.8rem] placeholder:text-[0.8rem] ${
                      !isSourceSelected ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    placeholder={
                      isSourceSelected
                        ? "Enter destination"
                        : "Select source first"
                    }
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    disabled={!isSourceSelected}
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
                      className={`w-[45%] h-[45%] ${
                        isSourceSelected ? "text-[#B5E4FC]" : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[50px] flex items-center justify-center">
          <button
            disabled={!isButtonActive || showSpinner}
            onClick={handleSearchRide}
            className={`w-full h-[80%] border font-normal text-[0.8rem] rounded flex items-center justify-center ${
              isButtonActive
                ? "bg-[#B5E4FC] text-[#1F1F1F] border-transparent cursor-pointer"
                : "bg-[#454849] text-[#656666] border-[#3C3C3C] cursor-not-allowed"
            }`}
          >
            {showSpinner ? (
              <Oval
                width={15}
                height={15}
                color="#151515"
                secondaryColor="#B5E4FC"
                strokeWidth={5}
              />
            ) : (
              "Search ride"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
