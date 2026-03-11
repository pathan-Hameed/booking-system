import { Router } from "express";
import { validateBody } from "../middlewares/validate.js";
import { adminLoginSchema } from "../validators/auth.schema.js";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// /api/auth/*
router.post("/admin/login", validateBody(adminLoginSchema), login);
router.post("/admin/logout", logout);
router.get("/admin/me", requireAuth, requireAdmin, me);

export default router;