import { useContext, useEffect, useState } from "react";

import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { AppContext } from "../Context/AppContext.jsx";
import toast from "react-hot-toast";

function MyBookings() {
  const { axios, navigate } = useContext(AppContext);

  const [bookingData, setBookingData] = useState([]);
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookingData(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const { data } = await axios.post("/api/bookings/stripe-payment", {
        bookingId,
      });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen text-[#ffffff] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Booking</h1>
          <p className="text-[#ffffff]/90 text-lg">
            {" "}
            Here are the villa bookings. You can view details and manage your
            reservations.
          </p>
        </div>

        {/* Booking List */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-12 bg-[#1E1E1E] px-6 py-4 border-b border-gray-400 font-semibold text-[#ffffff]">
            <div className="col-span-4 text-xl">Villa & Room</div>
            <div className="col-span-4 text-xl">Dates</div>
            <div className="col-span-4 text-xl">Payment</div>
            <div className="col-span-4 text-xl">Actions</div>
          </div>
          <div className="divide-y divide-gray-300">
            {bookingData.map((booking) => {
              const Icon = getStatusIcon(booking.status);
              return (
                <div
                  key={booking._id}
                  className="p-6 hover:bg-gray-800 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
                    {/* Villa and Room Information */}
                    <div className="col-span-1 md:col-span-4">
                      <div className="flex gap-4">
                        <img
                          src={`http://localhost:4000/images/${booking.room.images[0]}`}
                          alt={booking.room.roomType}
                          className="w-20 h-16 md:w-24 md:h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#ffffff] text-lg mb-1">
                            {booking.villa.villaName}
                          </h3>
                          <p className="text-blue-600 font-medium mb-1">
                            {booking.room.roomType}
                          </p>
                          <div className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {booking.villa.villaAddress}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Users className="w-3 h-3" />
                            <span>
                              {booking.persons} Guest
                              {booking.persons > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="col-span-1 md:col-span-3">
                      <div className="space-y-2">
                        {/* Check-In Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-300" />
                          <div>
                            <p className="text-sm text-gray-400">Check-in</p>
                            <p className="font-medium text-gray-100">
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-Us",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        {/* Check-Out Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-300" />
                          <div>
                            <p className="text-sm text-gray-400">Check-out</p>
                            <p className="font-medium text-gray-100">
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-Us",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="space-y-2">
                        <p className="font-bold text-lg text-gray-50">
                          ₹ {booking.totalPrice}
                        </p>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            booking.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <button
                            onClick={() => handlePayment(booking._id)}
                            className="cursor-pointer"
                          >
                            {booking.isPaid ? "Paid" : "Pay Now"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center gap-2">
                        {/* <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        ></div> */}
                        <Icon
                          className={`w-4 h-4 ${getStatusTextColor(
                            booking.status
                          )}`}
                        />
                        <span
                          className={`font-medium capitalize ${getStatusTextColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
