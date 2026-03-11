import { ApiError } from "../utils/ApiError.js";

/**
 * Usage: router.post(..., requireRole("admin"), handler)
 */
export function requireRole(role) {
  return (req, _res, next) => {
    if (req.user?.role !== role) return next(new ApiError(403, "Forbidden"));
    next();
  };
}