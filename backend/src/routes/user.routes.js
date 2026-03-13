import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import  requireRole  from "../middlewares/requireRole.js";
import { validateBody } from "../middlewares/validate.js";

import * as user from "../controllers/user.controller.js";
import { createBookingSchema, confirmBookingSchema } from "../validators/userBooking.schema.js";

const router = Router();

// all /api/user/* routes require logged in user role
router.use(requireAuth, requireRole("user"));

// bookings
router.get("/bookings", user.listMyBookings);
router.post("/bookings", validateBody(createBookingSchema), user.createBooking);
router.patch("/bookings/:id/confirm", validateBody(confirmBookingSchema), user.confirmBooking);

export default router;