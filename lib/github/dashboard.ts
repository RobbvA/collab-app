/**
 * /lib/github/dashboard.ts
 *
 * Real implementation of:
 * - getPullsToReview(accessToken)
 * - getAssignedIssues(accessToken)
 * - getRecentlyMerged(accessToken)
 */

import githubFetch from "./client";

export type GitUser = {
  login: string;
  id: number;
  avatarUrl?: string;
  htmlUrl?: string;
};

export type PullRequest = {
  id: string;
  number: number;
  title: string;
  body?: string;
  repo: string; // repo name, e.g. "repo-name"
  owner: string; // owner/org, e.g. "owner"
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  author: GitUser;
  reviewers: GitUser[];
  labels: string[];
  state: "open" | "closed" | "merged";
  isDraft: boolean;
  commentsCount: number;
  reviewCommentsCount: number;
  additions?: number;
  deletions?: number;
};

export type AssignedIssue = {
  id: string;
  number: number;
  title: string;
  repo: string;
  owner: string;
  htmlUrl: string;
  updatedAt: string;
  labels: string[];
  state: "open" | "closed";
};

// --- GitHub Search Issues API types ---

type GitHubUser = {
  login: string;
  id: number;
  avatar_url?: string;
  html_url?: string;
};

type GitHubLabel = {
  name: string;
};

type GitHubSearchIssueItem = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  repository_url: string;
  created_at: string;
  updated_at: string;
  state: "open" | "closed";
  user: GitHubUser;
  labels: GitHubLabel[];
  draft?: boolean;
  comments: number;
};

type GitHubSearchIssuesResponse = {
  items: GitHubSearchIssueItem[];
};

/**
 * getPullsToReview
 *
 * Uses the GitHub Search API:
 *   GET /search/issues?q=is:pr+review-requested:@me+state:open
 */
export async function getPullsToReview(
  accessToken?: string
): Promise<PullRequest[]> {
  try {
    const response = await githubFetch<GitHubSearchIssuesResponse>(
      "/search/issues?q=is:pr+review-requested:@me+state:open&per_page=10",
      { method: "GET" },
      accessToken
    );

    const items = response.items ?? [];

    return items.map((item) => {
      const repoFull = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      const [owner, repo] = repoFull.split("/");

      return {
        id: String(item.id),
        number: item.number,
        title: item.title,
        body: item.body ?? undefined,
        repo,
        owner,
        htmlUrl: item.html_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        author: {
          login: item.user.login,
          id: item.user.id,
          avatarUrl: item.user.avatar_url,
          htmlUrl: item.user.html_url,
        },
        reviewers: [],
        labels: item.labels.map((label) => label.name),
        state: item.state === "open" ? "open" : "closed",
        isDraft: Boolean(item.draft),
        commentsCount: item.comments,
        reviewCommentsCount: 0,
        additions: undefined,
        deletions: undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching pulls to review from GitHub:", error);
    return [];
  }
}

/**
 * getAssignedIssues
 *
 * Uses the GitHub Search API:
 *   GET /search/issues?q=is:issue+assignee:@me+state:open
 */
export async function getAssignedIssues(
  accessToken?: string
): Promise<AssignedIssue[]> {
  try {
    const response = await githubFetch<GitHubSearchIssuesResponse>(
      "/search/issues?q=is:issue+assignee:@me+state:open&per_page=10",
      { method: "GET" },
      accessToken
    );

    const items = response.items ?? [];

    return items.map((item) => {
      const repoFull = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      const [owner, repo] = repoFull.split("/");

      return {
        id: String(item.id),
        number: item.number,
        title: item.title,
        repo,
        owner,
        htmlUrl: item.html_url,
        updatedAt: item.updated_at,
        labels: item.labels.map((label) => label.name),
        state: item.state,
      };
    });
  } catch (error) {
    console.warn("Error fetching assigned issues from GitHub:", error);
    return [];
  }
}

export type RecentlyMergedPull = {
  id: string;
  number: number;
  title: string;
  repo: string;
  owner: string;
  htmlUrl: string;
  mergedAt: string; // approximate (uses updated_at from search)
};

/**
 * getRecentlyMerged
 *
 * Uses the GitHub Search API:
 *   GET /search/issues?q=is:pr+author:@me+is:merged&sort=updated&order=desc
 *
 * Note: Search API doesn't include merged_at here; mergedAt uses updated_at as an approximation.
 */
export async function getRecentlyMerged(
  accessToken?: string
): Promise<RecentlyMergedPull[]> {
  try {
    const response = await githubFetch<GitHubSearchIssuesResponse>(
      "/search/issues?q=is:pr+author:@me+is:merged&sort=updated&order=desc&per_page=10",
      { method: "GET" },
      accessToken
    );

    const items = response.items ?? [];

    return items.map((item) => {
      const repoFull = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      const [owner, repo] = repoFull.split("/");

      return {
        id: String(item.id),
        number: item.number,
        title: item.title,
        repo,
        owner,
        htmlUrl: item.html_url,
        mergedAt: item.updated_at,
      };
    });
  } catch (error) {
    console.warn("Error fetching recently merged PRs from GitHub:", error);
    return [];
  }
}
