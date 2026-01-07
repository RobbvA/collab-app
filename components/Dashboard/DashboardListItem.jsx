// components/Dashboard/DashboardListItem.jsx
"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommentContext } from "./CommentProvider";

const LAST_COMMIT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

function clipCommitMessage(msg, max = 72) {
  if (!msg) return "";
  const firstLine = String(msg).split("\n")[0];
  if (firstLine.length <= max) return firstLine;
  return `${firstLine.slice(0, max - 1)}…`;
}

function shortSha(sha) {
  if (!sha) return "";
  return String(sha).slice(0, 7);
}

export default function DashboardListItem({
  title,
  metaLeft,
  metaRight,
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

  // last commit (default branch)
  const [lastCommit, setLastCommit] = useState(null);
  const [lastCommitLoading, setLastCommitLoading] = useState(false);

  // dropdown
  const [commitOpen, setCommitOpen] = useState(false);

  const router = useRouter();

  const hasRepoIdentity = Boolean(owner && repo);
  const hasItemIdentity = Boolean(owner && repo && number);

  const repoCacheKey = useMemo(() => {
    if (!hasRepoIdentity) return null;
    return `lastCommit:${owner}:${repo}`;
  }, [hasRepoIdentity, owner, repo]);

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

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setError(payload?.error || "Failed to post comment");
        setLoading(false);
        return;
      }

      setOpenComposer(null);
      setBody("");
      setLoading(false);

      if (hasItemIdentity) {
        const key = `commentCount:${owner}:${repo}:${number}`;
        try {
          sessionStorage.removeItem(key);
        } catch {}
      }

      router.refresh();
    } catch (err) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  // Fetch comment count via server endpoint (cached in sessionStorage)
  useEffect(() => {
    if (!hasItemIdentity) return;

    const key = `commentCount:${owner}:${repo}:${number}`;

    const cached = sessionStorage.getItem(key);
    if (cached != null) {
      const n = Number(cached);
      if (!Number.isNaN(n)) setCommentCount(n);
      return;
    }

    let mounted = true;

    fetch(
      `/api/github/issue?owner=${encodeURIComponent(
        owner
      )}&repo=${encodeURIComponent(repo)}&number=${encodeURIComponent(number)}`
    )
      .then((r) => r.json())
      .then((payload) => {
        if (!mounted) return;

        const count =
          payload && typeof payload.commentsCount === "number"
            ? payload.commentsCount
            : null;

        if (count != null) {
          setCommentCount(count);
          try {
            sessionStorage.setItem(key, String(count));
          } catch {}
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      mounted = false;
    };
  }, [hasItemIdentity, owner, repo, number]);

  // Fetch last commit for repo (cached with TTL in sessionStorage)
  useEffect(() => {
    if (!repoCacheKey || !hasRepoIdentity) return;

    // 1) Try cache
    const cachedRaw = sessionStorage.getItem(repoCacheKey);
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof parsed.ts === "number" &&
          parsed.data
        ) {
          const age = Date.now() - parsed.ts;
          if (age >= 0 && age <= LAST_COMMIT_TTL_MS) {
            setLastCommit(parsed.data);
            return;
          }
        }
      } catch {}
    }

    // 2) Fetch from server
    let mounted = true;
    setLastCommitLoading(true);

    fetch(
      `/api/github/repo-last-commit?owner=${encodeURIComponent(
        owner
      )}&repo=${encodeURIComponent(repo)}`
    )
      .then((r) => r.json())
      .then((payload) => {
        if (!mounted) return;

        if (payload && typeof payload.message === "string") {
          setLastCommit(payload);
          try {
            sessionStorage.setItem(
              repoCacheKey,
              JSON.stringify({ ts: Date.now(), data: payload })
            );
          } catch {}
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        if (mounted) setLastCommitLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [repoCacheKey, hasRepoIdentity, owner, repo]);

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

            {hasItemIdentity && (
              <button
                className="ml-2 text-neutral-400 hover:text-neutral-200 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  setOpenComposer(open ? null : id);
                }}
                aria-expanded={open}
                aria-label={
                  open ? "Close comment composer" : "Open comment composer"
                }
                title={open ? "Close comment" : "Add comment"}
              >
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

        {/* Last commit line + dropdown */}
        {hasRepoIdentity && (
          <div className="text-[11px] text-neutral-600">
            {lastCommit ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommitOpen((v) => !v);
                  }}
                  aria-expanded={commitOpen}
                >
                  <span className="text-neutral-500">Last commit:</span>
                  <span className="text-neutral-400">
                    {clipCommitMessage(lastCommit.message)}
                  </span>
                  {lastCommit.date ? (
                    <>
                      <span className="text-neutral-700">•</span>
                      <span className="text-neutral-500">
                        {formatDate(lastCommit.date)}
                      </span>
                    </>
                  ) : null}

                  <span className="ml-1 text-neutral-500">
                    {commitOpen ? "▾" : "▸"}
                  </span>
                </button>

                {commitOpen && (
                  <div
                    className="rounded-md border border-neutral-800 bg-neutral-900/40 p-3 text-[11px] text-neutral-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-neutral-400">
                        <span className="rounded-full border border-neutral-800 px-2 py-0.5">
                          branch: {lastCommit.defaultBranch ?? "main"}
                        </span>
                        {lastCommit.sha ? (
                          <span className="rounded-full border border-neutral-800 px-2 py-0.5">
                            sha: {shortSha(lastCommit.sha)}
                          </span>
                        ) : null}
                      </div>

                      <div className="whitespace-pre-wrap text-neutral-200">
                        {String(lastCommit.message)}
                      </div>

                      {lastCommit.htmlUrl ? (
                        <a
                          href={lastCommit.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-300 hover:text-neutral-100 underline-offset-2 hover:underline"
                        >
                          Open commit on GitHub
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ) : lastCommitLoading ? (
              <span className="text-neutral-700">Fetching last commit…</span>
            ) : (
              <span className="text-neutral-700">Last commit unavailable</span>
            )}
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
