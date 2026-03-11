import { ApiError } from "../utils/ApiError.js";

export const validateBody = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors?.[0]?.message || "Invalid request";
    return next(new ApiError(400, msg));
  }
  req.body = parsed.data;
  next();
};