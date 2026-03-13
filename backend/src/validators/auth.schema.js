import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const userRegisterSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .optional()
    .or(z.literal("")),
});