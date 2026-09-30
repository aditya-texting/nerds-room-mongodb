import { z } from 'zod';
import disposableDomains from 'disposable-email-domains';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string()
    .email("Invalid email address")
    .refine((email) => {
      const domain = email.split('@')[1];
      return !disposableDomains.includes(domain);
    }, { message: "Temporary emails are not allowed" }),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  userType: z.enum(['COLLEGE_STUDENT', 'WORKING_PROFESSIONAL', 'OTHER'] as const, {
    message: "Invalid user type",
  }),
  role: z.enum(['ADMIN', 'PARTICIPANT', 'ORGANIZER'] as const, {
    message: "Invalid role",
  }),
  organisationName: z.string().optional(),
  jobRole: z.string().optional(),
  phone: z.string().min(10, "Phone number is required and must be at least 10 digits"),
}).refine(
  (data) => {
    return true;
  },
  {
    message: "Invalid details",
    path: ["organisationName"],
  }
);

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must be numeric"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Used for the step-3 form (email & otp come from state, not the form)
export const setPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

