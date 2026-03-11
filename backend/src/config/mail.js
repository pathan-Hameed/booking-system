import nodemailer from "nodemailer";
import { env } from "./env.js";

/**
 * Nodemailer Transport using SendGrid SMTP
 * SENDGRID_SMTP_USER is literally "apikey"
 * SENDGRID_SMTP_PASS is your SendGrid API Key
 */
export const mailer = nodemailer.createTransport({
  host: env.SENDGRID_SMTP_HOST,
  port: env.SENDGRID_SMTP_PORT,
  secure: false, // true only for port 465
  auth: {
    user: env.SENDGRID_SMTP_USER,
    pass: env.SENDGRID_SMTP_PASS,
  },
});