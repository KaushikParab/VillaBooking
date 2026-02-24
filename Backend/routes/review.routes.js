import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addReview,
  getVillaReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/:villaId", isAuthenticated, addReview);
router.get("/:villaId", getVillaReviews);

export default router;