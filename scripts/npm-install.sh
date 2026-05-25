#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

if [ ! -f package.json ]; then
  echo "Missing package.json in repo root (${REPO_ROOT})" >&2
  exit 1
fi

npm ci
