import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },

    // Store date & times as strings for easy querying
    date: { type: String, required: true },      // yyyy-mm-dd
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },   // HH:mm

    // Customer identity
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // Who created it (logged-in user)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "no_show", "expired"],
      default: "pending",
    },

    // Optional: for anti-hoarding / quick confirmation flows
    // expiresAt: { type: Date, default: null }, // for holds (optional future)
  },
  { timestamps: true }
);

/**
 * Prevent exact double booking for a staff member:
 * Same staff + same date + same startTime cannot exist twice.
 * If you allow staffId null (auto-assign later), keep sparse: true.
 */
bookingSchema.index(
  { staffId: 1, date: 1, startTime: 1 },
  { unique: true, sparse: true }
);

bookingSchema.index({ phone: 1, date: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);