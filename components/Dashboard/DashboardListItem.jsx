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
                className="ml-2 text-[11px] text-neutral-400 hover:text-neutral-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  setOpenComposer(open ? null : id);
                }}
                aria-expanded={open}
              >
                Comment
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
