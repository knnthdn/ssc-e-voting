import { getSession } from "@/actions/auth-actions";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import VotersChangePasswordDialog from "@/features/voters/_component/VotersChangePasswordDialog";
import VotersLogoutButton from "@/features/voters/_component/VotersLogoutButton";
import prisma from "@/lib/prisma";
import { History, Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function VotersProfile() {
  const session = await getSession();

  if (!session) {
    return (
      <Link
        href={"/login"}
        className="px-5 bg-amber-300 py-1.5 rounded-md tracking-wide flex items-center gap-1"
      >
        Login
        <Key size={15} />
      </Link>
    );
  }

  const voters = await prisma.voter.findUnique({
    where: { voterId: session.user.id },
  });
  return (
    <>
      {!voters ? (
        <div className="flex gap-1 items-center">
          <Skeleton className="h-6 w-20 bg-white/40" />
          <Skeleton className="size-8 rounded-full bg-white/40" />
        </div>
      ) : (
        <Popover>
          <PopoverTrigger className="cursor-pointer text-white flex items-center gap-2">
            <span className="font-medium">{voters.firstName}</span>

            <div className="relative size-8">
              <Image
                alt="Voters Profile"
                src={
                  (session.user.image ?? voters.gender === "MALE")
                    ? "/male-default-profile.png"
                    : "/female-default-profile.png"
                }
                fill
                className="absolute object-cover"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-fit">
            <PopoverHeader>
              <PopoverTitle className="font-medium text-base text-brand-800">
                {voters.firstName} {voters.lastName}
              </PopoverTitle>
            </PopoverHeader>

            <div className="h-px w-full bg-brand-100/50 my-3" />

            <div className="space-y-2">
              <Link
                href={"/vote-history"}
                className="text-brand-100 flex gap-1 items-center"
              >
                <History size={20} />
                Vote history
              </Link>

              <VotersChangePasswordDialog />

              <VotersLogoutButton />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
