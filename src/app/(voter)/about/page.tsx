const keyReasons = [
  {
    title: "Integrity and Fairness",
    description:
      "The system enforces one ballot per voter per election and applies clear rules per position to protect election integrity.",
  },
  {
    title: "Transparency and Accountability",
    description:
      "Voters can review election states and results, while administrators manage elections through structured workflows and audit-friendly actions.",
  },
  {
    title: "Accessibility and Speed",
    description:
      "A web-based flow reduces manual paperwork, shortens counting time, and gives voters a straightforward voting experience.",
  },
];

const appHighlights = [
  "Role-based access for ADMIN and VOTER.",
  "Controlled election lifecycle from scheduling to completion.",
  "Reliable ballot submission flow with duplicate-vote prevention.",
  "Centralized management of elections, candidates, and voter records.",
  "Fast access to results and voting history.",
];

const developerPlaceholders = [
  "Developer Name Placeholder 1",
  "Developer Name Placeholder 2",
  "Developer Name Placeholder 3",
];

export default function AboutPage() {
  return (
    <section className="mx-auto mt-5 max-w-6xl px-3 pb-10 sm:px-5 lg:mt-8 xl:px-8">
      <div className="space-y-6">
        <header className="rounded-2xl border bg-white p-6">
          <h1 className="text-2xl font-semibold text-brand-100 lg:text-3xl">
            About The E-Voting System
          </h1>
          <p className="mt-3 text-slate-700">
            This e-voting application is designed to run secure, organized, and
            efficient elections for schools, organizations, and communities. It
            replaces manual voting with a structured digital process that helps
            reduce errors, prevent duplicate submissions, and improve confidence
            in election outcomes.
          </p>
        </header>

        <article className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-brand-100">
            Why Use This As An Election System
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {keyReasons.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-slate-50 p-4"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-brand-100">
            App Highlights
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {appHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-brand-100">
            Developer Team
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {developerPlaceholders.map((name) => (
              <div key={name} className="rounded-xl border bg-slate-50 p-4">
                <p className="font-medium text-slate-900">{name}</p>
                <p className="text-sm text-slate-600">Role: Lead Developer</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
