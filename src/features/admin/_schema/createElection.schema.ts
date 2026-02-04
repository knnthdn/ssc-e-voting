import z from "zod";

export const electionStatusSchema = z.enum(["SCHEDULED", "PENDING"]);

export const createElectionSchema = z
  .object({
    name: z
      .string()
      .min(5, "Election name must have atleast 5 character")
      .max(50, "Election name must be less than 50 characters"),
    status: electionStatusSchema,
    description: z
      .string()
      .min(5, "Election description must have atleast 5 character")
      .max(50, "Election description must be less than 50 characters"),
    start: z.date(),
    end: z.date(),
  })
  .refine((data) => data.start < data.end, {
    message: "Start date must be before end date",
    path: ["start"], // or ["end"]
  });

export type CreateElectionInput = z.infer<typeof createElectionSchema>;
