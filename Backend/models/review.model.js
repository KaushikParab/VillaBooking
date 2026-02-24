import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;