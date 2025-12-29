import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { MapIcon, Star } from "lucide-react";
import toast from "react-hot-toast";

function AllVillas() {
  const { navigate, axios } = useContext(AppContext);
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
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOwnerVillas();
  }, []);

  //  DELETE VILLA 
  const deleteVilla = async (id) => {
    try {
      const { data } = await axios.delete("/api/villa/delete/" + id);

      if (data.success) {
        toast.success(data.message);
        fetchOwnerVillas();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-[#1E1E1E] rounded-2xl shadow-xl p-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Your Villas
            </h1>
            <p className="text-white/70">
              Manage all your registered villas
            </p>
          </div>
          <button
            className="bg-[#6A0DAD] text-white px-6 py-2 rounded-md"
            onClick={() => navigate("/owner/register-villa")}
          >
            Register Villa
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1E1E1E]/90 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gradient-to-r from-black to-indigo-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">VILLA</th>
                  <th className="px-6 py-4 text-left">LOCATION</th>
                  <th className="px-6 py-4 text-left">VILLA OWNER</th>
                  <th className="px-6 py-4 text-left">CONTACT</th>
                  <th className="px-6 py-4 text-left">RATING</th>
                  <th className="px-6 py-4 text-left">PRICE/NIGHT</th>
                  <th className="px-6 py-4 text-left">AMENITIES</th>
                  <th className="px-6 py-4 text-left">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {villaData.map((villa, index) => (
                  <tr
                    key={villa._id}
                    className={`${
                      index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#2A2A2A]"
                    } hover:bg-[#3A3A3A] transition`}
                  >
                    {/* Villa */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            villa.images?.length
                              ? `http://localhost:4000/images/${villa.images[0]}`
                              : "/no-image.png"
                          }
                          alt={villa.villaName}
                          className="w-20 h-16 rounded-lg object-cover"
                        />
                        <span className="text-white font-semibold">
                          {villa.villaName}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5 text-white/80">
                      <div className="flex gap-2">
                        <MapIcon size={16} />
                        {villa.villaAddress}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-5 text-white/80">
                      {villa.owner?.name}
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5 text-white/80">
                      {villa.villaContactNo}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-5 text-white/80 flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      {villa.rating}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5 text-green-500 font-bold">
                      ₹ {villa.price}
                    </td>

                    {/* Amenities */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {villa.amenities
                          ?.split(",")
                          .map((a, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
                            >
                              {a}
                            </span>
                          ))}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <button
                        onClick={() => deleteVilla(villa._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllVillas;
