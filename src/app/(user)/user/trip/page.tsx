import React from "react";

const page = async ({ searchParams }) => {
  const qp = await searchParams;
  console.log(" qpx...:", qp.src);
  return <div>page</div>;
};

export default page;
