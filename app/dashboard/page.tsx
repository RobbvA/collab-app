// app/dashboard/page.jsx

const MOCK_PRS_TO_REVIEW = [
  {
    id: 1,
    title: "Refactor auth middleware",
    repo: "acme/api-server",
    author: "jane-doe",
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Improve dashboard loading state",
    repo: "acme/web-app",
    author: "teammate42",
    updatedAt: "5 hours ago",
  },
];

const MOCK_ASSIGNED_ISSUES = [
  {
    id: 101,
    title: "Fix flaky E2E test for login flow",
    repo: "acme/web-app",
    priority: "High",
    updatedAt: "1 day ago",
  },
  {
    id: 102,
    title: "Update README for API rate limits",
    repo: "acme/api-server",
    priority: "Medium",
    updatedAt: "3 days ago",
  },
];

const MOCK_RECENT_MERGES = [
  {
    id: 201,
    title: "Add skeleton loaders to dashboard",
    repo: "acme/web-app",
    mergedAt: "Yesterday",
  },
  {
    id: 202,
    title: "Optimize database indexes for reports",
    repo: "acme/api-server",
    mergedAt: "2 days ago",
  },
];

export default function DashboardPage() {
  const prCount = MOCK_PRS_TO_REVIEW.length;
  const issueCount = MOCK_ASSIGNED_ISSUES.length;
  const mergeCount = MOCK_RECENT_MERGES.length;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            My Daily GitHub
          </h1>
          <p className="text-xs text-neutral-500">
            A calm, compressed overview of what actually needs your attention.
          </p>
        </header>

        {/* Section: PRs waiting for your review */}
        <section>
          <details
            className="rounded-lg border border-neutral-800 bg-neutral-900/40"
            open
          >
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs text-neutral-300 select-none">
              <span className="font-medium">
                Pull requests waiting for your review
              </span>
              <span className="flex items-center gap-2 text-[11px] text-neutral-500">
                {prCount === 0 ? "Nothing pending" : `${prCount} open`}
                <span className="text-neutral-700">▾</span>
              </span>
            </summary>

            <div className="border-t border-neutral-800">
              {prCount === 0 ? (
                <p className="px-4 py-3 text-xs text-neutral-500">
                  No pull requests waiting for your review. Nice. ✨
                </p>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {MOCK_PRS_TO_REVIEW.map((pr) => (
                    <li
                      key={pr.id}
                      className="px-4 py-3 text-xs hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-neutral-100 line-clamp-1">
                            {pr.title}
                          </p>
                          <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                            {pr.updatedAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                          <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                            {pr.repo}
                          </span>
                          <span>•</span>
                          <span>by {pr.author}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </section>

        {/* Section: Issues assigned to you */}
        <section>
          <details className="rounded-lg border border-neutral-800 bg-neutral-900/40">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs text-neutral-300 select-none">
              <span className="font-medium">Issues assigned to you</span>
              <span className="flex items-center gap-2 text-[11px] text-neutral-500">
                {issueCount === 0 ? "None" : `${issueCount} open`}
                <span className="text-neutral-700">▾</span>
              </span>
            </summary>

            <div className="border-t border-neutral-800">
              {issueCount === 0 ? (
                <p className="px-4 py-3 text-xs text-neutral-500">
                  No open issues assigned to you. Enjoy the quiet. 🧘
                </p>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {MOCK_ASSIGNED_ISSUES.map((issue) => (
                    <li
                      key={issue.id}
                      className="px-4 py-3 text-xs hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-neutral-100 line-clamp-1">
                            {issue.title}
                          </p>
                          <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                            {issue.updatedAt}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-neutral-500">
                            {issue.repo}
                          </span>
                          <span className="text-[10px] rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-300">
                            {issue.priority} priority
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </section>

        {/* Section: Recently merged by you */}
        <section>
          <details className="rounded-lg border border-neutral-800 bg-neutral-900/40">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs text-neutral-300 select-none">
              <span className="font-medium">Recently merged by you</span>
              <span className="flex items-center gap-2 text-[11px] text-neutral-500">
                {mergeCount === 0 ? "Nothing yet" : `${mergeCount} recent`}
                <span className="text-neutral-700">▾</span>
              </span>
            </summary>

            <div className="border-t border-neutral-800">
              {mergeCount === 0 ? (
                <p className="px-4 py-3 text-xs text-neutral-500">
                  No recent merges yet. Ship something small today. 🚀
                </p>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {MOCK_RECENT_MERGES.map((pr) => (
                    <li
                      key={pr.id}
                      className="px-4 py-3 text-xs hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-neutral-100 line-clamp-1">
                          {pr.title}
                        </p>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500">
                          <span>{pr.repo}</span>
                          <span className="text-[10px]">{pr.mergedAt}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
