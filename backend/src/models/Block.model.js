import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    // if staffId is null => global block (holiday / salon closed)
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },

    date: { type: String, required: true }, // yyyy-mm-dd
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },   // HH:mm

    reason: { type: String, default: "Blocked", trim: true },
  },
  { timestamps: true }
);

blockSchema.index({ staffId: 1, date: 1 });

export const Block = mongoose.model("Block", blockSchema);