#!/usr/bin/env bash
# filepath: /Users/gilliantunney/gbt-template-boilerplate/.husky/hook-lib.sh
set -euo pipefail

hook_banner() {
  local hook_name="${1:-hook}"
  shift || true

  printf "\n===\n>> %s\n" "$hook_name"
  while [ "$#" -gt 0 ]; do
    printf ">> %s\n" "$1"
    shift
  done
  printf "===\n\n"
}

get_branch() {
  git rev-parse --abbrev-ref HEAD
}

list_staged_files() {
  git diff --cached --name-only
}

assert_not_protected_branch() {
  local branch="$1"
  local protected_re="${2:-^(master|main)$}"

  if echo "$branch" | grep -Eq "$protected_re"; then
    printf "\nCommit directly to BRANCH '%s' is not allowed.\n\n" "$branch"
    exit 1
  fi
}

assert_valid_branch_name() {
  local branch="$1"
  local valid_re='^[a-z0-9]+([/-][a-z0-9]+)*$'

  if echo "$branch" | grep -Eq "$valid_re"; then
    return 0
  fi

  printf "\nBranch name must be lowercase [a-z0-9] and may contain '/' or '-': %s\n\n" "$branch"
  exit 1
}

assert_no_bad_chars_in_staged_filenames() {
  local bad_filename_re="${1:-[^A-Za-z0-9._/@ +\-]}"

  local bad_files
  bad_files="$(
    list_staged_files \
      | LC_ALL=C grep -nE "$bad_filename_re" \
      || true
  )"

  if [ -n "$bad_files" ]; then
    printf "\nBad characters in staged filenames.\n"
    printf "Allowed: A-Z a-z 0-9 space . _ - + @ /\n"
    printf "Offenders:\n%s\n\n" "$bad_files"
    exit 1
  fi
}