import z from "zod";

export const editElectionSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(5, "Election name must have atleast 5 character")
    .max(1000, "Election name must be less than 1000 characters"),
  description: z
    .string()
    .min(5, "Election description must have atleast 5 character")
    .max(1000, "Election description must be less than 1000 characters"),
  start: z.date().optional(),
  end: z.date(),
});

export type EditElectionInput = z.infer<typeof editElectionSchema>;
