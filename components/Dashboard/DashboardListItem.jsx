// components/Dashboard/DashboardListItem.jsx

"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CommentContext } from "./CommentProvider";

export default function DashboardListItem({
  title,
  metaLeft,
  metaRight,
  // optional fields used for comment posting
  owner,
  repo,
  number,
  itemType = "item",
}) {
  const id = `${itemType}-${owner}-${repo}-${number}`;
  const { openComposer, setOpenComposer } = useContext(CommentContext);
  const open = openComposer === id;
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/github/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, number, body }),
      });

      const payload = await res.json();

      if (!res.ok) {
        setError(payload?.error || "Failed to post comment");
        setLoading(false);
        return;
      }

      // Success: close composer and refresh the page/server data
      setOpenComposer(null);
      setBody("");
      setLoading(false);
      router.refresh();
    } catch (err) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  // Fetch comment count via server endpoint (cached in sessionStorage)
  React.useEffect(() => {
    if (!owner || !repo || !number) return;
    const key = `commentCount:${owner}:${repo}:${number}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      try {
        setCommentCount(Number(cached));
      } catch {
        // ignore
      }
      return;
    }

    let mounted = true;
    fetch(`/api/github/issue?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&number=${encodeURIComponent(number)}`)
      .then((r) => r.json())
      .then((payload) => {
        if (!mounted) return;
        if (payload && typeof payload.comments === 'number') {
          setCommentCount(payload.comments);
          try { sessionStorage.setItem(key, String(payload.comments)); } catch {}
        }
      })
      .catch(() => {
        // silently ignore network errors for badge
      });

    return () => { mounted = false; };
  }, [owner, repo, number]);

  return (
    <li className="px-4 py-3 text-xs hover:bg-neutral-900 cursor-pointer transition-colors">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-neutral-100 line-clamp-1">{title}</p>
          <div className="flex items-center gap-2">
            {metaRight && (
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                {metaRight}
              </span>
            )}
            {/* Comment toggle (only if we have owner/repo/number) */}
            {owner && repo && number && (
              <button
                className="ml-2 text-neutral-400 hover:text-neutral-200 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  setOpenComposer(open ? null : id);
                }}
                aria-expanded={open}
                aria-label={open ? 'Close comment composer' : 'Open comment composer'}
                title={open ? 'Close comment' : 'Add comment'}
              >
                {/* comment bubble icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[11px]"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="sr-only">Comment</span>
                {commentCount != null && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-neutral-700 px-2 py-0.5 text-[10px] text-neutral-200">
                    {commentCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {metaLeft && (
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            {metaLeft}
          </div>
        )}

        {open && (
          <form onSubmit={handleSubmit} className="mt-2">
            <textarea
              className="w-full rounded-md bg-neutral-800 p-2 text-sm text-neutral-100"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a brief, focused comment..."
            />

            <div className="mt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || body.trim().length === 0}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post comment"}
              </button>

              <button
                type="button"
                className="text-sm text-neutral-400"
                onClick={() => {
                  setOpenComposer(null);
                  setBody("");
                  setError(null);
                }}
              >
                Cancel
              </button>

              {error && (
                <span className="text-sm text-red-400">{String(error)}</span>
              )}
            </div>
          </form>
        )}
      </div>
    </li>
  );
}
