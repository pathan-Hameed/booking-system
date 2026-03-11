import { z } from "zod";

/**
 * Validation schema for public booking creation
 */
export const createPublicBookingSchema = z.object({
  serviceId: z.string().min(10),
  staffId: z.string().min(10),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),

  customerName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
});