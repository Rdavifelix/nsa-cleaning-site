#!/usr/bin/env bash
# Publishes the PRODUCTION site to the custom domain in site.config.json (siteUrl).
#
#   scripts/deploy.sh            build, check, publish, then ping IndexNow
#   scripts/deploy.sh --dry      build and check only, publish nothing
#
# Production today: Rdavifelix/nsa-cleaning-site, branch gh-pages, GitHub Pages with the custom
# domain lp.nsacleaningllc.com. Pushing there needs write access to that repo.
#
# Do not confuse this with scripts/deploy-pages.sh without CUSTOM_DOMAIN: that one builds with
# PREVIEW=1 and, pushed to the production repo, would put noindex on every page of the live site.
# This script refuses to publish anything that looks like that.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${DEPLOY_REPO:-Rdavifelix/nsa-cleaning-site}"
SITE_URL="$(node -e 'console.log(JSON.parse(require("fs").readFileSync("site.config.json","utf8")).siteUrl.replace(/\/+$/,""))')"
DOMAIN="${SITE_URL#https://}"
DRY=0; [ "${1:-}" = "--dry" ] && DRY=1

if [ "${PREVIEW:-}" = "1" ]; then echo "ABORTED: PREVIEW=1 is set. This script only publishes production." >&2; exit 1; fi

echo "→ Building production into dist/ for $SITE_URL"
BASE_PATH="" node build.mjs

echo "→ Checking the build before anything leaves this machine"
fail() { echo "   ABORTED: $1" >&2; exit 1; }
pages=$(find dist -name 'index.html' | wc -l | tr -d ' ')
[ "$pages" -ge 30 ] || fail "only $pages pages built, expected 30 or more"
noindexed=$(grep -rl 'content="noindex' dist --include='*.html' | wc -l | tr -d ' ')
[ "$noindexed" -le 3 ] || fail "$noindexed pages carry noindex. This looks like a PREVIEW build."
grep -q 'content="noindex' dist/index.html && fail "the home page is noindex. This is a PREVIEW build."
grep -q "^Sitemap: $SITE_URL/sitemap.xml" dist/robots.txt || fail "robots.txt does not point the sitemap at $SITE_URL"
grep -q 'Disallow: /$' dist/robots.txt && fail "robots.txt disallows everything. This is a PREVIEW build."
node scripts/check-links.mjs >/dev/null || fail "broken internal links (run: node scripts/check-links.mjs)"
node scripts/check-copy.mjs src >/dev/null || fail "copy linter failed (run: npm run lint:copy)"
node scripts/check-seo.mjs >/dev/null || fail "SEO check failed (run: node scripts/check-seo.mjs)"
echo "   ok: $pages pages, $noindexed noindex, domain $DOMAIN"
[ "$DRY" = "1" ] && { echo "--dry: nothing published."; exit 0; }

echo "→ Publishing to $REPO (gh-pages)"
OUT="$(mktemp -d)"; trap 'rm -rf "$OUT"' EXIT
cp -R dist/. "$OUT/"
echo "$DOMAIN" > "$OUT/CNAME"   # GitHub Pages drops the custom domain without it
cd "$OUT"
git init -q && git checkout -qb gh-pages && git add -A
git -c user.name="${GIT_NAME:-NSA site deploy}" -c user.email="${GIT_EMAIL:-deploy@local}" \
  commit -qm "Production build $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q --force "https://github.com/${REPO}.git" gh-pages
cd - >/dev/null

echo "→ Waiting for GitHub Pages to serve the new build"
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL/house-cleaning-troy-ny/")
  [ "$code" = "200" ] && break
  sleep 10
done
echo "   $SITE_URL/house-cleaning-troy-ny/ responds $code"

echo "→ Telling Bing and Yandex what changed"
node scripts/indexnow.mjs || echo "   IndexNow failed, not fatal. Everything else is live."

echo
echo "Done. $SITE_URL/"
echo "Google does not take IndexNow: submit the sitemap and request indexing in Search Console."
