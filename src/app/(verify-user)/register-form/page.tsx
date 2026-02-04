import { getSession } from "@/actions/auth-actions";
import { hasVotersData } from "@/features/auth/_actions/hasVotersData";
import RegisterFormField from "@/features/auth/_components/verify-user/RegistrationFormFields";
import { redirect } from "next/navigation";

export default async function RegistrationFormPage() {
  const session = await getSession();

  if (await hasVotersData(session)) redirect("/vote");

  return <RegisterFormField />;
}
