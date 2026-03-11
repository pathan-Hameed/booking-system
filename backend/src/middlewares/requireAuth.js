import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";

/**
 * Reads JWT from HttpOnly cookie (preferred) OR Authorization header (fallback)
 */
export function requireAuth(req, _res, next) {
  const token =
    req.cookies?.[env.COOKIE_NAME] ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) return next(new ApiError(401, "Not authenticated"));

  try {
    req.user = verifyAccessToken(token); // { id, role }
    next();
  } catch {
    next(new ApiError(401, "Invalid/expired token"));
  }
}