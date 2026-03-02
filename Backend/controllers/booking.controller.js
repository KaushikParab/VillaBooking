import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Villa from "../models/villa.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import AvailabilityBlock from "../models/availabilityBlock.model.js";

// ================= EMAIL HELPER =================
const sendBookingEmail = async (booking, subject, title) => {
  try {
    if (!booking.user || !booking.villa) return;

    const owner = await User.findById(booking.villa.owner);

    const recipients = [booking.user.email, owner?.email].filter(Boolean);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: recipients.join(","),
      subject,
      html: `
        <h2>${title}</h2>
        <hr/>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Villa:</strong> ${booking.villa?.villaName || "Villa"}</p>
        <p><strong>Room:</strong> ${booking.room?.roomType || "Entire Villa"}</p>
        <p><strong>Check-in:</strong> ${new Date(
          booking.checkIn,
        ).toDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(
          booking.checkOut,
        ).toDateString()}</p>
        <p><strong>Guests:</strong> ${booking.persons}</p>
        <p><strong>Total Price:</strong> ₹ ${booking.totalPrice}</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      `,
    });
  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

export const checkAvailability = async ({
  villa,
  checkInDate,
  checkOutDate,
}) => {

  const dateFilter = {
    villa,
    checkIn: { $lte: new Date(checkOutDate) },
    checkOut: { $gte: new Date(checkInDate) },
  };

  // WEBSITE BOOKINGS
  const bookingExists = await Booking.findOne({
    ...dateFilter,
    status: { $ne: "cancelled" },
  });

  if (bookingExists) return false;

  // MANUAL BLOCKS
  const blockExists = await AvailabilityBlock.findOne(dateFilter);

  if (blockExists) return false;

  return true;
};

