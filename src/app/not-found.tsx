import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <section className="min-h-screen w-full grid place-items-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 text-center sm:p-8">
        <div className="relative mx-auto h-44 w-72 sm:h-52 sm:w-80">
          <Image
            src="/no-election.png"
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="mt-2 text-2xl font-semibold text-brand-100 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/vote">Go to Vote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
