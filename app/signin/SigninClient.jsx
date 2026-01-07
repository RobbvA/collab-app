"use client";

import { useSearchParams } from "next/navigation";

export default function SigninClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");

  // render jouw signin UI, inclusief error/callback info
  return (
    <>
      {error ? (
        <p className="text-sm text-red-400">Sign-in error: {error}</p>
      ) : null}
      {/* rest van je signin UI */}
    </>
  );
}
