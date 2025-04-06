"use client";
import React from "react";
import { Oval } from "react-loader-spinner";
const LoadingSpinner = () => {
  return (
    <div className="w-auto h-auto flex items-center justify-center">
      <Oval
        visible={true}
        color="black"
        secondaryColor="transparent"
        strokeWidth="3"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="w-[20px] h-[20px] flex items-center justify-center"
      />
    </div>
  );
};

export default LoadingSpinner;
