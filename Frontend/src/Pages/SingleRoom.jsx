import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";
import {
  Bath,
  Building,
  Car,
  Coffee,
  Eye,
  Mountain,
  TreePine,
  Tv,
  User,
  Utensils,
  Wifi,
} from "lucide-react";
import { MdLocationPin } from "react-icons/md";
import {
  Star,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Phone,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

function SingleRoom() {
  const { roomData, axios, navigate } = useContext(AppContext);
  const { id } = useParams();
  const room = roomData.find((r) => r._id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
  });
  const [isAvailable, setIsAvailable] = useState(false);

  const onChangeHandler = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Ocean View": Eye,
      "Mountain View": Mountain,
      "City View": Building,
      "Garden View": TreePine,
      Balcony: Building,
      "Mini Bar": Coffee,
      "Room Service": Utensils,
      "Free Wifi": Wifi,
      "Premium Wifi": Wifi,
      "Work Desk": Building,
      "Concierge Service": User,
      "Breakfast Included": Coffee,
      Parking: Car,
      "Smart TV": Tv,
      "Spa Access": Bath,
      "Pool Access": Bath,
      Kitchen: Utensils,
      "Living Area": Building,
      "Private Terrace": Building,
      "Butler Service": User,
      Jacuzzi: Bath,
      "Panoramic View": Eye,
    };
    return iconMap[amenity] || CheckCircle;
  };

  const checkRoomAvailability = async () => {
    try {
      if (bookingData.checkIn >= bookingData.checkOut) {
        toast.error("Check-In date should be before Check-Out date");
        return;
      }
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: room._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
      });
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.success("Room is not available");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        return checkRoomAvailability();
      } else {
        const { data } = await axios.post("/api/bookings/book", {
          room: room._id,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          persons: bookingData.persons,
          paymentMethod: "Pay At Villa",
        });
        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
          scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="py-0 min-h-screen bg-[#0D0D0D80]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section of Perticular Room*/}
        <div className="bg-[#1E1E1E]/80 text-[#ffffff] rounded-2xl shadow-lg p-8 mb-8 ">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1 ">
              <h1 className="text-4xl font-bold">{room.roomType}</h1>
              <div className="flex items-center gap-2 text-[#ffffff]/60 mb-4">
                <MdLocationPin
                  size="1.5em"
                  color="red"
                  className="mt-1 top-[5px]"
                />
                <span className="w-auto h-auto">{room.villa.villaAddress}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>{room.villa.rating}</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    room.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h4" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Not Available
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right ">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹ {room.pricePerNight} <span>/night</span>
              </div>

              <div className="text-gray-500">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span>{room.villa.owner.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500 " />
                  <span>+915675462547</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images of Perticular Room */}
        <div className="bg-[#1E1E1E]/80 text-[#ffffff] rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">Room Images</h2>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <img
                src={`http://localhost:4000/images/${room.images[selectedImage]}`}
                alt={`${room.roomType} - Image ${selectedImage + 1} `}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {room.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`h-24 lg:h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedImage === index
                      ? "ring-4 ring-blue-500 opacity-100"
                      : "opacity-70 hover:opacity-100"
                  } `}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* About or Details about perticular room */}
        <div className="grid lg:grid-cols-3 gap-8 ">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1E1E1E]/80 text-[#ffffff] rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">About This Room</h2>
              <p className="text-[#ffffff]/60 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-[#1E1E1E]/80 text-[#ffffff] rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
                {room.amenities.split(",").map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E1E1E]/80 text-[#ffffff] rounded-2xl shadow-lg p-8 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Book This Villa</h2>
              <form onSubmit={onSubmitHandler} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-[#ffffff]/80 mb-2"
                    htmlFor=""
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingData.checkIn}
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-[#ffffff]/80 mb-2"
                    htmlFor=""
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    min={bookingData.checkIn}
                    value={bookingData.checkOut}
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-[#ffffff]/80 mb-2"
                    htmlFor=""
                  >
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    value={bookingData.persons}
                    name="persons"
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#ffffff]/90">Priceper Night</span>
                    <span className="text-xl font-bold">
                      ₹ {room.pricePerNight}
                    </span>
                  </div>
                </div>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
                  type="submit"
                >
                  {isAvailable ? "Book Now" : "Check Availability"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleRoom;
