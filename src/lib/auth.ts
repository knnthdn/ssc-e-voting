import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import sendEmail from "@/features/auth/_actions/sendEmail";
import resetPasswordEmail from "@/features/auth/_actions/reset-password-email";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/lib/config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      await resetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account consent",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },

  plugins: [nextCookies()],
});
