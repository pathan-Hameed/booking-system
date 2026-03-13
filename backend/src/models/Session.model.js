import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    expiresAt: { type: Date, required: true, index: true },
    lastUsedAt: { type: Date, default: Date.now },
    isRevoked: { type: Boolean, default: false },
    replacedBySessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);