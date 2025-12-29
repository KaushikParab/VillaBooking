import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Villa from "../models/villa.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import stripe from "stripe";

/* ================================
   CHECK VILLA AVAILABILITY
================================ */
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
   CHECK AVAILABILITY API
================================ */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const roomData = await Room.findById(room).populate("villa");

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
   BOOK ROOM
================================ */
export const bookRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    const { room, checkInDate, checkOutDate, persons, paymentMethod } =
      req.body;

    const roomData = await Room.findById(room).populate("villa");

    // CHECK VILLA AVAILABILITY
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

    // PRICE CALCULATION
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights =
      Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const totalPrice =
      roomData.pricePerNight * nights * persons;

    // CREATE BOOKING
    const booking = await Booking.create({
      user: id,
      room,
      villa: roomData.villa._id,
      checkIn,
      checkOut,
      persons,
      totalPrice,
      paymentMethod,
      status: "pending",
      isPaid: false,
    });

    // AUTO DELETE IF NOT PAID IN 10 MIN
    setTimeout(async () => {
      const latestBooking = await Booking.findById(booking._id);
      if (latestBooking && !latestBooking.isPaid) {
        await Booking.findByIdAndDelete(booking._id);
        console.log("Unpaid booking deleted");
      }
    }, 1 * 60 * 1000);

    // EMAIL
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Villa Booking Created",
      html: `
        <h2>Booking Created</h2>
        <p>Your booking is reserved for 10 minutes.</p>
        <p>Please complete payment.</p>
      `,
    });

    res.json({ success: true, message:"Complete your booking in 10 minutes" });
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

    const roomData = await Room.findById(booking.room).populate("villa");

    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: roomData.villa.villaName,
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
    res.status(500).json({ message: "Payment failed" });
  }
};

/* ================================
   USER BOOKINGS
================================ */
export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("room villa")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

/* ================================
   VILLA BOOKINGS (OWNER)
================================ */
export const getVillaBookings = async (req, res) => {
  const villas = await Villa.find({ owner: req.user.id });
  const villaIds = villas.map(v => v._id);

  const bookings = await Booking.find({ villa: { $in: villaIds } })
    .populate("room villa")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};
