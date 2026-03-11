function clean(obj) {
  if (!obj || typeof obj !== "object") return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }
    const val = obj[key];
    if (typeof val === "object") clean(val);
    if (typeof val === "string") obj[key] = val.trim();
  }
  return obj;
}

export function sanitizeRequest(req, _res, next) {
  clean(req.body);
  clean(req.query);
  next();
}