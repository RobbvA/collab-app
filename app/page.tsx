// app/page.jsx
import Link from "next/link";

const METRICS = [
  { label: "Signals", value: "3" },
  { label: "Server-side", value: "100%" },
  { label: "Noise", value: "Reduced" },
  { label: "OAuth", value: "GitHub" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Background glow / gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-10 left-10 h-[320px] w-[320px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="border-b border-white/10 bg-neutral-950/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <span className="h-3.5 w-3.5 rounded-sm bg-blue-400" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              CalmHub
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-xs text-neutral-300 md:flex">
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <a
              href="https://github.com/RobbvA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              RobbvA
            </a>
            <a
              href="https://github.com/SimonBates3568"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              SimonBates3568
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-white/10 transition md:inline-flex"
            >
              Open dashboard
            </Link>

            <Link
              href="/api/auth/signin"
              className="inline-flex rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold text-neutral-950 hover:bg-blue-400 transition"
            >
              Sign in with GitHub
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left copy */}
          <div className="space-y-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-neutral-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Calm, compressed GitHub overview
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              See what matters on GitHub.
              <span className="block text-blue-300">Without the noise.</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-neutral-300">
              CalmHub compresses your GitHub activity into three signals: review
              requests, assigned issues, and recently merged PRs. It runs
              server-side with GitHub OAuth and supports quick actions like
              commenting directly from the dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200 transition"
              >
                Open dashboard
              </Link>

              <Link
                href="/api/auth/signin"
                className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-white/10 transition"
              >
                Sign in with GitHub
              </Link>

              <span className="text-[11px] text-neutral-500">
                Server-side GitHub API. No direct client calls.
              </span>
            </div>

            {/* Mini bullets */}
            <div className="grid gap-2 pt-4 text-xs text-neutral-300 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-neutral-100">Review requests</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  PRs waiting for your review, with inline actions.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-neutral-100">Assigned issues</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Open work owned by you, instantly visible.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-neutral-100">Recently merged</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  A clean log of your shipped changes.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-neutral-100">
                  Last commit insight
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Repo-level commit context, expandable details.
                </p>
              </div>
            </div>
          </div>

          {/* Right visual (device mock) */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-blue-500/10 blur-2xl" />

            <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-yellow-300/80" />
                  <span className="h-2 w-2 rounded-full bg-green-400/80" />
                </div>
                <span className="text-[11px] text-neutral-400">
                  CalmHub / Dashboard
                </span>
              </div>

              <div className="grid gap-3 pt-4">
                <MockCard title="Pull requests waiting for your review" />
                <MockCard title="Issues assigned to you" />
                <MockCard title="Recently merged by you" />
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-4 top-10 hidden w-44 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-neutral-200 backdrop-blur md:block">
              <p className="text-[11px] text-neutral-400">Focus signal</p>
              <p className="mt-1 font-medium">Review requested</p>
              <p className="mt-1 text-[11px] text-neutral-500">
                No distractions
              </p>
            </div>

            <div className="absolute -right-4 bottom-10 hidden w-44 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-neutral-200 backdrop-blur md:block">
              <p className="text-[11px] text-neutral-400">Quick action</p>
              <p className="mt-1 font-medium">Comment from CalmHub</p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Server-side API
              </p>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-12 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2 md:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-[11px] text-neutral-400">{m.label}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-neutral-100">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>
            OAuth token is used server-side to fetch your dashboard and post
            comments.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RobbvA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-200 transition"
            >
              RobbvA GitHub
            </a>
            <a
              href="https://github.com/SimonBates3568"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-200 transition"
            >
              SimonBates3568 GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function MockCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-neutral-100">{title}</p>
          <p className="mt-1 text-[11px] text-neutral-400">
            Minimal sections. Calm signals. Fast actions.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-300">
          live
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="h-2 w-11/12 rounded bg-white/10" />
        <div className="h-2 w-8/12 rounded bg-white/10" />
        <div className="h-2 w-9/12 rounded bg-white/10" />
      </div>
    </div>
  );
}