/* ================================
   CHECK ROOM AVAILABILITY API
================================ */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const roomData = await Room.findById(room).populate("villa");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const isAvailable = await checkAvailability({
      villa: roomData.villa._id,
      checkInDate,
      checkOutDate,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================================
   CHECK VILLA AVAILABILITY API
================================ */
export const checkVillaAvailability = async (req, res) => {
  try {
    const { villa, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      villa,
      checkInDate,
      checkOutDate,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// -----------DYNAMIC DAY-WISE PRICE CALCULATOR-------------
const calculateDynamicPrice = ({
  basePrice,
  persons,
  checkIn,
  checkOut,
  discountPercent = 10,
}) => {
  let total = 0;

  const current = new Date(checkIn);

  while (current < checkOut) {
    const day = current.getDay(); // 0=Sun, 6=Sat

    const isWeekend = day === 0 || day === 6;

    let priceForThisNight = basePrice;

    if (!isWeekend) {
      priceForThisNight = basePrice - (basePrice * discountPercent) / 100;
    }

    total += priceForThisNight * persons;

    current.setDate(current.getDate() + 1);
  }

  return Math.round(total);
};

/* ================================
   BOOK ROOM OR ENTIRE VILLA
================================ */
export const bookRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    const { room, villa, checkInDate, checkOutDate, persons, paymentMethod } =
      req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    /* =========================
       ENTIRE VILLA BOOKING
    ========================= */
    if (villa) {
      const rooms = await Room.find({ villa });

      if (!rooms.length) {
        return res.status(400).json({
          success: false,
          message: "No rooms found in this villa",
        });
      }

      const isAvailable = await checkAvailability({
        villa,
        checkInDate,
        checkOutDate,
      });

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Villa already booked for selected dates",
        });
      }

      const villaData = await Villa.findById(villa);
      if (!villaData) {
        return res.status(404).json({
          success: false,
          message: "Villa not found",
        });
      }
      const pricePerPersonPerNight = Number(villaData.price);

      const totalPrice = calculateDynamicPrice({
        basePrice: pricePerPersonPerNight,
        persons,
        checkIn,
        checkOut,
        discountPercent: 15,
      });

      const booking = await Booking.create({
        user: id,
        villa,
        rooms: rooms.map((r) => r._id),
        bookingType: "villa",
        checkIn,
        checkOut,
        persons,
        totalPrice,
        paymentMethod,
        status: "pending",
        isPaid: false,
      });

      // AUTO DELETE IF NOT PAID IN 1 MIN
      setTimeout(
        async () => {
          const latest = await Booking.findById(booking._id);

          if (!latest) return;

          const now = new Date();
          const checkInDate = new Date(latest.checkIn);
          const diffInHours = (checkInDate - now) / (1000 * 60 * 60);

          if (
            !latest.isPaid &&
            latest.status === "pending" &&
            diffInHours > 24
          ) {
            await Booking.findByIdAndDelete(latest._id);
          }
        },
        1 * 60 * 1000,
      );

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Villa Booking Created",
        html: `
          <h2>Entire Villa Booking Created</h2>
          <p>Your villa is reserved for 1 minute.</p>
          <p>Please complete payment.</p>
        `,
      });

      return res.json({
        success: true,
        message: "Villa booking created. Complete payment.",
        bookingId: booking._id,
      });
    }

    /* =========================
       SINGLE ROOM BOOKING
    ========================= */
    const roomData = await Room.findById(room).populate("villa");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const isAvailable = await checkAvailability({
      villa: roomData.villa._id,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Villa is already booked for these dates",
      });
    }

    const totalPrice = calculateDynamicPrice({
      basePrice: roomData.pricePerNight,
      persons,
      checkIn,
      checkOut,
      discountPercent: 15,
    });

    const booking = await Booking.create({
      user: id,
      room,
      villa: roomData.villa._id,
      bookingType: "room",
      checkIn,
      checkOut,
      persons,
      totalPrice,
      paymentMethod,
      status: "pending",
      isPaid: false,
    });

    setTimeout(
      async () => {
        const latest = await Booking.findById(booking._id);
        if (latest && !latest.isPaid) {
          await Booking.findByIdAndDelete(booking._id);
        }
      },
      1 * 60 * 1000,
    );

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Room Booking Created",
      html: `
        <h2>Room Booking Created</h2>
        <p>Your booking is reserved for 1 minute.</p>
      `,
    });

    res.json({
      success: true,
      message: "Room booking created. Complete payment.",
      bookingId: booking._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================================
   RAZORPAY PAYMENT
================================ */
export const razorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const options = {
      amount: booking.totalPrice * 100, // amount in paise
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const booking =
      await Booking.findById(bookingId).populate("villa room user");
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    booking.isPaid = true;
    booking.status = "confirmed";
    booking.paymentMethod = "Razorpay";
    booking.expiresAt = null;

    await booking.save();

    await sendBookingEmail(
      booking,
      "Booking Confirmed - Payment Successful",
      "Payment Successful 🎉",
    );

    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/* ================================
   USER BOOKINGS
================================ */
export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("room rooms villa")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

/* ================================
   VILLA BOOKINGS (OWNER)
================================ */
export const getVillaBookings = async (req, res) => {
  const villas = await Villa.find({ owner: req.user.id });
  const villaIds = villas.map((v) => v._id);

  const bookings = await Booking.find({ villa: { $in: villaIds } })
    .populate("room rooms villa user")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

export const payAtVilla = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be confirmed",
      });
    }

    booking.paymentMethod = "Pay At Villa";
    booking.status = "confirmed";
    booking.isPaid = false;
    booking.expiresAt = null;

    await booking.save();

    const populatedBooking =
      await Booking.findById(bookingId).populate("villa room user");

    await sendBookingEmail(
      populatedBooking,
      "Booking Confirmed - Pay at Villa",
      "Booking Confirmed 🏡",
    );

    res.json({
      success: true,
      message: "Booking confirmed. Pay at villa.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    // Paid bookings cannot be cancelled directly
    if (
      booking.status === "confirmed" &&
      booking.paymentMethod === "Razorpay" &&
      booking.isPaid
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Paid Razorpay bookings cannot be cancelled. Please contact support for refund.",
      });
    }

    // Cannot cancel within 24 hours of check-in
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const diffInHours = (checkInDate - now) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled within 24 hours of check-in",
      });
    }

    //  Cancel booking
    booking.status = "cancelled";
    booking.isPaid = false;

    await booking.save();

    const populatedBooking =
      await Booking.findById(bookingId).populate("villa room user");

    await sendBookingEmail(
      populatedBooking,
      "Booking Cancelled",
      "Booking Cancelled ❌",
    );

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================
   PREVIEW DYNAMIC PRICE
