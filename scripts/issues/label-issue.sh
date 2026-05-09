#!/usr/bin/env bash
set -euo pipefail
REPO="${REPO:-}"
ISSUE=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --repo)
            REPO="$2"
            shift 2
            ;;
        --issue)
            ISSUE="$2"
            shift 2
            ;;
        *)
            echo "Unknown arg: $1" >&2
            exit 1
            ;;
    esac
done
[[ -z "$REPO" ]] && REPO="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
if [[ -z "$ISSUE" ]]; then
    echo "Usage: scripts/issues/label-issue.sh --repo owner/name --issue 123" >&2
    exit 1
fi
issue_json="$(gh issue view "$ISSUE" --repo "$REPO" --json title,body)"
title="$(echo "$issue_json" | jq -r '.title')"
body="$(echo "$issue_json" | jq -r '.body // ""')"
labels=()
add_label() {
    local label="$1"
    for existing in "${labels[@]:-}"; do [[ "$existing" == "$label" ]] && return; done
    labels+=("$label")
}
normalize_value() { tr '[:upper:]' '[:lower:]' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//' | sed -E 's#[[:space:]/]+#-#g'; }
field_value() {
    local label="$1"
    echo "$body" | awk -v label="$label" '$0 ~ "^### " label "$" { getline; while ($0 == "") getline; print; exit }' | normalize_value
}
add_prefixed_field_label() {
    local field="$1" prefix="$2" value
    value="$(field_value "$field")"
    if [[ -n "$value" && "$value" != "none" && "$value" != "_no-response_" ]]; then add_label "${prefix}:${value}"; fi
}
add_prefixed_field_label "Issue Type" "type"
add_prefixed_field_label "Scope" "scope"
add_prefixed_field_label "Category" "category"
add_prefixed_field_label "Domain" "domain"
add_prefixed_field_label "Sync Mode" "sync"
add_prefixed_field_label "Priority" "priority"
if [[ ${#labels[@]} -eq 0 ]]; then
    case "$title" in
        ci:* | *"required check"* | *"github action"*)
            add_label "type:ci"
            add_label "scope:repo"
            add_label "domain:github-actions"
            ;;
        release:* | *"changeset"* | *"version branch"*)
            add_label "type:release"
            add_label "scope:repo"
            add_label "domain:changesets"
            ;;
        api:*)
            add_label "type:feature"
            add_label "domain:api"
            ;;
        utils:*)
            add_label "scope:utils"
            add_label "domain:string-helpers"
            ;;
        template:*)
            add_label "scope:template"
            add_label "domain:template-sync"
            ;;
    esac
fi
if [[ ${#labels[@]} -eq 0 ]]; then
    echo "No labels detected for $REPO#$ISSUE"
    exit 0
fi
label_csv="$(
    IFS=,
    echo "${labels[*]}"
)"
echo "Applying labels to $REPO#$ISSUE"
printf '  %s\n' "${labels[@]}"
gh issue edit "$ISSUE" --repo "$REPO" --add-label "$label_csv"
