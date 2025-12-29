import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";


function MostPicked() {
  const { villaData } = useContext(AppContext);

  return (
    <div className="py-16">
      <h1 className="text-[#FFFFFF] text-3xl font-semibold text-center">
        Most Viewed Villas
      </h1>

      <p className="text-[#CCCCCC80] text-sm text-center max-w-lg mx-auto">
        Explore our top-rated rooms, loved by guests for comfort and location.
      </p>

      <div className="flex flex-wrap items-center justify-center mt-8 gap-4 max-w-5xl mx-auto">
        {villaData.map((item) => (
          <Link
            key={item._id}
            to={`/villa/${item._id}`}
            className="relative group rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={`http://localhost:4000/images/${item.images[0]}`}
              alt={item.villaName}
              className="size-56 object-cover object-top"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black opacity-0 group-hover:opacity-70 text-white transition-all duration-300">
              <h1 className="text-lg">{item.villaName}</h1>
              <p className="text-sm">{item.villaAddress}</p>
              <h1 className="text-lg">₹ {item.price}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MostPicked;
