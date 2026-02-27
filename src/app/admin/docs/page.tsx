const adminRoutes = [
  { path: "/admin/dashboard", purpose: "View key stats and recent admin activity." },
  { path: "/admin/election/election-overview", purpose: "Review election summary and records." },
  { path: "/admin/election/create", purpose: "Create a new election." },
  { path: "/admin/election/manage", purpose: "Manage existing elections and open a specific one." },
  { path: "/admin/system-status", purpose: "Check app/database/auth health and alerts." },
  { path: "/admin/settings", purpose: "Manage users, roles, and audit logs." },
  { path: "/admin/docs", purpose: "Read admin documentation and operations guide." },
];

const electionFlow = [
  "Create an election with name, schedule, and initial status.",
  "Define positions and party lists.",
  "Add candidates for each position.",
  "Move election to active state when voting opens.",
  "Monitor progress from dashboard and system status pages.",
  "Close election and review results/rankings.",
];

const electionStatusDetails = [
  {
    status: "PENDING",
    description:
      "You need to manually start the election as long as the end date has not passed. You can adjust the end date in Settings > (choose the election) > Configure.",
  },
  {
    status: "SCHEDULED",
    description: "The election will automatically start based on its start date.",
  },
  {
    status: "PAUSED",
    description: "If the election is ONGOING, you can pause it.",
  },
  {
    status: "STOPPED",
    description:
      "A stopped election cannot be reopened or reverted, and it is not treated as a completed election.",
  },
  {
    status: "COMPLETED",
    description:
      "Votes are tallied, winners per position are available in Vote Result, and the election cannot be reopened.",
  },
];

const adminRules = [
  "Only ADMIN accounts can access admin routes.",
  "Election and user changes should be logged and reviewable.",
  "Use settings actions carefully because some operations are irreversible.",
  "Confirm election timing and status before opening voting.",
];

const troubleshootingItems = [
  {
    issue: "Admin page shows no data.",
    fix: "Check database connection in system status and verify seeded/live records exist.",
  },
  {
    issue: "Election is not visible to voters.",
    fix: "Confirm election status and schedule are valid for voter-facing pages.",
  },
  {
    issue: "Unable to manage users in settings.",
    fix: "Verify your account role is ADMIN and session is still active.",
  },
  {
    issue: "Recent changes are not reflected.",
    fix: "Refresh the page and check revalidation-sensitive routes again.",
  },
];

const sections = [
  { id: "overview", label: "Overview" },
  { id: "quick-start", label: "Quick Start" },
  { id: "create-election", label: "Create Election" },
  { id: "make-admin", label: "Make User Admin" },
  { id: "admin-routes", label: "Admin Routes" },
  { id: "election-lifecycle", label: "Election Lifecycle" },
  { id: "election-status", label: "Election Status" },
  { id: "settings-and-audit", label: "Settings & Audit Logs" },
  { id: "system-status", label: "System Status" },
  { id: "admin-rules", label: "Admin Rules" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export default function AdminDocsPage() {
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
              Admin Documentation
            </h1>
            <p className="mt-2 text-slate-600">
              Operations guide for managing elections, users, and system health.
            </p>
          </header>

          <article id="quick-start" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">Quick Start</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Open the admin dashboard and confirm system health.</li>
              <li>Create or review elections before voting starts.</li>
              <li>Validate candidates, positions, and party lists.</li>
              <li>Monitor ongoing elections and user activity.</li>
              <li>Use settings for role updates and audit review.</li>
            </ol>
          </article>

          <article
            id="create-election"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              How to Create an Election
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Click <span className="font-semibold">Create</span> under the Election menu.</li>
              <li>
                Fill in the required fields.
                <br />
                <span className="text-sm text-slate-600">
                  Note: You cannot set a start date when the status is
                  <span className="font-mono"> PENDING</span>.
                </span>
              </li>
              <li>Click Save. You can manage the election afterward.</li>
            </ol>
          </article>

          <article id="make-admin" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">
              How to Make a User an Admin
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Go to <span className="font-mono">/admin/settings</span>.</li>
              <li>Open the User Management section.</li>
              <li>Find the user account you want to update.</li>
              <li>Change the user role to <span className="font-mono">ADMIN</span>.</li>
              <li>Save the update and verify the change in the user list.</li>
            </ol>
          </article>

          <article id="admin-routes" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">Admin Routes</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {adminRoutes.map((route) => (
                <li key={route.path} className="rounded-md border bg-slate-50 p-3">
                  <p className="font-mono text-sm text-slate-900">{route.path}</p>
                  <p className="text-sm text-slate-600">{route.purpose}</p>
                </li>
              ))}
            </ul>
          </article>

          <article
            id="election-lifecycle"
            className="rounded-2xl border bg-white p-6 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-brand-100">
              Election Lifecycle
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              {electionFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article id="election-status" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">Election Status</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {electionStatusDetails.map((item) => (
                <li key={item.status} className="rounded-md border bg-slate-50 p-3">
                  <p className="font-mono text-sm text-slate-900">{item.status}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-6 lg:grid-cols-2">
            <article
              id="settings-and-audit"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">
                Settings & Audit Logs
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>Manage users and role assignments.</li>
                <li>Review tracked admin actions in audit logs.</li>
                <li>Use destructive actions carefully (deletes and vote removals).</li>
              </ul>
            </article>

            <article
              id="system-status"
              className="rounded-2xl border bg-white p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-brand-100">
                System Status
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>Verify database, authentication, and app status.</li>
                <li>Use alerts to identify integrity or availability issues.</li>
                <li>Refresh checks after configuration or data changes.</li>
              </ul>
            </article>
          </div>

          <article id="admin-rules" className="rounded-2xl border bg-white p-6 scroll-mt-24">
            <h2 className="text-xl font-semibold text-brand-100">Admin Rules</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {adminRules.map((rule) => (
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
        </div>
      </div>
    </section>
  );
}
