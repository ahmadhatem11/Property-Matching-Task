import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
export const adminRoutes = express.Router();

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
adminRoutes.get("/stats", authenticate, authorize(["ADMIN"]), getAdminStats);
