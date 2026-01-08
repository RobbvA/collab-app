// FILE: components/AuthStatus.jsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-xs text-neutral-500">Checking session...</div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="text-xs border border-neutral-700 px-3 py-1 rounded hover:bg-neutral-900"
      >
        Log in with GitHub
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs text-neutral-300">
      <span>
        Logged in as{" "}
        <span className="font-medium">
          {session.user?.name ?? session.user?.email ?? "GitHub user"}
        </span>
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="border border-neutral-700 px-3 py-1 rounded hover:bg-neutral-900"
      >
        Log out
      </button>
    </div>
  );
}
