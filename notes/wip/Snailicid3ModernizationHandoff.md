# Snailicid3 Consumer Modernization — Handoff

Branch: `claude/modernize-boilerplate-snailicid3-sy3xdd` (continues PR #56 / `chore/deps-update`)

Commits:

- `e26fad3` — sync caller workflows from snailicid3-actions templates
- `d1cbfb5` — adopt shared Storybook config, fix stale template metadata

## 1. What changed

### Caller workflows

All nine callers were synced from `snailicid3-actions/templates/workflows` using that repo's own
`bin/sync-callers.sh`, including `dispatch-nx-targets.yml`, which this repo was missing entirely.
Eight of the nine are now byte-identical to `gbtunney/snailicid3`.

This was a **repair, not a refresh**. Every one of the eight caller jobs was passing inputs that
`call-pipeline.yml@v1` and `call-release-plan.yml@v1` do not declare:

```text
require_lockfile   run_build       run_test        run_docs_build   run_chromatic
pnpm_cache         disable_nx_cloud nx_cache_reset  use_nx_affected  nx_targets   nx_fix_ci
```

A reusable workflow rejects an undeclared input at startup, so those jobs never ran. The Actions
history confirms it — PR #56, both `main` push workflows, and every manual dispatch since late
August ended in `startup_failure`. The last green runs referenced `call-pipeline.yml@main`, before
PR #52 pinned this repo to `@v1`. The `v1` tag then moved to the mode-based contract on 2026-08-22
and this repo never re-synced.

The callers now use the mode-based contract (`lockfile_mode`, `build_mode`, `test_mode`,
`docs_mode`) and the explicit secret contract in place of blanket `secrets: inherit`.

`run_chromatic` was dropped: no published `call-pipeline` contract has ever declared it. Chromatic
still runs through the package's own Nx target with `CHROMATIC_PROJECT_TOKEN` in `.env.local`.

> `notes/scratch/CI.md` describes the retired input contract (`require_lockfile`, `run_build`,
> `nx_cache_reset`, …). Left untouched as scratch, but it no longer matches the shared pipeline.

### Packages and docs

- `.storybook/main.ts` now builds from `@snailicid3/storybook-config@0.1.3`.
- Replaced the literal `https://github.com/OWNER/REPOSITORY` placeholder in both example packages,
  and corrected example-react's `repository.directory`, which pointed at `packages/example-package`.
- Dropped stale `packageManager: pnpm@10.9.0` from both packages. The root pins `pnpm@10.30.2`, and
  snailicid3's own example package sets none.
- Replaced the root README, which was a copy of the obsolete `@snailicide/build-config` readme — a
  different package, a Rollup toolchain, and the retired `snailicide-monorepo`.
- Moved the example-package readme from `src/` to the package root, matching snailicid3, and
  corrected its name and links. Added a readme for the React example.
- Removed the stale `.husky/bk.commit-msg` backup. The three live hooks already matched snailicid3
  byte for byte, so Husky needed nothing else.

Toolchain held exactly as required: TypeScript `6.0.3`, tsdown `0.22.14`, `@tsdown/css` `0.22.14`.

### Two findings worth acting on upstream

**`defineStorybookPreview` is unusable in a consumer.** Storybook bundles `preview.ts` into the
browser preview, and that helper reaches `@snailicid3/config`, whose barrel pulls in api-extractor,
node-utils and the ESLint stack. Vite externalizes `node:fs` / `node:path` / `node:child_process`
and the preview build fails. `main.ts` is loaded in Node, so it uses the shared config fine. The
reason is recorded in `packages/example-react/.storybook/preview.ts`. Fix is upstream: reach the
`defineConfig` helper without a Node-only import.

**`DEFAULT_STORYBOOK_ADDONS` is stale.** It still names `@storybook/addon-essentials`, removed in
Storybook 9, which does not resolve on the Storybook 10 line this package uses. That is why the
addon list stays explicit here rather than taking the shared default.

Also fixed in passing: `.storybook/*.ts` sat outside every tsconfig project, so ESLint refused to
parse those files. Pre-existing; it only surfaced because these files changed. The `include` globs
never matched the directory despite the `//otherwise .storybook will error` comment.

## 2. Blocked by Actions v1

`v1` is stale. It points at `fb4f2dd` (PR #21, 2026-08-22), 20 commits behind `main`, and
`call-release-observe.yml` does not exist on it.

**The caller sync itself was not blocked.** snailicid3's checked-in callers are still the pre-#30
generation and pass only inputs `v1` declares; every caller job's inputs and secrets were checked
mechanically against the actual `v1` workflow bodies.

What _is_ blocked is the post-#30 generation on `main`: its `pr-checks.yml` calls
`call-release-observe.yml@v1`, and its `push-release.yml` passes `release_mode` / `adapter_ref`.
**snailicid3 is itself deliberately drifted for exactly this reason.** So this repo was synced from
`3c7d151` (pre-#30) — the newest template generation whose contract matches `v1`.

The finished contract is **not** published by moving `v1`. Moving a major alias onto an incompatible
contract is what broke this repository in the first place. It is published as a new major tag, `v2`,
leaving `v1` in place for consumers that have not migrated — see snailicid3-actions#31.

Once `v2.0.0` and `v2` exist at `b2e63bb` and #31 is merged, both repos re-sync together:

```sh
bin/sync-callers.sh ../snailicid3 ../gbt-template-boilerplate
bin/sync-callers.sh --check ../snailicid3 ../gbt-template-boilerplate
```

### Confirmed by a live run

PR #57's `pr-checks` run is the first successful run on this repository since the break — it
resolved `call-pipeline.yml@v1` and `call-detect-release-state.yml@v1` at `fb4f2dd` and came back
green:

| Check                  | Result                          |
| ---------------------- | ------------------------------- |
| `merge main`           | success                         |
| `detect release state` | success                         |
| `pending changeset`    | skipped — no pending changesets |
| `pending release`      | skipped — no publish candidates |
| `main / pipeline`      | success                         |
| `required`             | success                         |

The two skipped jobs are the router working as designed: the detector reported no pending changesets
and no publish candidates, so `should_skip` selected the plain validation pipeline.

### Separate: snailicid3 needs a re-sync

snailicid3's `pr-checks.yml` is missing the PR #24 concurrency fix that is in the template — its
reruns still cancel healthy in-flight runs. This repo now carries the fix; snailicid3 does not.

## 3. Remaining repo-move metadata

Everything points at the current canonical name, so the move is a find-and-replace of
`gbtunney/gbt-template-boilerplate` in:

| Location                                | What                           |
| --------------------------------------- | ------------------------------ |
| `package.json`                          | `repository.url`               |
| `packages/example-package/package.json` | `repository.url`               |
| `packages/example-react/package.json`   | `repository.url`               |
| `README.md`                             | badge URL and repository links |
| `packages/example-package/README.md`    | repository links               |
| `packages/example-react/README.md`      | repository links               |
| `notes/Scaffold Procedure.md`           | clone URL                      |
| `TODO.md`                               | title line                     |

Nothing depends on the old path beyond these strings.

## 4. Safe to squash + move?

Yes from this repo's side, with one sequencing caveat.

Validation is green from the repository root: frozen install, build, check, test, `api:check`,
`check:md`, Storybook build, and a clean working tree afterward.

`api:check` runs zero tasks, which is **correct** — neither example package is published, and
snailicid3's own example package likewise declares no api targets. Only published packages do.

That caveat is now cleared: PR #57's `pr-checks` run is green and `mergeable_state` is clean, so the
caller set is proven rather than assumed.

The remaining sequencing point is Actions `v2`. The callers here are the interim v1-compatible
generation; the finished semantic contract ships as `v2` (snailicid3-actions#31), and this repo
re-syncs to it once that tag exists. The repository is green either way — the v2 sync is a
follow-up, not a prerequisite for the squash and move.

## Left for Gillian, untouched

- Changesets for the two example packages
- Versioning and publishing them
- The repository squash / history rewrite
- The rename and move
