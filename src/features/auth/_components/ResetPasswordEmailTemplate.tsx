import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ResetPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
}

export default function ResetPasswordEmailTemplate({
  resetUrl,
  userEmail,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SSC E-Voting Password</Preview>

      <Tailwind>
        <Body className="bg-slate-100 font-sans">
          <Container className="mx-auto my-10 max-w-[480px] rounded-lg bg-white px-8 py-8">
            <Heading className="mb-4 text-2xl font-semibold text-slate-900">
              Reset your password
            </Heading>

            <Text className="text-sm leading-6 text-slate-700">
              We received a request to reset the password for your{" "}
              <span className="font-semibold">SSC E-Voting</span> account.
            </Text>

            <Text className="text-sm leading-6 text-slate-700">
              Click the button below to reset the password for{" "}
              <span className="font-medium">{userEmail}</span>.
            </Text>

            <Section className="my-6 text-center">
              <Button
                href={resetUrl}
                className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white no-underline"
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-xs text-slate-500">
              This password reset link will expire in 1 hour.
            </Text>

            <Text className="text-xs text-slate-500">
              If you did not request a password reset, you can safely ignore
              this email. Your password will not be changed.
            </Text>

            <Text className="mt-8 text-xs text-slate-400">
              — SSC E-Voting Admin
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
