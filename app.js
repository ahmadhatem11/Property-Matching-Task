import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cron from "node-cron";
import { authRoutes } from "./src/routes/authRoutes.js";
import { requestRoutes } from "./src/routes/requestRoutes.js";
import { adRoutes } from "./src/routes/adRoutes.js";
import { adminRoutes } from "./src/routes/adminRoutes.js";
import { PropertyRequest } from "./src/models/PropertyRequest.js";
import { swaggerSetup } from "./src/utils/swagger.js";

dotenv.config();

export const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/admin", adminRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cron.schedule("0 0 */3 * *", async () => {
  await PropertyRequest.updateMany({}, { $set: { refreshedAt: new Date() } });
});
