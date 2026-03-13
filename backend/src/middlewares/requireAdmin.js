import { ApiError } from "../utils/ApiError.js";

export function requireAdmin(req, _res, next) {
  if (!req.user || !["admin", "employee"].includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden"));
  }

  next();
}