import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

import * as admin from "../controllers/admin.controller.js";

const router = Router();

// /api/admin/*
router.use(requireAuth, requireAdmin);

// dashboard
router.get("/dashboard", admin.getDashboardStats);

// bookings
router.get("/bookings", admin.listBookings);
router.patch("/bookings/:id/status", admin.updateBookingStatus);

// services
router.get("/services", admin.listServices);
router.post("/services", admin.createService);
router.put("/services/:id", admin.updateService);
router.patch("/services/:id/toggle", admin.toggleService);

// staff
router.get("/staff", admin.listStaff);
router.post("/staff", admin.createStaff);
router.put("/staff/:id", admin.updateStaff);
router.patch("/staff/:id/toggle", admin.toggleStaff);

export default router;