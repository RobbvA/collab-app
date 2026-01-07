// app/api/github/issue/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

type GitHubIssueLike = {
  state: "open" | "closed";
  comments: number;
  pull_request?: unknown;
};

type GitHubPullLike = {
  merged_at: string | null;
};

export async function GET(req: Request) {
  try {
    // 1) Auth
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
    const numberRaw = searchParams.get("number");

    if (!owner || !repo || !numberRaw) {
      return NextResponse.json(
        { error: "Missing query params: owner, repo, number" },
        { status: 400 }
      );
    }

    const number = Number(numberRaw);
    if (!Number.isFinite(number) || number <= 0) {
      return NextResponse.json(
        { error: "Invalid number param" },
        { status: 400 }
      );
    }

    // 3) Issue/PR base metadata
    const issueUrl = `https://api.github.com/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}/issues/${number}`;

    const issueRes = await fetch(issueUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!issueRes.ok) {
      const detail = await issueRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "GitHub issue lookup failed",
          status: issueRes.status,
          detail: detail || issueRes.statusText,
        },
        { status: issueRes.status }
      );
    }

    const issueData = (await issueRes.json()) as GitHubIssueLike;

    // ✅ isPR één keer bepalen, nooit reassignment
    const isPR = Boolean(issueData.pull_request);

    // 4) Als PR: haal merged status op (optioneel)
    let merged = false;

    if (isPR) {
      const prUrl = `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(repo)}/pulls/${number}`;

      const prRes = await fetch(prUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      });

      if (prRes.ok) {
        const prData = (await prRes.json()) as GitHubPullLike;
        merged = Boolean(prData.merged_at);
      }
    }

    return NextResponse.json(
      {
        owner,
        repo,
        number,
        state: issueData.state,
        commentsCount: issueData.comments,
        isPR,
        merged,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal error in /api/github/issue", message },
      { status: 500 }
    );
  }
}
