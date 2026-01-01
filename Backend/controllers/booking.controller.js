import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Villa from "../models/villa.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkAvailability = async ({
  villa,
  checkInDate,
  checkOutDate,
}) => {
  const overlappingBooking = await Booking.findOne({
    villa,
    status: { $ne: "cancelled" },
    checkIn: { $lte: new Date(checkOutDate) },
    checkOut: { $gte: new Date(checkInDate) },
  });

  return !overlappingBooking;
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
      const totalPrice = pricePerPersonPerNight * persons * nights;

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
      setTimeout(async () => {
        const latest = await Booking.findById(booking._id);
        if (latest && !latest.isPaid && latest.status === "pending") {
          await Booking.findByIdAndDelete(booking._id);
        }
      }, 1 * 60 * 1000);

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

    const totalPrice = roomData.pricePerNight * nights * persons;

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

    setTimeout(async () => {
      const latest = await Booking.findById(booking._id);
      if (latest && !latest.isPaid) {
        await Booking.findByIdAndDelete(booking._id);
      }
    }, 1 * 60 * 1000);

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
   STRIPE PAYMENT
================================ */
export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name:
                booking.bookingType === "villa"
                  ? "Entire Villa Booking"
                  : "Room Booking",
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/loader/my-bookings`,
      cancel_url: `${req.headers.origin}/my-bookings`,
      metadata: { bookingId },
    });

    // CONFIRM BOOKING
    booking.isPaid = true;
    booking.status = "confirmed";
    await booking.save();

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Stripe payment failed" });
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
    .populate("room rooms villa")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};
