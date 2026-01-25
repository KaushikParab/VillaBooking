import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const RegisterVilla = () => {
  const { axios, navigate } = useContext(AppContext);

  const [data, setData] = useState({
    villaName: "",
    villaContactNo: "",
    villaAddress: "",
    rating: "",
    guests: "",
    price: "",
    amenities: "",
    images: [],
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
                    onChange={(e) => handleImageChange(e, index)}
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
          />
        </div>

        <div className="grid grid-cols-2">
          {/* Get Villa Ratings */}
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Rating</label>
            <input
              min={0}
              max={5}
              type="number"
              name="rating"
              value={data.rating}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          {/* Get Villa Guests */}
          <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
            <label htmlFor="guests">Guests</label>
            <input
              min={1}
              max={30}
              id="guests"
              name="guests"
              type="number"
              value={data.guests}
              onChange={handleChange}
              className="bg-[#1E1E1E/80] rounded border border-gray-500/40 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16"
            />
          </div>
        </div>

        {/* Get Villa Price Per Night Per Person */}
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium">Price</label>
          <input
            min={0}
            type="number"
            name="price"
            value={data.price}
            onChange={handleChange}
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

        {/* Submit Form */}
        <button className="px-8 py-2.5 bg-[#6A0DAD] text-white font-medium rounded">
          Register Villa
        </button>
      </form>
    </div>
  );
};

export default RegisterVilla;
