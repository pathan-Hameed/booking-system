import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { adminLogin } from "../services/auth.service.js";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,           // true on HTTPS production
    sameSite: env.COOKIE_SAMESITE,       // "lax" usually fine for admin
    maxAge: 1000 * 60 * 60 * 2,          // 2 hours (match token)
  };
}

export const login = asyncHandler(async (req, res) => {
  const result = await adminLogin(req.body);

  res.cookie(env.COOKIE_NAME, result.token, cookieOptions());
  res.status(200).json({ success: true, message: "Logged in", data: { user: result.user } });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  res.status(200).json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});