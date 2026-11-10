#!/bin/sh
# Agentic-test arena setup — plant one docodego repo per brief.
# usage: scripts/agentic-setup.sh <arena-dir> [product ...]
# products are chosen per run (on-the-fly briefs); example:
#   scripts/agentic-setup.sh ~/docodego-test-products 05-wardrobeclimate 06-tryonface
set -e

ARENA="${1:?usage: agentic-setup.sh <arena-dir> [product ...]}"
shift || true
PRODUCTS="${*:?name the products for this round — briefs are authored on the fly, not preset}"

# v2 repo root (this script lives in <root>/scripts)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$ROOT/apps/cli/src/main.ts"

mkdir -p "$ARENA"
for p in $PRODUCTS; do
  DIR="$ARENA/$p"
  mkdir -p "$DIR"
  cd "$DIR"
  # the record layer is planted by OUR codebase's CLI, run with the
  # product repo as the working directory. init is the whole birth:
  # git init + the birth commit happen inside it (records are born
  # under version control — unit 710). No manual git steps here.
  node --experimental-strip-types "$CLI" init --profile product-team
  echo "planted $DIR"
done
echo "-- arena ready: $ARENA"
echo "-- next: author the briefs (short, complex enough), then spawn one"
echo "   fresh-context agent per repo; prompt = docs/agentic-tests/directive.md"
echo "   wrapped around the brief"
