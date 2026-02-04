import z from "zod";

export const formRegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),

  dateOfBirth: z
    .date() // ensures a string like "2003-01-01" is converted to Date
    .refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();

        // subtract 1 if birthday hasn't occurred yet this year
        return (
          age > 18 ||
          (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
        );
      },
      { message: "You must be at least 18 years old" },
    ),

  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["male", "female", "other"].includes(val),
      "Invalid gender",
    ),

  address: z.string().min(10, "Address must be at least 10 characters"),

  phoneNumber: z
    .string()
    .regex(/^(?:\+63|0)9\d{9}$/, "Invalid Philippine phone number"),
});

export type FormRegistrationInput = z.infer<typeof formRegisterSchema>;
