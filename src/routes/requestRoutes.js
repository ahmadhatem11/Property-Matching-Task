import express from "express";
import {
  createRequest,
  updateRequest,
  searchPropertyRequests,
} from "../controllers/requestController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
export const requestRoutes = express.Router();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a property request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 enum: [VILLA, HOUSE, LAND, APARTMENT]
 *               area:
 *                 type: number
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               propertyType: APARTMENT
 *               area: 100
 *               price: 50000
 *               city: CityName
 *               district: DistrictName
 *               description: A nice apartment
 *     responses:
 *       201:
 *         description: Property request created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
requestRoutes.post("/", authenticate, authorize(["CLIENT"]), createRequest);
requestRoutes.put("/:id", authenticate, updateRequest);
requestRoutes.get("/search", searchPropertyRequests);
