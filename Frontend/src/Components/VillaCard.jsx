import { MapPin, Star, Users, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VillaCard({ villa }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/villa/${villa._id}`)}
      className="group bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={
            villa.images?.length
              ? `http://localhost:4000/images/${villa.images[0]}`
              : "/no-image.png"
          }
          alt={villa.villaName}
          className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
          <Star size={14} className="text-yellow-400" />
          {villa.rating || "4.5"}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-[#6A0DAD] px-4 py-2 rounded-full text-white font-bold text-sm">
          ₹ {villa.price} / night
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        {/* Villa Name */}
        <h2 className="text-xl font-semibold text-white truncate">
          {villa.villaName}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <MapPin size={16} />
          <span className="truncate">{villa.villaAddress}</span>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mt-2">
          {villa.amenities
            ?.split(",")
            .slice(0, 3)
            .map((a, i) => (
              <span
                key={i}
                className="bg-white/10 text-white text-xs px-2 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
          {villa.amenities?.split(",").length > 3 && (
            <span className="text-xs text-white/50">+ more</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <Users size={16} />
            <span>{villa.guests || 6} Guests</span>
          </div>

          <button className="
              bg-gradient-to-r from-[#6A0DAD] to-[#FFD369]
              text-white font-medium text-sm
              rounded-md px-4 py-1.5
              transition-all duration-300
              hover:from-[#FFD369] hover:to-[#6A0DAD]
              hover:text-black
            ">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
