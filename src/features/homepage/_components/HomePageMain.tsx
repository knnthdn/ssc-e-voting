import { Check, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePageMain() {
  return (
    <main className="md:-mt-12 flex-1 w-full relative mb-5">
      <div className="relative w-full overflow-hidden h-[400px] md:h-[450px] xl:h-[500px] 2xl:h-[550px] border-b border-white">
        {/* Background Image */}
        <Image
          alt="olac hero"
          src="/olac-hero.png"
          fill
          priority
          className="object-fill -z-50"
        />

        {/* Black gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/70  to-transparent -z-49" />

        <div className="h-full flex flex-col px-5 justify-center z-50 gap-2 md:px-10 xl:px-15 2xl:px-20">
          <h1 className=" text-white flex flex-col ">
            <span className="text-lg font-medium lg:text-xl xl:text-2xl">
              Welcome to the
            </span>
            <span className="uppercase font-semibold text-3xl lg:text-4xl xl:text-5xl">
              Student Supreme
            </span>
            <span className=" uppercase font-semibold text-3xl lg:text-4xl xl:text-5xl">
              Council E-Voting{" "}
            </span>
          </h1>

          <p className="text-white/80 lg:text-lg xl:text-2xl">
            Cast your vote securely online for your SSC elections.
          </p>

          <Link
            href={"/register"}
            className="w-fit px-3 justify-center font-medium cursor-pointer bg-amber-300 py-2 rounded-md tracking-wide flex items-center gap-1 mt-2 lg:px-6"
          >
            Get Started
            <MoveRight />
          </Link>
        </div>
      </div>

      <div className="w-full -mt-15 hidden md:block overflow-hidden">
        <svg
          className="relative  block w-full h-[40px] md:h-[60px] rotate-180"
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22,103.59,29.05,158,17.39C230.59,48,284.2,8.35,339.18,3.43c54.69-4.91,104.16,24.7,158,39.32,70.36,19.27,136.15,3.47,206.85-12.25C772.6,13.42,838.39,0,900,0c61.61,0,120.35,13.42,180,30V0Z"
            className="fill-white"
          />
        </svg>
      </div>

      <div className="mt-5 md:mt-10 px-8 w-full ">
        {/* FEATURES */}
        <div className="mx-auto max-w-4xl 2xl:max-w-6xl space-y-8 sm:space-y-6 md:space-y-0 sm:grid md:grid-cols-2 md:gap-10 lg:gap-10 ">
          <Feature
            title="Secure and Easy Voting"
            description="Vote securely online with your student credentials."
          />
          <Feature
            title="Meet the Candidates"
            description="Learn about your SSC candidate's platforms."
          />
          <Feature
            title="One Vote Per Student"
            description="Each student can cast one vote only."
          />
          <Feature
            title="Live Election Results"
            description="See real-time election results after voting ends."
          />
        </div>
      </div>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Check
        className="bg-brand-base text-white rounded-sm flex-shrink-0"
        size={20}
      />
      <div>
        <h3 className="font-semibold text-brand-800 lg:text-lg">{title}</h3>
        <p className="text-sm -mt-px lg:text-base">{description}</p>
      </div>
    </div>
  );
}
