// lib/github/client.ts
/**
 * Simple GitHub API fetch helper.
 *
 * Reads GITHUB_TOKEN from .env.local (process.env.GITHUB_TOKEN).
 * Usage:
 *   const data = await githubFetch('/repos/owner/repo', { method: 'GET' });
 */

export async function githubFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable is required. Add it to .env.local."
    );
  }

  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `https://api.github.com${path.startsWith("/") ? path : `/${path}`}`;

  // Normalize headers
  const headers = new Headers(init.headers ?? {});

  // Auth header
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `token ${token}`);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/vnd.github+json");
  }

  if (!headers.has("X-GitHub-Api-Version")) {
    headers.set("X-GitHub-Api-Version", "2022-11-28");
  }

  // Handle JSON body
  let body = init.body as BodyInit | undefined;
  const isPlainObject =
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof Blob);

  if (isPlainObject) {
    body = JSON.stringify(body);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body,
    cache: "no-store", // always fresh GitHub data
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let payload: unknown = null;

    if (isJson) {
      try {
        payload = await res.json();
      } catch {
        // ignore parse error
      }
    } else {
      try {
        payload = await res.text();
      } catch {
        // ignore parse error
      }
    }

    // 🔹 message netjes uit payload halen zonder `any`
    let message: string;

    if (
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
    ) {
      message = (payload as { message?: string }).message ?? "";
    } else if (typeof payload === "string") {
      message = payload;
    } else if (payload != null) {
      message = JSON.stringify(payload);
    } else {
      message = `${res.status} ${res.statusText}`;
    }

    const error = new Error(`GitHub API error: ${message}`) as Error & {
      status?: number;
      payload?: unknown;
    };

    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  if (!isJson) {
    return (await res.text()) as unknown as T;
  }

  return (await res.json()) as T;
}

// Default export (compatible met bestaande imports)
export default githubFetch;
