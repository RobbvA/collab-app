// FILE: app/signin/SigninClient.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function sanitizeCallbackUrl(raw) {
  // Default: always go to dashboard
  if (!raw) return "/dashboard";

  // Only allow relative paths. Block full URLs / external redirects.
  // If someone passes an absolute URL to the same origin, we still prefer /dashboard.
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return "/dashboard";
  }

  // Ensure it is a safe internal path
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";

  // Avoid sending users to landing after login (your reported behavior)
  if (raw === "/") return "/dashboard";

  return raw;
}

export default function SigninClient() {
  const params = useSearchParams();

  const rawCallbackUrl = params.get("callbackUrl");
  const callbackUrl = sanitizeCallbackUrl(rawCallbackUrl);
  const error = params.get("error");

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Background glow / gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-10 left-10 h-[320px] w-[320px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-10">
        <header className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition"
          >
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
              ←
            </span>
            Back to home
          </Link>

          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-neutral-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            CalmHub / Sign in
          </p>

          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Sign in with GitHub
          </h1>

          <p className="text-sm leading-relaxed text-neutral-300">
            CalmHub uses GitHub OAuth to load your personal dashboard and enable
            quick actions like posting comments. GitHub requests are performed
            server-side using your session token.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-neutral-950/40 p-6 backdrop-blur space-y-4">
          {/* Error banner (when NextAuth redirects back with ?error=...) */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-xs font-semibold text-red-200">
                Sign-in failed
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-red-200/80">
                NextAuth returned an error:{" "}
                <span className="font-mono">{error}</span>. Try signing out and
                signing in again. If it persists, verify your GitHub OAuth App
                callback URL and env vars.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-100">
              Permissions
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              CalmHub may request{" "}
              <span className="text-neutral-200 font-medium">repo</span> scope.
              This is required to post comments on PRs/issues from the dashboard
              (when you have permission).
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-neutral-100">Read</p>
              <p className="mt-1 text-[11px] text-neutral-400">
                Pull requests, issues, merged PRs, and lightweight metadata.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-neutral-100">
                Write (optional)
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                Post comments to PRs/issues from the CalmHub UI.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl })}
              className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-blue-400 transition"
            >
              Continue with GitHub
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-white/10 transition"
            >
              Open dashboard
            </Link>
          </div>

          <p className="text-[11px] text-neutral-600">
            Tip: If you recently rotated secrets or changed scopes, you may need
            to sign out and sign in again.
          </p>
        </section>

        <footer className="text-[11px] text-neutral-700">
          CalmHub is a collaborative MVP focused on calm signal extraction from
          GitHub.
        </footer>
      </div>
    </main>
  );
}
