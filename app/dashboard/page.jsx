// app/dashboard/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import DashboardSection from "../../components/Dashboard/DashboardSection";
import DashboardListItem from "../../components/Dashboard/DashboardListItem";
import { CommentProvider } from "../../components/Dashboard/CommentProvider";
import {
  getPullsToReview,
  getAssignedIssues,
  getRecentlyMerged,
} from "../../lib/github/dashboard";
import { AuthStatus } from "../../components/AuthStatus";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // ✅ Route via custom sign-in page (consistent UX)
  if (!session) {
    redirect("/signin");
  }

  const accessToken = session.accessToken;

  const [pullsToReview, assignedIssues, recentlyMerged] = await Promise.all([
    getPullsToReview(accessToken),
    getAssignedIssues(accessToken),
    getRecentlyMerged(accessToken),
  ]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Background glow / gradient (same vibe as landing) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-10 left-10 h-[320px] w-[320px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Top row: title + auth */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <header className="space-y-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-neutral-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              CalmHub / Dashboard
            </p>

            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              My Daily GitHub
            </h1>

            <p className="text-sm text-neutral-300">
              A calm, compressed overview of what actually needs your attention.
            </p>
          </header>

          <div className="flex items-center justify-end gap-3">
            <a
              href="/"
              className="hidden rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-white/10 transition md:inline-flex"
            >
              Home
            </a>
            <AuthStatus />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: sections */}
          <div className="space-y-6">
            <CommentProvider>
              <DashboardSection
                title="Pull requests waiting for your review"
                count={pullsToReview.length}
                defaultOpen={true}
              >
                {pullsToReview.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-neutral-500">
                    No pull requests waiting.
                  </p>
                ) : (
                  <ul className="divide-y divide-neutral-800">
                    {pullsToReview.map((pr) => (
                      <DashboardListItem
                        key={pr.id}
                        title={pr.title}
                        metaLeft={
                          <>
                            <span className="rounded-full border border-neutral-800 bg-white/5 px-2 py-0.5">
                              {pr.owner}/{pr.repo}
                            </span>
                            <span>•</span>
                            <span>by {pr.author.login}</span>
                          </>
                        }
                        metaRight={new Date(pr.updatedAt).toLocaleDateString()}
                        owner={pr.owner}
                        repo={pr.repo}
                        number={pr.number}
                        itemType="pr"
                      />
                    ))}
                  </ul>
                )}
              </DashboardSection>

              <DashboardSection
                title="Issues assigned to you"
                count={assignedIssues.length}
              >
                {assignedIssues.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-neutral-500">
                    No assigned issues.
                  </p>
                ) : (
                  <ul className="divide-y divide-neutral-800">
                    {assignedIssues.map((issue) => (
                      <DashboardListItem
                        key={issue.id}
                        title={issue.title}
                        metaLeft={
                          <>
                            <span>
                              {issue.owner}/{issue.repo}
                            </span>
                            <span>•</span>
                            <span className="rounded-full border border-neutral-800 bg-white/5 px-2 py-0.5">
                              {issue.labels?.[0] ?? "Issue"}
                            </span>
                          </>
                        }
                        metaRight={new Date(
                          issue.updatedAt
                        ).toLocaleDateString()}
                        owner={issue.owner}
                        repo={issue.repo}
                        number={issue.number}
                        itemType="issue"
                      />
                    ))}
                  </ul>
                )}
              </DashboardSection>

              <DashboardSection
                title="Recently merged by you"
                count={recentlyMerged.length}
              >
                {recentlyMerged.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-neutral-500">
                    Nothing merged yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-neutral-800">
                    {recentlyMerged.map((pr) => (
                      <DashboardListItem
                        key={pr.id}
                        title={pr.title}
                        metaLeft={
                          <span>
                            {pr.owner}/{pr.repo}
                          </span>
                        }
                        metaRight={new Date(pr.mergedAt).toLocaleDateString()}
                        owner={pr.owner}
                        repo={pr.repo}
                        number={undefined}
                        itemType="merged"
                      />
                    ))}
                  </ul>
                )}
              </DashboardSection>
            </CommentProvider>
          </div>

          {/* Right: focus panel */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-neutral-950/40 p-5 backdrop-blur">
            <p className="text-xs font-semibold text-neutral-100">
              Focus panel
            </p>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              CalmHub reduces GitHub noise into a short list of actions. Use the
              comment composer to respond quickly without opening GitHub tabs.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-neutral-200 font-medium">Tip</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  If a repo appears multiple times, “Last commit” is cached for
                  a few minutes to avoid overfetching.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-neutral-200 font-medium">Security</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  GitHub calls are performed server-side via session token. The
                  UI never talks to GitHub directly.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://github.com/RobbvA"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-neutral-200 hover:bg-white/10 transition"
              >
                RobbvA GitHub
              </a>
              <a
                href="https://github.com/SimonBates3568"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-neutral-200 hover:bg-white/10 transition"
              >
                SimonBates3568 GitHub
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
