import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters for your password.");

const commaListSchema = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const patientRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    phone: z.string().trim().optional(),
    consentAccepted: z.boolean().refine(Boolean, {
      message: "Please confirm you understand the consent and privacy note.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const doctorRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    phone: z.string().trim().min(6, "Enter a phone number for follow-up."),
    professionalTitle: z
      .string()
      .trim()
      .min(2, "Enter your professional title."),
    specialties: commaListSchema.refine((items) => items.length > 0, {
      message: "Add at least one specialty.",
    }),
    languages: commaListSchema.refine((items) => items.length > 0, {
      message: "Add at least one language.",
    }),
    yearsOfExperience: z.coerce
      .number()
      .int("Use a whole number.")
      .min(0, "Experience cannot be negative.")
      .max(80, "Check the years of experience."),
    licenseNumber: z.string().trim().min(2, "Enter your license number."),
    licenseCountry: z.string().trim().min(2, "Enter the license country."),
    bio: z
      .string()
      .trim()
      .min(40, "Write at least 40 characters for your professional bio.")
      .max(1200, "Keep the bio under 1200 characters."),
    offersOnline: z.boolean(),
    offersInPerson: z.boolean(),
    sessionPrice: z.coerce
      .number()
      .min(0, "Session price cannot be negative.")
      .max(100000, "Check the session price."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((data) => data.offersOnline || data.offersInPerson, {
    path: ["offersOnline"],
    message: "Select at least one session option.",
  });

export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function formatZodErrors(error: z.ZodError): AuthActionState {
  return {
    error: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}
