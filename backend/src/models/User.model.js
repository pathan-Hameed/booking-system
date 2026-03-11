import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Store hashed password only
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },

    // Optional: store phone for user account
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);