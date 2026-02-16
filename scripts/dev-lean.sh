#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LEAN_TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ticket-handoff-lean.XXXXXX")"

cleanup() {
  rm -rf "${LEAN_TMP_DIR}"
  rm -rf "${ROOT_DIR}/dist" "${ROOT_DIR}/src-tauri/target" "${ROOT_DIR}/node_modules/.vite" "${ROOT_DIR}/node_modules/.vite-temp"
}

trap cleanup EXIT INT TERM

export CARGO_TARGET_DIR="${LEAN_TMP_DIR}/cargo-target"
export VITE_CACHE_DIR="${LEAN_TMP_DIR}/vite-cache"

cd "${ROOT_DIR}"
npm run tauri dev -- "$@"
