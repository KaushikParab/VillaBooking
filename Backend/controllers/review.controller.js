import Review from "../models/review.model.js";

// ================= ADD REVIEW =================
export const addReview = async (req, res) => {
  const { villaId } = req.params;
  const { text, rating } = req.body;

  try {
    const review = await Review.create({
      villa: villaId,
      user: req.user.id,
      text,
      rating,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// ================= GET REVIEWS BY VILLA =================
export const getVillaReviews = async (req, res) => {
  const { villaId } = req.params;

  try {
    const reviews = await Review.find({ villa: villaId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};