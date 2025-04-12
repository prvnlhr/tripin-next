const IncomingRequestListCard = () => {
  return (
    <div
      className="relative
       w-[80%] md:w-[20%]
       aspect-[4/2.5]
       bg-[linear-gradient(180deg,#1F2224_0%,#1F1F20_100%)]
       border border-[#3C3C3C] rounded-[20px]
       grid
       grid-cols-[50%_25%_25%]
       grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
       p-[20px]
       mb-[20px]
       "
    >
      <div className="absolute w-[25px] aspect-square flex items-center justify-center bg-[#1F1F1F] rounded-full right-[-8px] top-[-8px] border border-[#3C3C3C] text-[0.7rem] text-[#B5E4FC] font-medium">
        0
      </div>
      <div className="col-start-1 col-end-2 w-full h-full flex flex-col">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <div className="w-[80%] h-[5px] rounded bg-[#454849]"></div>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <div className="w-[50%] h-[5px] rounded bg-[#454849]"></div>
        </div>
      </div>
      <div className="col-start-2 col-end-4 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <div className="w-[80%] h-[5px] rounded bg-[#454849]"></div>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <div className="w-[50%] h-[5px] rounded bg-[#454849]"></div>
        </div>
      </div>
      <div className="col-span-3 row-start-2 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center  border-red-500">
          <div className="w-[80%] h-[5px] rounded bg-[#454849]"></div>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <div className="w-[50%] h-[5px] rounded bg-[#454849]"></div>
        </div>
      </div>
      <div className="col-span-2 row-start-3 w-full h-full flex flex-col ">
        <div className="w-full  h-[25px] flex items-center border-red-500">
          <div className="w-[100%] h-[5px] rounded bg-[#454849]"></div>
        </div>
        <div className="w-full  h-[calc(100%-25px)] flex items-center border-red-500">
          <div className="w-[50%] h-[5px] rounded bg-[#454849]"></div>
        </div>
      </div>
      <div className="col-start-3 row-start-3 w-full h-full flex justify-end items-end">
        <div className="flex h-[80%] aspect-square cursor-pointer items-center justify-center rounded-full bg-[#454849]"></div>
      </div>
    </div>
  );
};

export default IncomingRequestListCard;
