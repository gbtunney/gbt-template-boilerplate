#!/usr/bin/env bash
set -euo pipefail
REPO="${REPO:-$(gh repo view --json nameWithOwner --jq '.nameWithOwner')}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
state="${1:-open}"
echo "labeling $state issues for $REPO"
issue_numbers="$(gh issue list --repo "$REPO" --state "$state" --limit 1000 --json number --jq '.[].number')"
if [[ -z "$issue_numbers" ]]; then
    echo "No $state issues found."
    exit 0
fi
while IFS= read -r issue_number; do
    [[ -z "$issue_number" ]] && continue
    bash "$SCRIPT_DIR/label-issue.sh" --repo "$REPO" --issue "$issue_number"
done <<< "$issue_numbers"
