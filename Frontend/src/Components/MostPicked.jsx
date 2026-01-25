import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import VillaCard from "./VillaCard";
import SkeletonGrid from "./SkeletonGrid";

function MostPicked() {
  const { villaData, villaLoading } = useContext(AppContext);

  return (
    <div className="py-16">
      <h1 className="text-[#FFFFFF] text-3xl font-semibold text-center">
        Most Viewed Villas
      </h1>

      <p className="text-[#CCCCCC80] text-sm text-center max-w-lg mx-auto mt-2">
        Explore our top-rated rooms, loved by guests for comfort and location.
      </p>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        {villaLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {villaData.slice(0, 6).map((villa) => (
              <VillaCard key={villa._id} villa={villa} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MostPicked;
