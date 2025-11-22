# CalmHub — Minimal GitHub Overview Dashboard

CalmHub is a minimalist, focused dashboard that displays real-time GitHub information based on the authenticated user.  
Built with Next.js (App Router), Tailwind CSS, and NextAuth.

The goal:  
A calm, distraction-free place where you can instantly see what actually needs your attention on GitHub.

---

## Features (MVP)

### GitHub OAuth Login

- Secure login via GitHub using NextAuth.
- Access token is stored server-side.
- Dashboard is protected: unauthenticated users are redirected to sign in.

### Personal GitHub Dashboard

The dashboard retrieves real-time information from the GitHub API, specific to the logged-in user.

1. **Pull Requests waiting for your review**  
   via:  
   `GET /search/issues?q=is:pr+review-requested:@me+state:open`

2. **Issues assigned to you**  
   via:  
   `GET /search/issues?q=is:issue+assignee:@me+state:open`

3. **Recently merged by you**  
   via:  
   `GET /search/issues?q=is:pr+author:@me+is:merged&sort=updated&order=desc`

### Clean Data Layer

- All GitHub logic lives inside `/lib/github/`
- `githubFetch` automatically uses the logged-in user's access token
- Server Components fetch GitHub data securely on the backend

### Calm & Minimal UI

- Single-column layout
- Minimalistic and distraction-free
- Collapsible sections
- Designed as a daily “focus overview”

---

## 🛠 Getting Started

Install dependencies:

```bash
npm install

Start the development server:

npm run dev


Open the dashboard:

http://localhost:3000/dashboard


Sign in with GitHub to view your personalized CalmHub dashboard.

🔧 Environment Variables

Create a .env.local file:

GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here


Optional fallback (not recommended for production):

GITHUB_TOKEN=your_personal_access_token_here

Project Structure
app/
  api/auth/[...nextauth]/route.ts   # NextAuth config
  dashboard/page.jsx                # Protected dashboard page
components/
  AuthStatus.jsx
  Dashboard/
    DashboardSection.jsx
    DashboardListItem.jsx
lib/
  github/
    client.ts                       # GitHub fetch wrapper
    dashboard.ts                    # PRs, issues, merges loaders

🤝 Contributors

Robbert van Asselt — Full Stack Developer

Simon Bates — Full Stack Developer
```
