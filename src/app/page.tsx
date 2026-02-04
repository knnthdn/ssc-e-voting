import { getSession } from "@/actions/auth-actions";
import HomePageFooter from "@/features/homepage/_components/HomePageFooter";
import HomePageHeader from "@/features/homepage/_components/HomePageHeader";
import HomePageMain from "@/features/homepage/_components/HomePageMain";
import { env } from "@/lib/config";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getSession();

  if (session) {
    if (session.user.emailVerified || env.EMAIL_VERIFICATION === "false") {
      redirect("/vote");
    } else {
      redirect("/email-activation");
    }
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <HomePageHeader />
      <HomePageMain />
      <HomePageFooter />
    </div>
  );
}
