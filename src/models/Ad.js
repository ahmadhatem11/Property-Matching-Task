import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ["VILLA", "HOUSE", "LAND", "APARTMENT"],
    required: true,
  },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const Ad = mongoose.model("Ad", adSchema);
