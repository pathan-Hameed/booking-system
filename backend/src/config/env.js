import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI,

  CORS_ORIGIN: (process.env.CORS_ORIGIN || "").split(",").filter(Boolean),

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  COOKIE_NAME: process.env.COOKIE_NAME || "refresh_token",
  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
  COOKIE_SAMESITE: process.env.COOKIE_SAMESITE || "lax",

  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || "smtp.brevo.com",
  BREVO_SMTP_PORT: Number(process.env.BREVO_SMTP_PORT || 587),
  BREVO_SMTP_USER: process.env.BREVO_SMTP_USER,
  BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS, 

  MAIL_FROM: process.env.MAIL_FROM || "KIRA Beauty Salon <hameed.learner@gmail.com>",
  MAIL_ADMIN: process.env.MAIL_ADMIN || "hameed.learner@gmail.com",
  SALON_NAME: process.env.SALON_NAME || "KIRA Beauty Salon"
};