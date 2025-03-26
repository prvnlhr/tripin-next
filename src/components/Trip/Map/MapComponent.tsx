"use client";

import { useSearchParams } from "next/navigation";

const MapComponent = () => {
  const searchParams = useSearchParams();
  console.log(" searchParams:", searchParams);
  const src = searchParams.get("src");
  const dest = searchParams.get("dest");
  const options = searchParams.get("options");
  console.log(" src:", src);
  console.log(" dest:", dest);
  console.log(" options:", options);
  return (
    <section
      className="
        w-full md:w-[50%] 
        h-[60vh] md:h-full 
        flex items-center justify-center 
        md:items-start md:justify-end"
    >
      <div
        style={{
          background: "linear-gradient(180deg, #1F2224 0%, #1F1F20 100%)",
        }}
        className="w-[95%] h-[95%] border border-[#3C3C3C] rounded"
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
