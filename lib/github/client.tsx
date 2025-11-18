// /Users/simonbates/Desktop/collab-app/lib/github/client.tsx
/**
 * Simple GitHub API fetch helper.
 *
 * Reads GITHUB_TOKEN from .env.local (process.env.GITHUB_TOKEN).
 * Usage:
 *   const data = await githubFetch('/repos/owner/repo', { method: 'GET' });
 */

export default async function githubFetch<T = any>(
    path: string,
    init: RequestInit = {}
): Promise<T> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error(
            'GITHUB_TOKEN environment variable is required. Add it to .env.local.'
        );
    }

    const url =
        path.startsWith('http://') || path.startsWith('https://')
            ? path
            : `https://api.github.com${path.startsWith('/') ? path : `/${path}`}`;

    // Normalize headers
    const headers = new Headers(init.headers ?? {});
    // GitHub accepts either "token <token>" or "Bearer <token>" — using token scheme
    if (!headers.has('Authorization')) {
        headers.set('Authorization', `token ${token}`);
    }
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/vnd.github.v3+json');
    }

    // If body is a plain object, stringify and set JSON header
    let body: BodyInit | undefined = init.body as any;
    const isPlainObject =
        body &&
        typeof body === 'object' &&
        !(body instanceof FormData) &&
        !(body instanceof URLSearchParams) &&
        !(body instanceof ArrayBuffer) &&
        !(body instanceof Blob);
    if (isPlainObject) {
        body = JSON.stringify(body);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json; charset=utf-8');
        }
    }

    const res = await fetch(url, {
        ...init,
        headers,
        body,
    });

    // Try to parse JSON response (GitHub returns JSON for errors and success)
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!res.ok) {
        const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
        const message =
            (payload && (payload.message || JSON.stringify(payload))) ||
            `${res.status} ${res.statusText}`;
        const err: any = new Error(`GitHub API error: ${message}`);
        err.status = res.status;
        err.payload = payload;
        throw err;
    }

    if (isJson) {
        return (await res.json()) as T;
    }

    // Fallback: return raw text for non-JSON responses
    return (await res.text()) as unknown as T;
}