import { asyncHandler } from "../utils/asyncHandler.js";
import * as bookingService from "../services/booking.service.js";

/**
 * Create booking (status=pending by default).
 * Sends email to admin + user after creation.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const data = await bookingService.createBooking({
    user: req.user, // { id, role }
    body: req.body,
  });

  res.status(201).json({ success: true, message: "Booking created", data });
});

/**
 * List bookings of the logged-in user.
 */
export const listMyBookings = asyncHandler(async (req, res) => {
  const data = await bookingService.listUserBookings({ user: req.user });
  res.json({ success: true, data });
});

/**
 * User confirms booking (pending -> confirmed).
 */
export const confirmBooking = asyncHandler(async (req, res) => {
  const data = await bookingService.userConfirmBooking({
    user: req.user,
    bookingId: req.params.id,
  });

  res.json({ success: true, message: "Booking confirmed", data });
});