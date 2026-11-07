#!/bin/sh
# Agentic-test arena setup — plant one docodego repo per brief.
# usage: scripts/agentic-setup.sh <arena-dir> [product ...]
# products default to the full suite (00–04).
set -e

ARENA="${1:?usage: agentic-setup.sh <arena-dir> [product ...]}"
shift || true
PRODUCTS="${*:-00-finessetry 01-swatchship 02-bodyarchetype 03-grademyfit 04-planmyskin}"

# v2 repo root (this script lives in <root>/scripts)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$ROOT/apps/cli/src/main.ts"

mkdir -p "$ARENA"
for p in $PRODUCTS; do
  DIR="$ARENA/$p"
  mkdir -p "$DIR"
  cd "$DIR"
  git init -q .
  node --experimental-strip-types "$CLI" init
  git add -A
  git commit -q -m "chore: plant the record layer"
  echo "planted $DIR"
done
echo "-- arena ready: $ARENA"
echo "-- next: spawn one fresh-context agent per repo; prompt = docs/agentic-tests/directive.md"
echo "   wrapped around docs/agentic-tests/briefs/<product>.md"
