import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 10 }, // minutes
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);