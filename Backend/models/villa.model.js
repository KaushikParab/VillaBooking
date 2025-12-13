import mongoose from "mongoose";

const villaSchema = new mongoose.Schema(
  {
    villaName: { type: String, required: true },
    villaAddress: { type: String, required: true },
    rating: { type: String, required: true },
    price: { type: String, required: true },
    amenities: { type: String, required: true },
    image: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Villa = mongoose.model("Villa", villaSchema);
export default Villa;
