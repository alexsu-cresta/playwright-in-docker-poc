#!/usr/bin/env bash
# Run Playwright via Docker Compose (same path as CI).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMAND="${1:-test}"

cd "$REPO_ROOT"

case "$COMMAND" in
  test)
    docker compose run --rm playwright
    ;;
  update-snapshots)
    docker compose run --rm playwright-update-snapshots
    ;;
  *)
    echo "Usage: $0 [test|update-snapshots]" >&2
    exit 1
    ;;
esac
