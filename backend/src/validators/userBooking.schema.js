import { z } from "zod";

/**
 * Booking creation (user must be logged in).
 * staffId required here for clean logic (recommended).
 */
export const createBookingSchema = z.object({
  serviceId: z.string().min(10),
  staffId: z.string().min(10),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),

  customerName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
});

/**
 * User confirming their own booking.
 */
export const confirmBookingSchema = z.object({}); // no body needed