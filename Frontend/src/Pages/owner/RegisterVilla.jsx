import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const RegisterVilla = () => {
  const { axios, navigate } = useContext(AppContext);
  const [imageError, setImageError] = useState("");

  const [data, setData] = useState({
    villaName: "",
    villaContactNo: "",
    villaAddress: "",
    rating: "",
    guests: "",
    price: "",
    amenities: "",
    images: [],
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

    const { name, value } = e.target;

    if (name === "villaContactNo") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");

      setData({
        ...data,
        [name]: onlyNumbers,
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...data.images];
      updatedImages[index] = file;
      setData({ ...data, images: updatedImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("villaName", data.villaName);
    formData.append("villaContactNo", data.villaContactNo);
    formData.append("villaAddress", data.villaAddress);
    formData.append("rating", data.rating);
    formData.append("guests", data.guests);
    formData.append("price", data.price);
    formData.append("amenities", data.amenities);
    formData.append("meals", JSON.stringify(data.meals));

    const hasImage = data.images.some((img) => img);

    if (!hasImage) {
      setImageError("Please upload at least one villa image.");
      return;
    }

    setImageError("");

    for (let i = 0; i < data.images.length; i++) {
      formData.append("images", data.images[i]);
    }

    try {
      const { data: res } = await axios.post("/api/villa/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.success) {
        toast.success(res.message);
        navigate("/owner");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNumberChange = (e, min, max, integer = false) => {
    const { name, value } = e.target;

    if (value === "") {
      setData((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const num = integer ? parseInt(value, 10) : Number(value);

    if (
      !isNaN(num) &&
      num >= min &&
      (max === null || num <= max) &&
      (!integer || Number.isInteger(num))
    ) {
      setData((prev) => ({ ...prev, [name]: num }));
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-[#1E1E1E]/90">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Get Villa Images */}
        <div>
          <p className="text-base font-medium">Villa Images</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`villaImage${index}`}>
                  <input
                    type="file"
                    accept="image/*"
                    id={`villaImage${index}`}
                    hidden
                    onChange={(e) => {
                      handleImageChange(e, index);
                      setImageError("");
                    }}
                  />
                  <img
                    className="max-w-24 rounded-md cursor-pointer"
                    src={
                      data.images[index]
                        ? URL.createObjectURL(data.images[index])
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

        {/* Get Villa Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Villa Name</label>
          <input
            name="villaName"
            value={data.villaName}
            onChange={handleChange}
            type="text"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Get Villa villa Contact Number */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Villa Contact Number</label>
          <input
            name="villaContactNo"
            value={data.villaContactNo}
            onChange={handleChange}
            type="text"
            maxLength={10}
            inputMode="numeric"
            placeholder="Enter 10 digit number"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Get Villa Address */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Villa Address</label>
          <textarea
            name="villaAddress"
            value={data.villaAddress}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2">
          {/* Get Villa Ratings */}
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Rating</label>
            <input
              type="number"
              name="rating"
              min={0}
              max={5}
              step={1}
              value={data.rating}
              onChange={(e) => handleNumberChange(e, 0, 5)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          {/* Get Villa Guests */}
          <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
            <label htmlFor="guests">Guests</label>
            <input
              id="guests"
              name="guests"
              type="number"
              min={1}
              max={30}
              step={1}
              value={data.guests}
              onChange={(e) => handleNumberChange(e, 1, 30, true)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="bg-[#1E1E1E/80] rounded border border-gray-500/40 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
              required
            />
          </div>
        </div>

        {/* Get Villa Price Per Night Per Person */}
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium">Price</label>
          <input
            type="number"
            name="price"
            min={1}
            step={1}
            value={data.price}
             onChange={(e) => handleNumberChange(e, 1, null, true)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Get Villa Amenities */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Villa Amenities</label>
          <textarea
            name="amenities"
            value={data.amenities}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium">Meals Available</label>

          {["breakfast", "lunch", "dinner"].map((meal) => (
            <label key={meal} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={data.meals[meal]}
                onChange={(e) =>
                  setData({
                    ...data,
                    meals: {
                      ...data.meals,
                      [meal]: e.target.checked,
                    },
                  })
                }
              />
              {meal}
            </label>
          ))}
        </div>

        {/* Submit Form */}
        <button className="px-8 py-2.5 bg-[#6A0DAD] text-white font-medium rounded">
          Register Villa
        </button>
      </form>
    </div>
  );
};

export default RegisterVilla;
