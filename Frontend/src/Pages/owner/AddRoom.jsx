import { useState } from "react";
import { useEffect } from "react";

import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../Context/AppContext";

const AddRoom = () => {
  const { axios, navigate } = useContext(AppContext);
  const [roomData, setRoomData] = useState({
    villa: "",
    roomType: "",
    guests: "",
    pricePerNight: "",
    description: "",
    amenities: [],
    images: [],
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
    isAvailable: true,
  });
  const [imageError, setImageError] = useState("");

  const [villaData, setVillaData] = useState([]);
  const fetchOwnerVillas = async () => {
    try {
      const { data } = await axios.get("/api/villa/get");
      if (data.success) {
        setVillaData(data.villas);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    fetchOwnerVillas();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setRoomData({
      ...roomData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...roomData.images];
      updatedImages[index] = file;
      setRoomData({ ...roomData, images: updatedImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("villa", roomData.villa);
    formData.append("roomType", roomData.roomType);
    formData.append("guests", roomData.guests);
    formData.append("pricePerNight", roomData.pricePerNight);
    formData.append("description", roomData.description);
    formData.append("isAvailable", roomData.isAvailable);
    formData.append("amenities", roomData.amenities);
    formData.append("meals", JSON.stringify(roomData.meals));

    const hasImage = roomData.images.some((img) => img);

    if (!hasImage) {
      setImageError("Please upload at least one villa image.");
      return;
    }

    setImageError("");

    for (let i = 0; i < roomData.images.length; i++) {
      formData.append("images", roomData.images[i]);
    }
    try {
      const { data } = await axios.post("/api/room/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/owner/rooms");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNumberChange = (e, min, max, integer = false) => {
    const { name, value } = e.target;

    if (value === "") {
      setRoomData((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const num = integer ? parseInt(value, 10) : Number(value);

    if (
      !isNaN(num) &&
      num >= min &&
      (max === null || num <= max) &&
      (!integer || Number.isInteger(num))
    ) {
      setRoomData((prev) => ({ ...prev, [name]: num }));
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-[#1E1E1E]/90">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Room Image</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    type="file"
                    accept="image/*"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => {
                      handleImageChange(e, index);
                      setImageError("");
                    }}
                  />
                  <img
                    className="max-w-24 rounded-md cursor-pointer"
                    src={
                      roomData.images[index]
                        ? URL.createObjectURL(roomData.images[index])
                        : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                    }
                    alt="upload"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
          {imageError && (
            <p className="text-red-500 text-sm mt-2">{imageError}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Room Type
          </label>
          <input
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Guests</label>
            <input
              min={1}
              max={30}
              step={1}
              type="number"
              name="guests"
              value={roomData.guests}
              onChange={(e) => handleNumberChange(e, 1, 30, true)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Room Description
          </label>
          <textarea
            name="description"
            value={roomData.description}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            required
          ></textarea>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              pricePerNight
            </label>
            <input
              min={0}
              step={1}
              type="number"
              name="pricePerNight"
              value={roomData.pricePerNight}
              onChange={(e) => handleNumberChange(e, 1, 500000, true)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Room Amenities
          </label>
          <textarea
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            required
          ></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium">Meals Available</label>

          {["breakfast", "lunch", "dinner"].map((meal) => (
            <label key={meal} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={roomData.meals[meal]}
                onChange={(e) =>
                  setRoomData({
                    ...roomData,
                    meals: {
                      ...roomData.meals,
                      [meal]: e.target.checked,
                    },
                  })
                }
              />
              <span className="capitalize">{meal}</span>
            </label>
          ))}
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="">Select Villa</label>
          <select
            name="villa"
            value={roomData.villa}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 bg-gray-800"
            required
          >
            <option value="">Select Villa</option>
            {villaData.map((item) => (
              <option key={item._id} value={item._id}>
                {item.villaName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="">
              isAvailable
              <input
                type="checkbox"
                name="isAvailable"
                onChange={handleChange}
                value={roomData.isAvailable}
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 ml-2"
                required
              />
            </label>
          </div>
        </div>
        <button className="px-8 py-2.5 bg-[#6A0DAD] text-white font-medium rounded">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
