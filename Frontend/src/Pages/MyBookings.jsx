import { useContext, useEffect, useState } from "react";
import { MapPin, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { AppContext } from "../Context/AppContext.jsx";
import toast from "react-hot-toast";

function MyBookings() {
  const [cancellingId, setCancellingId] = useState(null);
  const { axios } = useContext(AppContext);
  const [bookingData, setBookingData] = useState([]);

  // ================= FETCH BOOKINGS =================
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

  // ================= PAY NOW (RAZORPAY) =================
const handlePayment = async (bookingId) => {
  try {
    const { data } = await axios.post("/api/bookings/razorpay-order", {
      bookingId,
    });

    if (!data.success) {
      toast.error("Failed to create order");
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,
      name: "Villa Booking",
      description: "Complete your booking payment",

      handler: async function (response) {
        const verifyRes = await axios.post(
          "/api/bookings/razorpay-verify",
          {
            ...response,
            bookingId,
          }
        );

        if (verifyRes.data.success) {
          toast.success("Payment Successful!");
          fetchMyBookings();
        } else {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name: "Guest",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    toast.error(error.message);
  }
};

  // ================= PAY AT VILLA =================
  const handlePayAtVilla = async (bookingId) => {
    try {
      const { data } = await axios.post("/api/bookings/pay-at-villa", {
        bookingId,
      });

      if (data.success) {
        toast.success(data.message);
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= CANCEL BOOKING =================
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    setCancellingId(bookingId);

    try {
      const { data } = await axios.post("/api/bookings/cancel", {
        bookingId,
      });

      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchMyBookings();
      } else {
        toast.error(data.message);
        setCancellingId(null);
      }
    } catch (error) {
      toast.error(error.message);
      setCancellingId(null);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchMyBookings();
    const interval = setInterval(fetchMyBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusTextColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-400";
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
  const canCancelBooking = (booking) => {
    if (booking.status === "cancelled") return false;

    if (booking.status === "confirmed" && booking.paymentMethod === "Razorpay") {
      return false;
    }

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const diffInHours = (checkIn - now) / (1000 * 60 * 60);

    return diffInHours >= 24;
  };

  return (
    <div className="min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-white/80 text-lg">
            View and manage your reservations
          </p>
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl shadow-lg overflow-hidden">
          {/* HEADER */}
          <div className="hidden md:grid md:grid-cols-12 px-6 py-4 border-b border-gray-500 font-semibold">
            <div className="col-span-4">Villa & Room</div>
            <div className="col-span-3">Dates</div>
            <div className="col-span-3">Payment</div>
            <div className="col-span-2">Status</div>
          </div>

          <div className="divide-y divide-gray-600">
            {bookingData.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);

              return (
                <div
                  key={booking._id}
                  className="p-6 hover:bg-gray-800 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* VILLA & ROOM */}
                    <div className="md:col-span-4 flex gap-4">
                      <img
                        src={
                          booking.villa?.images?.[0]
                            ? booking.villa.images[0]
                            : "https://via.placeholder.com/150"
                        }
                        className="w-24 h-20 rounded-lg object-cover"
                        alt="villa"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.villa?.villaName || "Villa"}
                        </h3>
                        <p className="text-blue-500">
                          {booking.room?.roomType || ""}
                        </p>

                        <div className="flex items-center text-sm text-gray-400 gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.villa?.villaAddress}
                        </div>

                        <div className="flex items-center text-sm text-gray-400 gap-1">
                          <Users className="w-3 h-3" />
                          {booking.persons} Guests
                        </div>
                      </div>
                    </div>

                    {/* DATES */}
                    <div className="md:col-span-3 text-sm">
                      <p>
                        <span className="text-gray-400">Check-in:</span>{" "}
                        {new Date(booking.checkIn).toDateString()}
                      </p>
                      <p>
                        <span className="text-gray-400">Check-out:</span>{" "}
                        {new Date(booking.checkOut).toDateString()}
                      </p>
                    </div>

                    {/* PAYMENT */}
                    <div className="md:col-span-3 flex items-start gap-6">
                      {/* Total Price */}
                      <p className="font-bold text-lg">
                        ₹ {booking.totalPrice}
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-col space-y-1">
                        {!booking.isPaid && booking.status === "pending" && (
                          <button
                            onClick={() => handlePayment(booking._id)}
                            className="text-green-600 hover:text-white hover:bg-green-700 px-3 py-1 rounded-md transition"
                          >
                            Pay Now
                          </button>
                        )}

                        {!booking.isPaid && booking.status === "pending" && (
                          <button
                            onClick={() => handlePayAtVilla(booking._id)}
                            className="text-blue-500 hover:text-white hover:bg-blue-600 px-3 py-1 rounded-md transition"
                          >
                            Pay at Villa
                          </button>
                        )}

                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className={`text-sm px-3 py-1 rounded-md transition-all duration-200 ${
                              cancellingId === booking._id
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "text-rose-600 hover:text-white hover:bg-rose-600 hover:scale-105"
                            }`}
                          >
                            {cancellingId === booking._id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* STATUS */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <StatusIcon
                        className={`w-4 h-4 ${getStatusTextColor(
                          booking.status,
                        )}`}
                      />
                      <span
                        className={`capitalize ${getStatusTextColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
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
