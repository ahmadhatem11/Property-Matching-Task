import express from "express";
import {
  createAd,
  matchRequests,
  searchAds,
} from "../controllers/adController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
export const adRoutes = express.Router();

adRoutes.post("/", authenticate, authorize(["AGENT"]), createAd);
adRoutes.get("/match/:id", authenticate, matchRequests);
adRoutes.get("/search", searchAds);
