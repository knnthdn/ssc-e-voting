import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
