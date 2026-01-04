#!/usr/bin/env node
// scripts/test-post-comment.js
// Small helper to post a comment to a GitHub issue/PR using a token in GITHUB_TOKEN.
// Usage (positional):
//   GITHUB_TOKEN=... node scripts/test-post-comment.js owner repo number "This is a test"
// Or set env vars: TEST_OWNER, TEST_REPO, TEST_NUMBER, TEST_BODY

const [,, ownerArg, repoArg, numberArg, ...bodyParts] = process.argv;
const owner = ownerArg || process.env.TEST_OWNER;
const repo = repoArg || process.env.TEST_REPO;
const number = numberArg ? parseInt(numberArg, 10) : (process.env.TEST_NUMBER ? parseInt(process.env.TEST_NUMBER, 10) : null);
const body = bodyParts.length ? bodyParts.join(' ') : (process.env.TEST_BODY || 'Test comment from scripts/test-post-comment.js');

if (!process.env.GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required.');
  console.error('Set it inline for a one-off run (secure terminal) or export it in your shell session.');
  process.exit(1);
}

if (!owner || !repo || !number) {
  console.error('Usage: GITHUB_TOKEN=... node scripts/test-post-comment.js owner repo number "This is a test"');
  process.exit(1);
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ body }),
    });

    const payload = await res.json().catch(() => null);

    console.log('Status:', res.status);
    if (payload) {
      console.log('Response:', JSON.stringify(payload, null, 2));
    } else {
      console.log('No JSON response body');
    }

    if (!res.ok) process.exitCode = 2;
  } catch (err) {
    console.error('Network or fetch error:', err);
    process.exitCode = 3;
  }
}

main();
