import Link from "next/link";

export default function HomePageFooter() {
  return (
    <footer className="border-t border-gray-200 py-2 flex justify-center md:justify-end px-5 md:py-5 lg:px-8 ">
      <p className="text-center">
        For assistance, please look for the admin or go to{" "}
        <Link className="underline " href={"/docs"}>
          Docs
        </Link>
        .
      </p>
    </footer>
  );
}
