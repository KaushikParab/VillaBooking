import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const RegisterVilla = () => {
  const { axios, navigate } = useContext(AppContext);

  const [data, setData] = useState({
    villaName: "",
    villaAddress: "",
    rating: "",
    price: "",
    amenities: "",
    image: null,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setData({ ...data, image: selectedFile });
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("villaName", data.villaName);
    formData.append("villaAddress", data.villaAddress);
    formData.append("rating", data.rating);
    formData.append("price", data.price);
    formData.append("amenities", data.amenities);
    formData.append("image", file);
    try {
      const { data } = await axios.post("/api/villa/register", formData);
      if (data.success) {
        toast.success(data.message);
        navigate("/owner");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="py-10 flex flex-col justify-between bg-[#1E1E1E]/90">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Villa Image</p>

          <div className="w-full my-4">
            {/* Villa Image Preview */}
            {preview && (
              <div className="mb-3 flex justify-center">
                <img
                  src={preview}
                  alt=""
                  className="w-24 h-24 object-cover rounded shadow"
                />
              </div>
            )}

            {/* File Upload Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#6A0DAD] hover:file:bg-purple-200 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Villa Name
          </label>
          <input
            name="villaName"
            value={data.villaName}
            onChange={handleChange}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Villa Address
          </label>
          <textarea
            name="villaAddress"
            value={data.villaAddress}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              value={data.rating}
              onChange={handleChange}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={handleChange}
              placeholder="0"
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
            Villa Amenities
          </label>
          <textarea
            name="amenities"
            value={data.amenities}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <button className="px-8 py-2.5 bg-[#6A0DAD] text-white font-medium rounded">
          Register Villa
        </button>
      </form>
    </div>
  );
};

export default RegisterVilla;
