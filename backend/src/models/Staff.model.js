import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, default: "General", trim: true },

    // Staff can perform these services
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],

    isActive: { type: Boolean, default: true },

    // Basic business hours per staff (MVP)
    workingHours: {
      start: { type: String, default: "10:00" }, // HH:mm
      end: { type: String, default: "20:00" },
    },

    // Days staff is unavailable
    leaveDates: [{ type: String }], // yyyy-mm-dd
  },
  { timestamps: true }
);

export const Staff = mongoose.model("Staff", staffSchema);