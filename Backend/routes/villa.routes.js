import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isOwner } from "../middlewares/isOwner.js";
import {
  deleteVilla,
  getAllVillas,
  getOwnerVillas,
  registerVilla,
  getPopularVillas,
  getSingleVilla,
} from "../controllers/villa.controller.js";
import { upload } from "../config/multer.js";

const villaRouter = express.Router();

villaRouter.post(
  "/register",
  isAuthenticated,
  isOwner,
  upload.array("images", 4),
  registerVilla,
);

villaRouter.get("/get", isAuthenticated, isOwner, getOwnerVillas);
villaRouter.get("/owner", isAuthenticated, isOwner, getOwnerVillas);
villaRouter.get("/get-all", getAllVillas);
villaRouter.get("/popular", getPopularVillas);
villaRouter.delete("/delete/:villaId", isAuthenticated, isOwner, deleteVilla);
villaRouter.get("/:id", getSingleVilla);

export default villaRouter;
