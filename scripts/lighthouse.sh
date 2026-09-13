#!/usr/bin/env bash
# Usage: scripts/lighthouse.sh <url> <out-prefix> [mobile|desktop]
# Writes <out-prefix>.json and <out-prefix>.html and prints category scores.
set -euo pipefail
URL="$1"; OUT="$2"; PRESET="${3:-mobile}"
export CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
EXTRA=""; [ "$PRESET" = "desktop" ] && EXTRA="--preset=desktop"
npx --no-install lighthouse "$URL" $EXTRA --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --output=json --output=html --output-path="$OUT" >/dev/null 2>&1 || true
# lighthouse appends .report.json/.report.html when two outputs are given
J="$OUT.report.json"; [ -f "$J" ] || J="$OUT.json"
node -e '
const r=require(require("path").resolve(process.argv[1]));const c=r.categories;
const s=Object.fromEntries(Object.entries(c).map(([k,v])=>[k,Math.round((v.score||0)*100)]));
const a=r.audits;const m=k=>a[k]&&a[k].displayValue;
console.log(JSON.stringify({url:r.finalDisplayedUrl,scores:s,lcp:m("largest-contentful-paint"),cls:m("cumulative-layout-shift"),tbt:m("total-blocking-time"),fcp:m("first-contentful-paint"),speedIndex:m("speed-index"),
 failing:Object.values(a).filter(x=>x.score!==null&&x.score<0.9&&x.scoreDisplayMode!=="informative"&&x.scoreDisplayMode!=="notApplicable"&&x.scoreDisplayMode!=="manual").map(x=>x.id+" ("+Math.round(x.score*100)+")").slice(0,40)}));
' "$J"
