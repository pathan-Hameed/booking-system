import { asyncHandler } from "../utils/asyncHandler.js";
import * as publicService from "../services/public.service.js";
import * as bookingService from "../services/booking.service.js";

/**
 * GET /api/public/services
 * Return all active services for the public website.
 */
export const listServices = asyncHandler(async (_req, res) => {
  const data = await publicService.listPublicServices();

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/public/staff
 * Return all active staff for the public website.
 */
export const listStaff = asyncHandler(async (_req, res) => {
  const data = await publicService.listPublicStaff();

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/public/availability?serviceId=...&date=...&staffId=...
 * Return dynamically generated slots based on:
 * - service duration
 * - staff working hours
 * - leave dates
 * - blocked times
 * - existing bookings
 */
export const availability = asyncHandler(async (req, res) => {
  const { serviceId, date, staffId } = req.query;

  const data = await publicService.getPublicAvailability({
    serviceId,
    date,
    staffId,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * POST /api/public/bookings
 * Public guest booking creation.
 *
 * This uses the same booking service as logged-in user booking,
 * but passes user:null so the booking is treated as a guest booking.
 */
export const createPublicBooking = asyncHandler(async (req, res) => {
  const data = await bookingService.createBooking({
    user: null,
    body: req.body,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data,
  });
});