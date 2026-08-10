import { z } from "zod";

export const redeemBodySchema = z.object({
  key: z
    .string({ required_error: "License key is required" })
    .min(10, "License key is too short")
    .max(100, "License key is too long")
    .trim(),
});

export const createLicenseBodySchema = z.object({
  key: z.string().min(10).max(100).trim(),
  polar_id: z.string().min(1),
  polar_order: z.string().nullable().optional().default(null),
  customer_email: z.string().email().nullable().optional().default(null),
});

export const revokeLicenseParamsSchema = z.object({
  key: z.string().min(10).max(100).trim(),
});

export type RedeemBody = z.infer<typeof redeemBodySchema>;
export type CreateLicenseBody = z.infer<typeof createLicenseBodySchema>;
export type RevokeLicenseParams = z.infer<typeof revokeLicenseParamsSchema>;
