import { NextResponse } from "next/server";
import githubFetch from "../../../../lib/github/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const owner = url.searchParams.get("owner");
    const repo = url.searchParams.get("repo");
    const number = url.searchParams.get("number");

    if (!owner || !repo || !number) {
      return NextResponse.json({ error: "Missing owner, repo or number" }, { status: 400 });
    }

    const issueNumber = Number(number);
    if (Number.isNaN(issueNumber) || issueNumber <= 0) {
      return NextResponse.json({ error: "Invalid issue/PR number" }, { status: 400 });
    }

    const data = await githubFetch(`/repos/${owner}/${repo}/issues/${issueNumber}`);

    // Return only small payload to the client
    return NextResponse.json({ comments: data?.comments ?? 0, state: data?.state ?? null });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Failed to fetch issue";
    return NextResponse.json({ error: message }, { status });
  }
}
