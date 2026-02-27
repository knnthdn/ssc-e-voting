const voterRoutes = [
  { path: "/vote", purpose: "Browse active elections and start voting." },
  { path: "/vote/[electionId]", purpose: "View candidates and submit ballot." },
  { path: "/vote-history", purpose: "Review previously submitted ballots." },
  { path: "/vote-result", purpose: "See finished election results." },
  { path: "/vote-ranking", purpose: "View rankings for ongoing elections." },
];

const adminRoutes = [
  { path: "/admin/dashboard", purpose: "Monitor election and user overview." },
  { path: "/admin/election", purpose: "Create and manage election records." },
  { path: "/admin/settings", purpose: "Manage users and audit logs." },
  { path: "/admin/system-status", purpose: "Check app and database health." },
];

const votingRules = [
  "Only authenticated users can vote.",
  "A voter profile is required before accessing ballots.",
  "Voting is limited to active elections.",
  "Only one candidate per position can be submitted.",
  "Only one ballot submission per election is allowed per voter.",
];

const electionStatuses = [
  { name: "PENDING", meaning: "Election exists but is not yet scheduled to run." },
  { name: "SCHEDULED", meaning: "Election is planned and waiting for start time." },
  { name: "ONGOING", meaning: "Voting is open for eligible voters." },
  { name: "PAUSED", meaning: "Voting is temporarily suspended by admin." },
  { name: "STOPPED", meaning: "Voting is manually halted before normal completion." },
  { name: "COMPLETED", meaning: "Voting has ended and final results are available." },
];

const troubleshootingItems = [
  {
    issue: "I did not receive the password reset email.",
    fix: "Verify the email address, wait a few minutes, then check spam/junk folders.",
  },
  {
    issue: "I cannot access the voting page.",
    fix: "Make sure you are logged in and your account has completed voter profile registration.",
  },
  {
    issue: "No active election appears.",
    fix: "The election may not be ongoing yet or has already ended. Check again later.",
  },
  {
    issue: "I cannot vote again in the same election.",
    fix: "This is expected. The app allows only one ballot submission per election per voter.",
  },
];

const faqs = [
  {
    question: "Can I edit my ballot after submitting?",
    answer: "No. Once submitted, the ballot is final.",
  },
  {
    question: "Can I vote without completing profile registration?",
    answer: "No. A voter profile is required before voting access is granted.",
  },
  {
    question: "Where can I see my previous votes?",
    answer: "Open the Vote History page to review your submitted ballots.",
  },
];

const sections = [
  { id: "overview", label: "Overview" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "core-roles", label: "Core Roles" },
  { id: "voting-workflow", label: "Voting Workflow" },
  { id: "forgot-password", label: "Forgot Password" },
  { id: "election-status-logic", label: "Election Status Logic" },
  { id: "voter-routes", label: "Voter Routes" },
  { id: "admin-routes", label: "Admin Routes" },
  { id: "voting-rules", label: "Voting Rules" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "faq", label: "FAQ" },
  { id: "environment-setup", label: "Environment Setup" },
];

