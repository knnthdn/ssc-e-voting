"use server";

import ConfirmAccountEmail from "@/features/auth/_components/ConfirmEmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function sendEmail(userEmail: string, url: string) {
  await resend.emails.send({
    from: "SSC E-VOTING <ssc_e-voting@confirm.kdean.site>",
    to: [userEmail],
    subject: "Confirm your account",
    react: ConfirmAccountEmail({ userEmail, confirmUrl: url }),
  });
}
