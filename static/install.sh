#!/usr/bin/env bash
# mclovin public install script.
# Served at https://mclovin.org/install.sh.
#
# Downloads the latest pre-release binary from the public mclovin-release
# repo, verifies its sha256, and installs to ~/.local/bin/mclovin.
#
# Usage:
#   curl -fsSL https://mclovin.org/install.sh | bash
#   curl -fsSL https://mclovin.org/install.sh | bash -s v0.1.0-alpha.1   # pin tag
#
# Linux x86_64 only for now.

set -euo pipefail

REPO="guilhermeyo/mclovin-release"
VERSION="${1:-latest}"
INSTALL_DIR="${MCLOVIN_INSTALL_DIR:-$HOME/.local/bin}"
BINARY_NAME="mclovin"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "error: '$1' is required but not installed" >&2
    exit 1
  fi
}

require_cmd curl
require_cmd sha256sum

case "$(uname -s)" in
  Linux*) ;;
  *)
    echo "error: only Linux is supported right now (uname=$(uname -s))" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64|amd64) ARCH="x86_64" ;;
  *)
    echo "error: only x86_64 is supported right now (arch=$(uname -m))" >&2
    exit 1
    ;;
esac

ASSET="mclovin-linux-${ARCH}"
SHA_ASSET="${ASSET}.sha256"

# Resolve "latest" to the most recent tag (including pre-releases).
if [ "$VERSION" = "latest" ]; then
  VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases" \
    | grep -m1 '"tag_name"' \
    | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
fi

if [ -z "$VERSION" ]; then
  echo "error: could not resolve a release version from GitHub API" >&2
  exit 1
fi

DL_BASE="https://github.com/${REPO}/releases/download/${VERSION}"

echo "==> Installing mclovin ${VERSION}"
echo "    To: ${INSTALL_DIR}/${BINARY_NAME}"

mkdir -p "$INSTALL_DIR"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

curl -fsSL -o "${TMP}/${ASSET}"     "${DL_BASE}/${ASSET}"
curl -fsSL -o "${TMP}/${SHA_ASSET}" "${DL_BASE}/${SHA_ASSET}"

(cd "$TMP" && sha256sum -c "${SHA_ASSET}")

install -m 755 "${TMP}/${ASSET}" "${INSTALL_DIR}/${BINARY_NAME}"

echo "==> Installed: ${INSTALL_DIR}/${BINARY_NAME}"

# Register as default browser + drop the .desktop entry in one go.
# `mclovin setup` is idempotent — running it again on an already-set
# install is a no-op, so re-running this script is safe.
echo
if "${INSTALL_DIR}/${BINARY_NAME}" setup >/dev/null 2>&1; then
  echo "==> Registered as default browser (mclovin.desktop installed)"
else
  echo "!!  Auto-setup failed. Run \`${BINARY_NAME} setup\` manually to register" >&2
  echo "    as default. \`${BINARY_NAME} doctor\` shows what's missing." >&2
fi
echo
echo "Ready. Open mclovin from your app launcher (Walker, rofi, GNOME/KDE menu)"
echo "or run: ${BINARY_NAME} settings"
