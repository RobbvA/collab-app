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

  if (!session) {
    redirect("/api/auth/signin");
  }

  const accessToken = session.accessToken;

  const [pullsToReview, assignedIssues, recentlyMerged] = await Promise.all([
    getPullsToReview(accessToken),
    getAssignedIssues(accessToken),
    getRecentlyMerged(accessToken),
  ]);

  const formatDate = (isoLike) => {
    if (!isoLike) return "";
    const d = new Date(isoLike);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <div className="flex justify-end">
          <AuthStatus />
        </div>

        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            My Daily GitHub
          </h1>
          <p className="text-xs text-neutral-500">
            A calm, compressed overview of what actually needs your attention.
          </p>
        </header>

        <CommentProvider>
          {/* PRs */}
          <DashboardSection
            title="Pull requests waiting for your review"
            count={pullsToReview.length}
            defaultOpen={true}
          >
            {pullsToReview.length === 0 ? (
              <p className="px-4 py-3 text-xs text-neutral-500">
                No pull requests waiting. ✨
              </p>
            ) : (
              <ul className="divide-y divide-neutral-800">
                {pullsToReview.map((pr) => (
                  <DashboardListItem
                    key={pr.id}
                    title={pr.title}
                    metaLeft={
                      <>
                        <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                          {pr.owner}/{pr.repo}
                        </span>
                        <span>•</span>
                        <span>by {pr.author?.login ?? "unknown"}</span>
                      </>
                    }
                    metaRight={formatDate(pr.updatedAt)}
                    owner={pr.owner}
                    repo={pr.repo}
                    number={pr.number}
                    itemType="pr"
                  />
                ))}
              </ul>
            )}
          </DashboardSection>

          {/* Issues */}
          <DashboardSection
            title="Issues assigned to you"
            count={assignedIssues.length}
          >
            {assignedIssues.length === 0 ? (
              <p className="px-4 py-3 text-xs text-neutral-500">
                No assigned issues. 🧘
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
                        <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                          {issue.labels?.[0] ?? "Issue"}
                        </span>
                      </>
                    }
                    metaRight={formatDate(issue.updatedAt)}
                    owner={issue.owner}
                    repo={issue.repo}
                    number={issue.number}
                    itemType="issue"
                  />
                ))}
              </ul>
            )}
          </DashboardSection>

          {/* Recently merged */}
          <DashboardSection
            title="Recently merged by you"
            count={recentlyMerged.length}
          >
            {recentlyMerged.length === 0 ? (
              <p className="px-4 py-3 text-xs text-neutral-500">
                Nothing merged yet. 🚀
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
                    // fallback: some implementations use updatedAt when mergedAt isn't present
                    metaRight={formatDate(pr.mergedAt ?? pr.updatedAt)}
                    owner={pr.owner}
                    repo={pr.repo}
                    number={pr.number}
                    itemType="pr"
                  />
                ))}
              </ul>
            )}
          </DashboardSection>
        </CommentProvider>
      </div>
    </main>
  );
}
