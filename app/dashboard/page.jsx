// app/dashboard/page.jsx
import DashboardSection from "../../components/Dashboard/DashboardSection";
import DashboardListItem from "../../components/Dashboard/DashboardListItem";

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

        {/* PRs */}
        <DashboardSection
          title="Pull requests waiting for your review"
          count={MOCK_PRS_TO_REVIEW.length}
          defaultOpen={true}
        >
          {MOCK_PRS_TO_REVIEW.length === 0 ? (
            <p className="px-4 py-3 text-xs text-neutral-500">
              No pull requests waiting. ✨
            </p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {MOCK_PRS_TO_REVIEW.map((pr) => (
                <DashboardListItem
                  key={pr.id}
                  title={pr.title}
                  metaLeft={
                    <>
                      <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                        {pr.repo}
                      </span>
                      <span>•</span>
                      <span>by {pr.author}</span>
                    </>
                  }
                  metaRight={pr.updatedAt}
                />
              ))}
            </ul>
          )}
        </DashboardSection>

        {/* Issues */}
        <DashboardSection
          title="Issues assigned to you"
          count={MOCK_ASSIGNED_ISSUES.length}
        >
          {MOCK_ASSIGNED_ISSUES.length === 0 ? (
            <p className="px-4 py-3 text-xs text-neutral-500">
              No assigned issues. 🧘
            </p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {MOCK_ASSIGNED_ISSUES.map((issue) => (
                <DashboardListItem
                  key={issue.id}
                  title={issue.title}
                  metaLeft={
                    <>
                      <span>{issue.repo}</span>
                      <span>•</span>
                      <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                        {issue.priority}
                      </span>
                    </>
                  }
                  metaRight={issue.updatedAt}
                />
              ))}
            </ul>
          )}
        </DashboardSection>

        {/* Merges */}
        <DashboardSection
          title="Recently merged by you"
          count={MOCK_RECENT_MERGES.length}
        >
          {MOCK_RECENT_MERGES.length === 0 ? (
            <p className="px-4 py-3 text-xs text-neutral-500">
              Nothing merged yet. 🚀
            </p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {MOCK_RECENT_MERGES.map((pr) => (
                <DashboardListItem
                  key={pr.id}
                  title={pr.title}
                  metaLeft={<span>{pr.repo}</span>}
                  metaRight={pr.mergedAt}
                />
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>
    </main>
  );
}
