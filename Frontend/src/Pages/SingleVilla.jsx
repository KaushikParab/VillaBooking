import { useContext, useState, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  CheckCircle,
  Eye,
  Mountain,
  TreePine,
  Wifi,
  Car,
  Utensils,
  Tv,
  Bath,
  Coffee,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Phone,
  Home,
} from "lucide-react";
import { MdLocationPin } from "react-icons/md";

function SingleVilla() {
  const { villaData, roomData } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const villa = villaData.find((v) => v._id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  /* ================= ROOMS ================= */
  const villaRooms = roomData.filter((room) => room.villa?._id === villa?._id);

  const [roomImageIndex, setRoomImageIndex] = useState({});
  const touchStartX = useRef({});

  /* ================= ROOM CAROUSEL ================= */
  const nextImage = (roomId, length) => {
    setRoomImageIndex((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % length,
    }));
  };

  const prevImage = (roomId, length) => {
    setRoomImageIndex((prev) => ({
      ...prev,
      [roomId]:
        (prev[roomId] || 0) === 0 ? length - 1 : (prev[roomId] || 0) - 1,
    }));
  };

  const handleTouchStart = (e, roomId) => {
    touchStartX.current[roomId] = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, roomId, length) => {
    const diff = touchStartX.current[roomId] - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage(roomId, length) : prevImage(roomId, length);
    }
  };

  if (!villa) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  const getAmenityIcon = (amenity) => {
    const map = {
      "Ocean View": Eye,
      "Mountain View": Mountain,
      "Garden View": TreePine,
      "Free Wifi": Wifi,
      Parking: Car,
      Kitchen: Utensils,
      "Smart TV": Tv,
      Jacuzzi: Bath,
      "Breakfast Included": Coffee,
    };
    return map[amenity] || CheckCircle;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D80] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= HEADER ================= */}
        <div className="bg-[#1E1E1E]/80 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            {/* LEFT */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{villa.villaName}</h1>

              <div className="flex items-center gap-2 text-white/60 mt-2">
                <MdLocationPin className="text-red-500" />
                <span>{villa.villaAddress}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                  <span>{villa.rating}</span>
                </div>

                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Home className="w-4 h-4" />
                  <span>{villaRooms.length} Rooms</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <div className="text-3xl font-bold text-green-500 mb-2">
                ₹ {villa.price}
                <span className="text-lg text-white/60"> / night</span>
              </div>

              <div className="text-white/70 space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <UserIcon className="w-5 h-5" />
                  <span>{villa.owner?.name}</span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Phone className="w-5 h-5" />
                  <span>{villa.villaContactNo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VILLA IMAGES ================= */}
        <div className="bg-[#1E1E1E]/80 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl text-white font-bold mb-6">Villa Images</h2>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <img
                src={`http://localhost:4000/images/${villa.images[selectedImage]}`}
                className="w-full h-96 object-cover rounded-xl"
                alt="Villa"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {villa.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/images/${img}`}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 object-cover rounded-lg cursor-pointer ${
                    selectedImage === index
                      ? "ring-4 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= ROOMS ================= */}
        <div className="bg-[#1E1E1E]/80 rounded-2xl p-8">
          <h2 className="text-3xl text-white font-bold mb-6">
            Rooms in This Villa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {villaRooms.map((room) => {
              const index = roomImageIndex[room._id] || 0;

              return (
                <div
                  key={room._id}
                  className="bg-[#0f0f0f] rounded-xl overflow-hidden shadow-lg"
                >
                  <div
                    className="relative h-56"
                    onTouchStart={(e) => handleTouchStart(e, room._id)}
                    onTouchEnd={(e) =>
                      handleTouchEnd(e, room._id, room.images.length)
                    }
                  >
                    <img
                      src={`http://localhost:4000/images/${room.images[index]}`}
                      className="w-full h-full object-cover"
                      alt={room.roomType}
                    />

                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            prevImage(room._id, room.images.length)
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() =>
                            nextImage(room._id, room.images.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">
                      {room.roomType}
                    </h3>
                    <p className="text-green-400 font-bold mb-4">
                      ₹ {room.pricePerNight} / night
                    </p>
                    <button
                      onClick={() => navigate(`/room/${room._id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                    >
                      View Room
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* AMENITIES */}
        <div className="bg-[#1E1E1E]/80 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {villa.amenities.split(",").map((amenity, i) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div key={i} className="flex gap-3 bg-blue-50 p-3 rounded-lg">
                  <Icon className="text-blue-600" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleVilla;
