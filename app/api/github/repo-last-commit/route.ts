// app/api/github/repo-last-commit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

type RepoResponse = {
  default_branch: string;
};

type CommitResponse = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
};

export async function GET(req: Request) {
  try {
    // 1) Auth (server-side)
    const session = await getServerSession(authOptions);
    const accessToken = (session as { accessToken?: string } | null)
      ?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: missing session or access token" },
        { status: 401 }
      );
    }

    // 2) Params
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Missing query params: owner, repo" },
        { status: 400 }
      );
    }

    // 3) Fetch repo -> default branch
    const repoUrl = `https://api.github.com/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}`;

    const repoRes = await fetch(repoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!repoRes.ok) {
      const detail = await repoRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "GitHub repo lookup failed",
          status: repoRes.status,
          detail: detail || repoRes.statusText,
        },
        { status: repoRes.status }
      );
    }

    const repoData = (await repoRes.json()) as RepoResponse;
    const defaultBranch = repoData.default_branch || "main";

    // 4) Fetch last commit on default branch
    const commitUrl = `https://api.github.com/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(
      defaultBranch
    )}`;

    const commitRes = await fetch(commitUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!commitRes.ok) {
      const detail = await commitRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "GitHub commit lookup failed",
          status: commitRes.status,
          detail: detail || commitRes.statusText,
        },
        { status: commitRes.status }
      );
    }

    const commitData = (await commitRes.json()) as CommitResponse;

    return NextResponse.json(
      {
        owner,
        repo,
        defaultBranch,
        sha: commitData.sha,
        message: commitData.commit.message,
        date: commitData.commit.author.date,
        htmlUrl: commitData.html_url,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal error in /api/github/repo-last-commit", message },
      { status: 500 }
    );
  }
}
