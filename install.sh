#!/bin/sh
# docodego installer — macOS / Linux.
#
# Downloads the latest release binary for this platform, verifies its sha256
# against the release's published sha256sums.txt, and installs it into
# PREFIX (default: ~/.local/bin).
#
#   curl -fsSL https://raw.githubusercontent.com/DoCoDeGo/docodego-alpha/main/install.sh | sh
#
# Override the target directory:
#   PREFIX=/usr/local/bin sh install.sh
#
# Windows: download docodego-windows-x64.exe from
#   https://github.com/DoCoDeGo/docodego-alpha/releases
set -eu

REPO="DoCoDeGo/docodego-alpha"
PREFIX="${PREFIX:-$HOME/.local/bin}"

case "$(uname -s)" in
  Darwin) plat=darwin ;;
  Linux)  plat=linux ;;
  *)
    echo "docodego installer: no prebuilt binary for $(uname -s) — see https://github.com/$REPO/releases" >&2
    exit 1
    ;;
esac
case "$(uname -m)" in
  arm64|aarch64) arch=arm64 ;;
  x86_64)        arch=x64 ;;
  *)
    echo "docodego installer: unsupported architecture $(uname -m)" >&2
    exit 1
    ;;
esac
asset="docodego-$plat-$arch"

command -v curl >/dev/null 2>&1 || {
  echo "docodego installer: curl is required" >&2
  exit 1
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "docodego installer: resolving the latest release…"
ver=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | sed -n 's/.*"tag_name": *"v\([^"]*\)".*/\1/p')
[ -n "$ver" ] || {
  echo "docodego installer: could not resolve the latest release" >&2
  exit 1
}

echo "docodego installer: downloading $asset v$ver"
curl -fsSL -o "$tmp/$asset" "https://github.com/$REPO/releases/download/v$ver/$asset"
curl -fsSL -o "$tmp/sha256sums.txt" "https://github.com/$REPO/releases/download/v$ver/sha256sums.txt"

# verify before anything touches disk outside the temp dir
grep -E "  $asset\$" "$tmp/sha256sums.txt" > "$tmp/expected.txt"
[ -s "$tmp/expected.txt" ] || {
  echo "docodego installer: $asset not found in the release checksums" >&2
  exit 1
}
(
  cd "$tmp"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c expected.txt >/dev/null
  else
    shasum -a 256 -c expected.txt >/dev/null
  fi
) || {
  echo "docodego installer: checksum verification failed — nothing was installed" >&2
  exit 1
}

mkdir -p "$PREFIX"
mv "$tmp/$asset" "$PREFIX/docodego"
chmod +x "$PREFIX/docodego"

echo "docodego installer: verified against sha256sums.txt ✓"
"$PREFIX/docodego" --version
echo "docodego installer: installed to $PREFIX/docodego — make sure $PREFIX is on your PATH"
