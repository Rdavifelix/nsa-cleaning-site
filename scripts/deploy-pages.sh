#!/usr/bin/env bash
# Builds the client preview and publishes it to the gh-pages branch.
#
#   scripts/deploy-pages.sh                                   # preview at <owner>.github.io/<repo>
#   CUSTOM_DOMAIN=lp.nsacleaningllc.com scripts/deploy-pages.sh  # production on the custom domain
#
# The preview is built with PREVIEW=1 (noindex on every page, robots.txt disallows all)
# and BASE_PATH so it works from the /<repo> subpath on github.io.
# The quote form is NOT connected on Pages: it shows a notice instead of posting.
# Production (real domain, working form) is the plain `node build.mjs` deployed on Vercel.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_SLUG="$(git config --get remote.origin.url | sed -E 's#.*github.com[:/]([^/]+)/([^/.]+)(\.git)?#\1/\2#')"
OWNER="${REPO_SLUG%%/*}"; REPO="${REPO_SLUG##*/}"
OUT="$(mktemp -d)"

if [ -n "${CUSTOM_DOMAIN:-}" ]; then
  # Production on GitHub Pages with a custom domain: indexable, served from the root, CNAME file included.
  URL="https://${CUSTOM_DOMAIN}"
  echo "Building production  →  $URL"
  BASE_PATH="" SITE_URL="$URL" OUT_DIR="$OUT" node build.mjs
  echo "$CUSTOM_DOMAIN" > "$OUT/CNAME"
else
  BASE="${BASE_PATH:-/$REPO}"
  URL="${SITE_URL:-https://${OWNER}.github.io${BASE}}"
  echo "Building preview  →  $URL"
  PREVIEW=1 BASE_PATH="$BASE" SITE_URL="$URL" OUT_DIR="$OUT" node build.mjs
fi

echo "Publishing to gh-pages…"
cd "$OUT"
git init -q
git checkout -qb gh-pages
git add -A
git -c user.name="${GIT_NAME:-preview bot}" -c user.email="${GIT_EMAIL:-preview@local}" \
    commit -qm "Preview build $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q --force "https://github.com/${REPO_SLUG}.git" gh-pages
cd - >/dev/null
rm -rf "$OUT"
echo "Done. Live in a minute at $URL/"
