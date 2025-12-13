import mongoose from "mongoose";

const villaRoomSchema = new mongoose.Schema(
  {
    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
      required: true,
    },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    amenities: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", villaRoomSchema);
export default Room;
