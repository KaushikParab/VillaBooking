import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { MapIcon, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";

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
      toast.error(data.message);
    }
  };
  useEffect(() => {
    fetchOwnerVillas();
  }, []);

  const deleteVilla = async (id) => {
    try {
      const { data } = await axios.delete(`/api/villa/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerVillas();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-[#1E1E1E] rounded-2xl shadow-xl p-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Premium Villas Collection
            </h1>
            <p className="text-[#ffffff]/75">
              Discover exceptional stays around the world
            </p>
          </div>
          <button
            className="bg-[#6A0DAD] text-white px-6 py-1 rounded-md cursor-pointer"
            onClick={() => navigate("/owner/register-villa")}
          >
            Register Villa
          </button>
        </div>

        {/* Hotel Table */}
        <div className="bg-[#1E1E1E]/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-black to-indigo-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Villa
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Villa Owner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Price/Night
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {villaData.map((villa, index) => (
                  <tr
                    key={villa._id}
                    className={`hover:bg-[#616161] transition-all duration-200 ${
                      index % 2 === 0 ? "bg-[#1E1E1E]/80" : "bg-[#282626]"
                    }`}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={`http://localhost:4000/images/${villa.image}`}
                            alt={villa.villaName}
                            className="w-20 h-16 rounded-xl object-cover min-w-10 shadow-md"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white hover:text-amber-500 transition-colors">
                            {villa.villaName}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-start space-x-2">
                        <MapIcon className="w-4 h-4 text-white/80 mt-1 flex-shrink-0" />
                        <span className="text-white/80 text-sm leading-relaxed">
                          {villa.villaAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-start space-x-2">
                        <span className="text-white/80 text-sm leading-relaxed">
                          {villa.owner.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-start space-x-2">
                        <span className="text-white/80 text-sm leading-relaxed">
                          +914578346219
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-start space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white/80 text-sm leading-relaxed">
                          {villa.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-2xl font-bold text-green-500">
                        ₹ {villa.price}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-1">
                        {villa.amenities.split(",").map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteVilla(villa._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-full cursor-pointer"
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
