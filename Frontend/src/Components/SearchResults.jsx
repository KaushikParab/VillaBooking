import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import SkeletonGrid from "./SkeletonGrid";
import VillaCard from "../Components/VillaCard";

function SearchResults() {
  const { searchVillas, isSearching, villaLoading } = useContext(AppContext);

  if (!isSearching) return null;

  return (
    <div className={`py-10 border-b border-gray-700 transition-all duration-500 ${
        isSearching ? "opacity-100" : "opacity-0"
      }`}>
      <h1 className="text-[#FFD369] text-2xl font-semibold text-center">
        Search Results
      </h1>

      {/* SKELETON LOADER */}
      {villaLoading && <SkeletonGrid count={6} />}

      {/* NO RESULT */}
      {!villaLoading && searchVillas.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          No villas found 😢
        </p>
      )}

      {/* RESULT VILLAS */}
      {!villaLoading && searchVillas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
          {searchVillas.map((villa) => (
            <VillaCard key={villa._id} villa={villa} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
