import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isOwner } from "../middlewares/isOwner.js";
import {
  deleteVilla,
  getAllVillas,
  getOwnerVillas,
  registerVilla,
} from "../controllers/villa.controller.js";
import { upload } from "../config/multer.js";

const villaRouter = express.Router();

villaRouter.post(
  "/register",
  isAuthenticated,
  isOwner,
  upload.array("images",4),
  registerVilla
);

villaRouter.get("/get", isAuthenticated, isOwner, getOwnerVillas);
villaRouter.get("/get-all", getAllVillas);
villaRouter.delete("/delete/:villaId", isAuthenticated, isOwner, deleteVilla);

export default villaRouter;
