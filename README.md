# CalmHub — Minimal GitHub Overview Dashboard

CalmHub is a minimalist, focused GitHub dashboard that shows real-time, user-specific signals after signing in with GitHub OAuth.  
Built with Next.js (App Router), Tailwind CSS, and NextAuth.

The goal is simple: a calm, distraction-free place where you can instantly see what actually needs your attention on GitHub.

---

## Why CalmHub

GitHub is powerful, but it is noisy. CalmHub compresses activity into a small set of actionable signals:

- PRs waiting for your review
- Issues assigned to you
- Recently merged PRs authored by you
- Lightweight “last commit” context per repository

This is an MVP designed for daily developer focus.

---

## Features (MVP)

### GitHub OAuth Login (NextAuth)

- Secure login via GitHub OAuth using NextAuth.
- Access token is stored in the session (server-side usage).
- Dashboard is protected: unauthenticated users are redirected to `/signin`.
- Custom sign-in page explains requested scopes and why they are needed.

### Personal GitHub Dashboard (Real Data)

CalmHub retrieves real-time information from the GitHub API, specific to the logged-in user:

1. **Pull Requests waiting for your review**  
   `GET /search/issues?q=is:pr+review-requested:@me+state:open`

2. **Issues assigned to you**  
   `GET /search/issues?q=is:issue+assignee:@me+state:open`

3. **Recently merged by you**  
   `GET /search/issues?q=is:pr+author:@me+is:merged&sort=updated&order=desc`

### Inline Comment Composer (Quick Action)

- Comment directly on PRs/issues from the dashboard UI.
- The UI calls a CalmHub server route, not GitHub directly.
- Server route posts the comment using the authenticated user’s session token.

### Repo Context: “Last Commit” (Cached)

- Expandable last-commit details per repository.
- Server route queries GitHub and caches results briefly (TTL) to avoid overfetching.

### Security & Tooling

- Secrets are protected with Husky pre-commit checks and a GitHub Actions secret scan workflow.
- Debug logging is disabled in NextAuth to prevent leaking sensitive values.

---

## Architecture Overview

### Auth flow

1. User signs in via GitHub OAuth (NextAuth)
2. NextAuth stores the GitHub access token in JWT
3. Token is copied onto the session object for server components / API routes

### Data flow

- **Server Components** (dashboard page) fetch GitHub data with the session token
- **Server Routes** (`/app/api/github/*`) call GitHub on behalf of the user
- **UI** calls CalmHub endpoints only (no direct browser → GitHub calls)

### Key folders

- `app/api/auth/[...nextauth]/route.ts` — NextAuth configuration (GitHub OAuth)
- `app/signin/page.jsx` — custom sign-in page
- `app/dashboard/page.jsx` — protected dashboard (server component)
- `app/api/github/*` — server routes that call GitHub
- `lib/github/*` — GitHub fetch wrapper + dashboard loaders
- `components/Dashboard/*` — dashboard UI + comment composer

---

## Getting Started

Install dependencies:

```bash
npm install
```
