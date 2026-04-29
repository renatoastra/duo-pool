#!/usr/bin/env bash
# Hook: run a scoped `bun --filter <pkg> type-check` after every Write/Edit
# to a TypeScript file. On failure, exit 2 — the harness's asyncRewake
# brings the failure back into the agent as a system-reminder so it can
# fix immediately instead of accumulating broken state.
#
# Why scoped instead of full `bun verify`?
# - Full verify is ~5s; scoped type-check is ~1s.
# - Tests run on the Stop hook (when an agent's turn finishes), not
#   per-edit, to keep individual edits fast during /duo.exec.

set -u

# Resolve repo root from this script's location (works in worktrees).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Read the JSON payload from stdin and pull the edited file path.
input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')

# Skip non-source files quickly.
case "$file" in
  *.ts|*.tsx|*.mts) ;;
  *) exit 0 ;;
esac

# Map file path to its workspace package.
case "$file" in
  *packages/database/*)    pkg="@duopool/database" ;;
  *packages/contracts/*)   pkg="@duopool/contracts" ;;
  *packages/api/*)         pkg="@duopool/api" ;;
  *packages/motion/*)      pkg="@duopool/motion" ;;
  *packages/mocks/*)       pkg="@duopool/mocks" ;;
  *packages/test-config/*) pkg="@duopool/test-config" ;;
  *apps/web/*)             pkg="@duopool/web" ;;
  *)                        exit 0 ;; # outside any package — skip
esac

cd "$REPO_ROOT" || exit 0

# Run scoped type-check, capture output for the rewake summary.
output=$(bun --filter "$pkg" type-check 2>&1)
status=$?

if [ $status -ne 0 ]; then
  echo "$output" | tail -20
  exit 2
fi

exit 0
