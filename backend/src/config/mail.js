import nodemailer from "nodemailer";
import { env } from "./env.js";

export const mailer = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: env.BREVO_SMTP_USER, // apikey
    pass: env.BREVO_SMTP_PASS, // your SMTP key
  },
});