export default function DocsPage() {
  return (
    <section className="mx-auto mt-5 max-w-7xl px-2 pb-8 sm:px-5 lg:mt-8 xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border bg-white p-4 lg:sticky lg:top-4">
          <h2 className="text-lg font-semibold text-brand-100">On this page</h2>
          <ul className="mt-3 space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-6">
          <header id="overview" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h1 className="text-2xl font-semibold text-brand-100 lg:text-3xl">
              E-Voting App Documentation
            </h1>
            <p className="mt-2 text-slate-600">
              This page documents your app structure, voting flow, and important
              routes for both voters and admins.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <article
              id="tech-stack"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">Tech Stack</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>Next.js (App Router) + TypeScript</li>
                <li>Prisma ORM + PostgreSQL</li>
                <li>Role-based auth with ADMIN and VOTER access</li>
                <li>Tailwind + shadcn/ui components</li>
              </ul>
            </article>

            <article
              id="core-roles"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">Core Roles</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>
                  <span className="font-semibold">VOTER:</span> casts ballots,
                  checks history, rankings, and results.
                </li>
                <li>
                  <span className="font-semibold">ADMIN:</span> manages
                  elections, users, settings, and system health.
                </li>
              </ul>
            </article>
          </div>

          <article
            id="voting-workflow"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Voting Workflow
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              <li>User signs in and is checked for role/profile.</li>
              <li>Voter selects an active election from `/vote`.</li>
              <li>Voter reviews candidates by position.</li>
              <li>One candidate is selected per position.</li>
              <li>Ballot summary is shown before final submit.</li>
              <li>Votes are persisted and duplicate submissions are blocked.</li>
            </ol>
          </article>

          <article
            id="forgot-password"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Forgot Password (Voter Guide)
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Click <span className="font-semibold">Forgot Password</span> on the login page.</li>
              <li>Enter the email address you used to register.</li>
              <li>
                Check your inbox for the reset email. If you do not receive it,
                check your spam or junk folder.
              </li>
              <li>
                Click the reset link in the email. You will be redirected to the
                change password page.
              </li>
            </ol>
          </article>

          <article
            id="election-status-logic"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Election Status Logic
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {electionStatuses.map((status) => (
                <li key={status.name} className="rounded-md border bg-slate-50 p-3">
                  <p className="font-mono text-sm text-slate-900">{status.name}</p>
                  <p className="text-sm text-slate-600">{status.meaning}</p>
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-6 lg:grid-cols-2">
            <article
              id="voter-routes"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">
                Voter Routes
              </h2>
              <ul className="mt-3 space-y-2 text-slate-700">
                {voterRoutes.map((route) => (
                  <li
                    key={route.path}
                    className="rounded-md border bg-slate-50 p-3"
                  >
                    <p className="font-mono text-sm text-slate-900">
                      {route.path}
                    </p>
                    <p className="text-sm text-slate-600">{route.purpose}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article
              id="admin-routes"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">
                Admin Routes
              </h2>
              <ul className="mt-3 space-y-2 text-slate-700">
                {adminRoutes.map((route) => (
                  <li
                    key={route.path}
                    className="rounded-md border bg-slate-50 p-3"
                  >
                    <p className="font-mono text-sm text-slate-900">
                      {route.path}
                    </p>
                    <p className="text-sm text-slate-600">{route.purpose}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article
            id="voting-rules"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">Voting Rules</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {votingRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </article>

          <article
            id="troubleshooting"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Troubleshooting
            </h2>
            <ul className="mt-3 space-y-3 text-slate-700">
              {troubleshootingItems.map((item) => (
                <li key={item.issue} className="rounded-md border bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">{item.issue}</p>
                  <p className="text-sm text-slate-600">{item.fix}</p>
                </li>
              ))}
            </ul>
          </article>

          <article id="faq" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">FAQ</h2>
            <ul className="mt-3 space-y-3 text-slate-700">
              {faqs.map((item) => (
                <li
                  key={item.question}
                  className="rounded-md border bg-slate-50 p-3"
                >
                  <p className="font-medium text-slate-900">{item.question}</p>
                  <p className="text-sm text-slate-600">{item.answer}</p>
                </li>
              ))}
            </ul>
          </article>

          <article
            id="environment-setup"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Environment Setup
            </h2>
            <div className="mt-3 space-y-3 text-slate-700">
              <p>
                Required environment variable: <code>DATABASE_URL</code>
              </p>
              <div className="rounded-md bg-slate-900 p-4 text-sm text-slate-100">
                <p>pnpm install</p>
                <p>pnpm prisma migrate dev</p>
                <p>pnpm prisma generate</p>
                <p>pnpm dev</p>
              </div>
            </div>
          </article>
        </div>
        </div>
      </section>
  );
}