================================ */
export const previewBookingPrice = async (req, res) => {
  try {
    const { villa, room, checkInDate, checkOutDate, persons } = req.body;

    if (!checkInDate || !checkOutDate || !persons) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: "Invalid date selection",
      });
    }

    let basePrice = 0;
    let villaId;

    // ===== VILLA BOOKING =====
    if (villa) {
      const villaData = await Villa.findById(villa);
      if (!villaData)
        return res
          .status(404)
          .json({ success: false, message: "Villa not found" });

      basePrice = Number(villaData.price);
      villaId = villaData._id;
    }

    // ===== ROOM BOOKING =====
    if (room) {
      const roomData = await Room.findById(room).populate("villa");
      if (!roomData)
        return res
          .status(404)
          .json({ success: false, message: "Room not found" });

      basePrice = roomData.pricePerNight;
      villaId = roomData.villa._id;
    }

    // ===== CHECK AVAILABILITY =====
    const isAvailable = await checkAvailability({
      villa: villaId,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({
        success: true,
        isAvailable: false,
      });
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const discountPercent = 15;
    const totalPrice = calculateDynamicPrice({
      basePrice,
      persons,
      checkIn,
      checkOut,
      discountPercent,
    });

    return res.json({
      success: true,
      isAvailable: true,
      priceDetails: {
        basePrice,
        persons,
        nights,
        totalPrice,
        discountPercent,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   OWNER EARNINGS API
====================================== */

export const getOwnerEarnings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { startDate, endDate } = req.query;

    // ===== OWNER VILLAS =====
    const ownerVillas = await Villa.find({ owner: ownerId }).select("_id");

    if (!ownerVillas.length) {
      return res.json({
        success: true,
        earnings: [],
        stats: {
          totalBookings: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
        },
      });
    }

    const ownerVillaIds = ownerVillas.map(v => v._id);

    // ===== MATCH FILTER =====
    let matchStage = {
      villa: { $in: ownerVillaIds },
    };

    if (startDate && endDate) {
      matchStage.$and = [
        { checkIn: { $lte: new Date(endDate) } },
        { checkOut: { $gte: new Date(startDate) } },
      ];
    }

    // ===== SINGLE OPTIMIZED AGGREGATION =====
    const result = await Booking.aggregate([
      { $match: matchStage },

      {
        $facet: {

          /* =====================
             EARNINGS PER VILLA
          ===================== */
          earnings: [
            { $match: { status: "confirmed" } },

            {
              $lookup: {
                from: "villas",
                localField: "villa",
                foreignField: "_id",
                as: "villaData",
              },
            },
            { $unwind: "$villaData" },

            {
              $group: {
                _id: "$villaData.villaName",
                totalEarnings: { $sum: "$totalPrice" },
                totalBookings: { $sum: 1 },
              },
            },

            { $sort: { totalEarnings: -1 } },
          ],

          /* =====================
             BOOKING STATS
          ===================== */
          stats: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // ===== FORMAT STATS =====
    const statsData = result[0].stats || [];

    const stats = {
      totalBookings: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };

    statsData.forEach(s => {
      stats.totalBookings += s.count;

      if (s._id === "confirmed") stats.confirmed = s.count;
      if (s._id === "pending") stats.pending = s.count;
      if (s._id === "cancelled") stats.cancelled = s.count;
    });

    return res.json({
      success: true,
      earnings: result[0].earnings || [],
      stats,
    });

  } catch (error) {
    console.error("Owner Earnings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
