import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    persons: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "expired", "cancelled"],
      default: "pending",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "Pay At Villa",
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    // FOR AUTO DELETE
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* ======================================================
   INDEXES
====================================================== */

// TTL INDEX — AUTO DELETE WHEN expiresAt < now
bookingSchema.add({
  expiresAt: { type: Date, default: null },
});

bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// OVERLAP CHECK TO PREVENT DOUBLE BOOKING
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
