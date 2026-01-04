import githubFetch from "./client";

export type CommentTarget = {
  owner: string;
  repo: string;
  number: number;
};

export async function postComment(
  target: CommentTarget,
  body: string,
  accessToken?: string
) {
  if (!body || body.trim().length === 0) {
    const err: any = new Error("Comment body is required");
    err.status = 400;
    throw err;
  }

  const { owner, repo, number } = target;

  try {
    const res = await githubFetch(
      `/repos/${owner}/${repo}/issues/${number}/comments`,
      {
        method: "POST",
        // Cast to BodyInit because RequestInit.body expects BodyInit; githubFetch
        // can handle plain objects but TypeScript types require the cast here.
        body: { body } as unknown as BodyInit,
      },
      accessToken
    );

    return res;
  } catch (error) {
    const e: any = error;
    const message = e?.message ?? "Failed to post comment to GitHub";
    const err: any = new Error(message);
    err.status = e?.status ?? 500;
    err.payload = e?.payload;
    throw err;
  }
}

export default postComment;
