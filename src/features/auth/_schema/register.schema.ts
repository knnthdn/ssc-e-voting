// import z from "zod";

// export const registerSchema = z
//   .object({
//     firstName: z
//       .string()
//       .min(2, "First name must be at least 2 characters")
//       .max(50, "First name is too long"),

//     lastName: z
//       .string()
//       .min(2, "Last name must be at least 2 characters")
//       .max(50, "Last name is too long"),

//     dateOfBirth: z
//       .string()
//       .refine(
//         (value) => !Number.isNaN(Date.parse(value)),
//         "Invalid date of birth",
//       ),

//     gender: z
//       .string()
//       .min(1, "Gender is required")
//       .refine(
//         (val) => ["male", "female", "other"].includes(val),
//         "Invalid gender",
//       ),

//     address: z.string().min(10, "Address must be at least 10 characters"),

//     phoneNumber: z
//       .string()
//       .regex(/^(?:\+63|0)9\d{9}$/, "Invalid Philippine phone number"),

//     email: z.email("Invalid email address"),
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number"),
//     confirmPassword: z.string().min(1, "Confirm password is required"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// export type RegisterInput = z.infer<typeof registerSchema>;

import z from "zod";

export const registerSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
