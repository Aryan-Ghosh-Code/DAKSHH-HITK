import { z } from "zod";

export const registerStep1Schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores and hyphens"
    ),
  email: z.string().email("Invalid email address"),
});

export const registerSchema = z.object({
  username: registerStep1Schema.shape.username,
  email: registerStep1Schema.shape.email,
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const registerApiSchema = z.object({
  username: registerStep1Schema.shape.username,
  email: registerStep1Schema.shape.email,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  avatar: z.number().min(1).max(10).optional(),
  username: registerStep1Schema.shape.username.optional(),
  amongUsScore: z.number().optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
  college: z.string().min(2, "College name is too short").optional(),
  stream: z.string().min(2, "Stream name is too short").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
