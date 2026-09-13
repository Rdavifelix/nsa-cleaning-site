#!/usr/bin/env bash
# Rebuilds preview/ every 45s (tolerant of half-written pages) and serves it on port 4000.
cd "$(dirname "$0")/.."
node scripts/serve.mjs --root preview --port 4000 &
while true; do BUILD_TOLERANT=1 OUT_DIR=preview node build.mjs >/dev/null 2>&1; sleep 45; done
