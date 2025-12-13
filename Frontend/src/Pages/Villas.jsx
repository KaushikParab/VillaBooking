import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";

function Villas() {
  const { villaData } = useContext(AppContext);
  return (
    <div className="py-10 max-w-7xl mx-auto ">
      <h1 className="text-3xl font-semibold text-[#ffffff] my-8 px-2 text-center">
        All Villas
      </h1>

      <div className="flex flex-wrap items-center justify-center mt-8 gap-4 max-w-5xl mx-auto">
        {villaData.map((item, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={`http://localhost:4000/images/${item.image}`}
              alt=""
              className="size-56 object-cover object-top"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-red bg-black opacity-0 group-hover:opacity-70 group-hover:text-white transition-all duration-300">
              <h1 className="text-lg">{item.villaName}</h1>
              <p className="text-sm">{item.villaAddress}</p>
              <h1 className="text-lg">₹ {item.price}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Villas;
