import { Router } from "express";
import { validateBody } from "../middlewares/validate.js";
import {
  adminLoginSchema,
  userLoginSchema,
  userRegisterSchema,
} from "../validators/auth.schema.js";
import {
  login,
  userLogin,
  userRegister,
  refresh,
  logoutController,
  logoutAllController,
  me,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// admin panel auth
router.post("/admin/login", validateBody(adminLoginSchema), login);
router.get("/admin/me", requireAuth, requireAdmin, me);

// user/frontend auth
router.post("/register", validateBody(userRegisterSchema), userRegister);
router.post("/login", validateBody(userLoginSchema), userLogin);
router.get("/me", requireAuth, me);

// shared auth
router.post("/refresh", refresh);
router.post("/logout", logoutController);
router.post("/logout-all", requireAuth, logoutAllController);

export default router;