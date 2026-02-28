import z from "zod";

export const addCandidateSchema = z.object({
  firstName: z
    .string()
    .min(2, "Candidate firstname must have atleast 2 character")
    .max(50, "Candidate firstname must be less than 50 characters"),

  lastName: z
    .string()
    .min(2, "Candidate lastName must have atleast 2 character")
    .max(50, "Candidate lastname must be less than 50 characters"),

  bio: z
    .string()
    .min(5, "Bio  must have atleast 5 character")
    .max(2000, "Bio  must be less than 2000 characters"),

  dateOfBirth: z.date().refine((date) => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    return date <= minDate;
  }, "Candidate must be at least 18 years old"),

  schoolId: z
    .string()
    .min(2, "Candidate schoolId must have atleast 2 character")
    .max(20, "Candidate schoolId must be less than 25 characters"),

  gender: z
    .string()
    .min(1, "Gender is required")
    .refine((val) => ["MALE", "FEMALE"].includes(val), "Invalid gender"),

  positionId: z.string().min(1, "Position is required"),
  partylistId: z.string().optional(),

  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), "Invalid image")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max 5MB")
    .optional(),
});

export type AddCandidateInput = z.infer<typeof addCandidateSchema>;
