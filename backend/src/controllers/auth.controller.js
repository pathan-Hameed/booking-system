import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import {
  adminLogin,
  loginUser as loginUserService,
  registerUser,
  refreshAuth,
  logout,
  logoutAll,
  getCurrentUser,
} from "../services/auth.service.js";

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/api/auth",
  };
}

function getRequestMeta(req) {
  return {
    userAgent: req.get("user-agent") || "",
    ip: req.ip || req.headers["x-forwarded-for"] || "",
  };
}

function sendAuthResponse(res, result, message) {
  res.cookie(env.COOKIE_NAME, result.refreshToken, refreshCookieOptions());

  res.status(200).json({
    success: true,
    message,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export const login = asyncHandler(async (req, res) => {
  const result = await adminLogin(req.body, getRequestMeta(req));
  sendAuthResponse(res, result, "Logged in");
});

export const userRegister = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, getRequestMeta(req));
  sendAuthResponse(res, result, "Registered successfully");
});

export const userLogin = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body, getRequestMeta(req));
  sendAuthResponse(res, result, "Logged in");
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.COOKIE_NAME];
  const result = await refreshAuth(refreshToken, getRequestMeta(req));
  sendAuthResponse(res, result, "Token refreshed");
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.COOKIE_NAME];
  await logout(refreshToken);

  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/api/auth",
  });

  res.status(200).json({ success: true, message: "Logged out" });
});

export const logoutAllController = asyncHandler(async (req, res) => {
  await logoutAll(req.user.sub);

  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/api/auth",
  });

  res.status(200).json({ success: true, message: "Logged out from all devices" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.sub);
  res.status(200).json({ success: true, data: { user } });
});