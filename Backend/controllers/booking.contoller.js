import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Villa from "../models/villa.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import stripe from "stripe";

// Check Availability of Room
export const checkAvailability = async ({
  room,
  checkInDate,
  checkOutDate,
}) => {
  try {
    const booking = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = booking.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(("error", error));
  }
};

// api to check Avalability of room
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// api to book a room
export const bookRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const { room, checkInDate, checkOutDate, persons, paymentMethod } =
      req.body;

    // before booking check availability
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Room is not available", success: false });
    }

    // get total price
    const roomData = await Room.findById(room).populate("villa");
    let totalPrice = roomData.pricePerNight;

    // calculate totalPrice based on per night
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice = totalPrice * nights * persons;

    const booking = await Booking.create({
      user: id,
      room,
      villa: roomData.villa._id,
      checkIn,
      checkOut,
      persons,
      totalPrice,
      paymentMethod,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Room Booked Successfully",
      html: `
      <h1>Villa Booking Confirmation</h1>
      <p>Dear ${user.name}, </p>
      <p>Thank you for booking with us. Your booking details are as follows:</p>
      <ul>
      <li>Booking ID: ${booking._id}</li>
      <li>Villa: ${roomData.villa.villaName}</li>
      <li>Room Type: ${roomData.roomType}</li>
      <li>Check-in Date: ${checkInDate}</li>
      <li>Check-out Date: ${checkOutDate}</li>
      <li>Number of Persons: ${persons}</li>
      <li>Total Price: ₹ ${totalPrice}</li>
      </ul>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Room Booked Successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// api to get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const bookings = await Booking.find({ user: id })
      .populate("room villa")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// api to get all booking for a villa
export const getVillaBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const villas = await Villa.find({ owner: id }).select("_id");
    if (!villas) {
      return res
        .status(404)
        .json({ message: "Villas not found", success: false });
    }
    const villaIds = villas.map((villa) => villa._id);

    const bookings = await Booking.find({ villa: { $in: villaIds } })
      .populate("room villa")
      .sort({ createdAt: -1 });
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Bookings not found", success: true });
    } else {
      res.json({ success: true, bookings });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    const roomData = await Room.findById(booking.room).populate("villa");

    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: roomData.villa.villaName,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    // create checkout session

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    await booking.updateOne({ isPaid: true, status: "confirmed" });
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
