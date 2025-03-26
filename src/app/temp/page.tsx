import React from "react";

const page = async ({ searchParams }) => {
  const qp = await searchParams;
  console.log(" qp...:", qp.src);
  return <div className="w-full h-full">page</div>;
};

export default page;
