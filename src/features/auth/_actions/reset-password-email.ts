"use server";

import ResetPasswordEmailTemplate from "@/features/auth/_components/ResetPasswordEmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function resetPasswordEmail(
  userEmail: string,
  url: string,
) {
  await resend.emails.send({
    from: "SSC E-VOTING <ssc_e-voting@confirm.kdean.site>",
    to: [userEmail],
    subject: "Reset your password",
    react: ResetPasswordEmailTemplate({ userEmail, resetUrl: url }),
  });
}
