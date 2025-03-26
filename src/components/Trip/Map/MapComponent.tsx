"use client";

import { useSearchParams } from "next/navigation";

const MapComponent = () => {
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const options = searchParams.get("options");
  return (
    <section
      className={`border-red-400
        w-full
        ${options ? "md:w-[40%]" : "md:w-[70%]"} 
        h-[60vh] md:h-[100%] 
        flex items-center justify-center 
        md:items-start md:justify-end`}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #1F2224 0%, #1F1F20 100%)",
        }}
        className={`
        flex items-center justify-center
        w-[100%] h-[100%] 
        md:w-[90%] md:h-[95%]
        border border-[#3C3C3C] 
        rounded`}
      >
        {src}
        <br />
        {dest}
        <br />
        {options}
      </div>
    </section>
  );
};

export default MapComponent;

// className = "w-full md:w-[50%] h-[60vh] md:h-full flex items-center justify-center md:items-start md:justify-end";
