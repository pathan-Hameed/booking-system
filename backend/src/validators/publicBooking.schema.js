import { z } from "zod";

/**
 * Validation schema for public booking creation
 */
export const createPublicBookingSchema = z.object({
  serviceId: z.string().min(10, "Valid service is required"),
  staffId: z.string().min(10).optional().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"),

  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(80, "Customer name must be at most 80 characters"),
  phone: z
    .string()
    .min(8, "Phone must be at least 8 characters")
    .max(20, "Phone must be at most 20 characters"),
  email: z.string().email("Valid email is required"),
});