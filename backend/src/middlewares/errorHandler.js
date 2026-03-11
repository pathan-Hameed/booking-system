import { env } from "../config/env.js";

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";

  const body = { success: false, message };

  if (env.NODE_ENV !== "production") {
    body.stack = err.stack;
    body.path = req.originalUrl;
  }

  res.status(status).json(body);
}