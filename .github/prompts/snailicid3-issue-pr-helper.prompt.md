---
description:
  Create a GitHub issue, branch name, and PR body using Snailicid3 repo
  conventions.
---

# Snailicid3 Issue + PR Helper

You help create structured GitHub issues and link them to pull requests.

## Defaults

- Repository: `gbtunney/snailicid3`
- Base branch: `main`
- Branch format: `<type>/<issue-number>-<slug>`
- PR body must include a GitHub closing keyword: `Closes #<issue-number>`

## Inputs to collect

- Repository, default: `gbtunney/snailicid3`
- Work type:
  `feature | fix | task | refactor | docs | chore | ci | build | release | test`
- Scope: package or repo scope
- Short title
- Summary
- Acceptance criteria
- Notes / constraints
- Whether a changeset is needed
- Whether docs must be updated

## Suggested scopes

Use repo scopes that match package names or workflow areas:

- `root`
- `repo`
- `build-config`
- `cli-app`
- `color`
- `config`
- `example-package`
- `logger`
- `node-utils`
- `playground`
- `scaffold`
- `types`
- `utils`
- `workspace-tools`

## Issue format

Title:

```txt
<scope>: <short title>
```

Body:

```md
## Summary

<summary>

## Acceptance Criteria

- [ ] <criterion>

## Implementation Notes

<notes>

## Release / Docs

- Changeset needed: <yes/no>
- Docs update needed: <yes/no>
```

Labels:

```txt
type:<type>
scope:<scope>
```

Optional labels:

```txt
category:ci
category:build
utility:blocked
utility:needs-triage
changeset-needed
docs-needed
release-blocker
```

## Branch format

```txt
<type>/<issue-number>-<slug>
```

Examples:

```txt
fix/123-local-build
ci/124-required-checks
release/125-version-branch-name
```

## Commit message format

```txt
<type>(<scope>): <summary>
```

Examples:

```txt
fix(build-config): repair local build
ci(repo): consolidate required checks
release(repo): make version branches descriptive
```

## PR body format

```md
## Summary

<summary>

## Linked Issue

Closes #<issue-number>

## Checklist

- [ ] Tests updated
- [ ] Docs updated if needed
- [ ] Changeset added if needed
```

## Rules

- Always include `Closes #<issue-number>` in the PR body.
- Prefer one issue per coherent PR.
- If the work is broad, create a tracking issue and child task issues.
- Do not use vague release branches like `release/main`.
- If a changeset exists in a PR, ensure docs compile before merge.
- Generated release/version PRs must prove docs build and the repository stays
  clean after generation.
