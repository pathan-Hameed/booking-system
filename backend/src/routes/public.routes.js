import { Router } from "express";
import * as pub from "../controllers/public.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { createPublicBookingSchema } from "../validators/publicBooking.schema.js";

const router = Router();

/**
 * Public routes for client website
 * No authentication required
 */

// List active services
router.get("/services", pub.listServices);

// List active staff
router.get("/staff", pub.listStaff);

// Get dynamic slot availability
router.get("/availability", pub.availability);

// Create public guest booking
router.post(
  "/bookings",
  validateBody(createPublicBookingSchema),
  pub.createPublicBooking,
);

export default router;
