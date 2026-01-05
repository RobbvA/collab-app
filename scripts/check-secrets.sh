#!/usr/bin/env bash
set -eo pipefail

# Check staged files for dangerous secrets. Exit non-zero if any matches are found.
# Matches common environment keys we saw: GITHUB_TOKEN, GITHUB_CLIENT_SECRET, NEXTAUTH_SECRET

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

FOUND=0
for f in $STAGED_FILES; do
  # Skip binary files
  if git check-attr --stdin -- $f 2>/dev/null | grep -q "binary"; then
    continue
  fi

  if git show :"$f" | grep -En "GITHUB_TOKEN=|GITHUB_CLIENT_SECRET=|NEXTAUTH_SECRET=|ghp_" >/dev/null 2>&1; then
    echo "Potential secret found in staged file: $f"
    git show :"$f" | grep -En "GITHUB_TOKEN=|GITHUB_CLIENT_SECRET=|NEXTAUTH_SECRET=|ghp_" || true
    FOUND=1
  fi
done

if [ "$FOUND" -ne 0 ]; then
  echo "Aborting commit: secrets detected in staged files. Remove the secrets before committing." >&2
  exit 1
fi

exit 0
