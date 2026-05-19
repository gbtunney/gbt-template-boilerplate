# Issue label helper files

Copy these files into the target repository, then sync or adapt them into any related repositories.

## Files

- `.github/label-schema.yml` — canonical label list.
- `.github/ISSUE_TEMPLATE/work-item.yml` — issue form with fields matching label suffixes.
- `.github/workflows/label-issue.yml` — labels issues when opened/edited/reopened.
- `scripts/issues/sync-labels.sh` — creates/updates repo labels.
- `scripts/issues/label-issue.sh` — applies labels to one issue from issue-form fields.
- `scripts/issues/label-all-issues.sh` — applies labels to all open/all issues.

## Optional package scripts

```json
{
  "scripts": {
    "issue:sync-labels": "bash scripts/issues/sync-labels.sh",
    "issue:label": "bash scripts/issues/label-issue.sh",
    "issue:label:all": "bash scripts/issues/label-all-issues.sh"
  }
}
```

## Setup

```sh
chmod +x scripts/issues/*.sh

pnpm issue:sync-labels
REPO="owner/other-repo" pnpm issue:sync-labels
```

## Label one issue

```sh
pnpm issue:label -- --repo owner/repo --issue 14
```

## Label all open issues

```sh
REPO="owner/repo" pnpm issue:label:all
```
