import z from "zod";

export const loginSchemas = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Invalid Password"),
});

export type LoginInputs = z.infer<typeof loginSchemas>;
