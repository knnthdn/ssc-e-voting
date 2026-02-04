export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  EMAIL_VERIFICATION: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION ?? "true",
  ARCJET_KEY: process.env.ARCJET_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  BETTER_AUTH: process.env.BETTER_AUTH,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
};
