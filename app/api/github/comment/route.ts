import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, ExtendedSession } from "../../auth/[...nextauth]/route";
import postComment from "../../../../lib/github/comments";

export async function POST(request: Request) {
  try {
  const session = (await getServerSession(authOptions)) as ExtendedSession | null;

  if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { owner, repo, number, body } = payload ?? {};

    if (!owner || !repo || !number || !body) {
      return NextResponse.json(
        { error: "Missing required fields: owner, repo, number, body" },
        { status: 400 }
      );
    }

    const issueNumber = typeof number === "string" ? parseInt(number, 10) : number;
    if (Number.isNaN(issueNumber) || issueNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid issue/PR number" },
        { status: 400 }
      );
    }

    const result = await postComment(
      { owner, repo, number: issueNumber },
      String(body),
      session.accessToken
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal Server Error";
    return NextResponse.json({ error: message, payload: err?.payload ?? null }, { status });
  }
}
