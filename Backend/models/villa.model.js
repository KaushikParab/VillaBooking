import mongoose from "mongoose";

const villaSchema = new mongoose.Schema(
  {
    villaName: { type: String, required: true },
    villaContactNo: { type: String, required: true },
    villaAddress: { type: String, required: true },
    rating: { type: String, required: true },
    guests: { type: Number, required: true },
    price: { type: Number, required: true },
    amenities: { type: String, required: true },
    images: { type: [String], required: true },

    totalRooms: {
      type: Number,
      default: 0,
    },

    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Villa = mongoose.model("Villa", villaSchema);
export default Villa;
