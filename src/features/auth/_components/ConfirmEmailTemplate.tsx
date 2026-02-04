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

interface ConfirmAccountEmailProps {
  confirmUrl: string;
  userEmail: string;
}

export default function ConfirmAccountEmail({
  confirmUrl,
  userEmail,
}: ConfirmAccountEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your SSC E-Voting account</Preview>

      <Tailwind>
        <Body className="bg-slate-100 font-sans">
          <Container className="mx-auto my-10 max-w-[480px] rounded-lg bg-white px-8 py-8">
            <Heading className="mb-4 text-2xl font-semibold text-slate-900">
              Confirm your account
            </Heading>

            <Text className="text-sm leading-6 text-slate-700">
              Thanks for signing up for{" "}
              <span className="font-semibold">SSC E-VOTING account</span>.
            </Text>

            <Text className="text-sm leading-6 text-slate-700">
              Please confirm your email address ({userEmail}) by clicking the
              button below.
            </Text>

            <Section className="my-6 text-center">
              <Button
                href={confirmUrl}
                className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white no-underline"
              >
                Confirm Account
              </Button>
            </Section>

            <Text className="text-xs text-slate-500">
              This link will expire in 24 hours.
            </Text>

            <Text className="text-xs text-slate-500">
              If you didn’t create an account, you can safely ignore this email.
            </Text>

            <Text className="mt-8 text-xs text-slate-400">
              — SSC E-Voting admin
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
