# snailicid3-consumer-monorepo 🐌

> Reference [Snailicid3](https://github.com/gbtunney/snailicid3) consumer — a pnpm + Nx workspace
> wired to the shared `@snailicid3` configuration and the shared GitHub Actions callers.

[![Push Main](https://github.com/gbtunney/snailicid3-consumer-monorepo/actions/workflows/push-main.yml/badge.svg)](https://github.com/gbtunney/snailicid3-consumer-monorepo/actions/workflows/push-main.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)

This repository is both a **template** to copy into new projects and a **live consumer** that proves
the shared configuration and workflows still work end to end. It holds no published packages of its
own: the two packages under `packages/` are private examples.

## Packages

| Package                                                       | Status  | Purpose                                                          |
| ------------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| [`@gbt/template-example-package`](./packages/example-package) | Private | Node/TypeScript library example — tsdown build, Vitest tests     |
| [`@gbt/template-example-react`](./packages/example-react)     | Private | React + Vite example — Storybook, a11y, and Vitest browser tests |

## Shared configuration

| Package                                                                                      | Used for                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [`@snailicid3/config`](https://www.npmjs.com/package/@snailicid3/config)                     | ESLint, Prettier, markdownlint, commitlint, Nx presets |
| [`@snailicid3/build-config`](https://www.npmjs.com/package/@snailicid3/build-config)         | tsdown build plans (`tsdown.config.ts`)                |
| [`@snailicid3/storybook-config`](https://www.npmjs.com/package/@snailicid3/storybook-config) | Storybook `main` / `preview` entries                   |

## Requirements

- Node.js `>=20.0.0`
- pnpm `>=10.30.2 <11` (`pnpm@10.30.2` is pinned in `package.json`)

## Getting started

Run every command from the repository root — never `cd` into a package:

```sh
pnpm install
pnpm --filter=@gbt/root build
```

## Common commands

| Task                | Command                              |
| ------------------- | ------------------------------------ |
| Build the workspace | `pnpm --filter=@gbt/root build`      |
| Run all tests       | `pnpm --filter=@gbt/root test`       |
| Run lint checks     | `pnpm --filter=@gbt/root check`      |
| Apply lint fixes    | `pnpm --filter=@gbt/root fix`        |
| Check Markdown      | `pnpm --filter=@gbt/root check:md`   |
| Check API reports   | `pnpm --filter=@gbt/root api:check`  |
| Open the Nx graph   | `pnpm --filter=@gbt/root inspect:nx` |

Target one package through its workspace name:

```sh
pnpm --filter=@gbt/template-example-package build:nx
pnpm --filter=@gbt/template-example-react build:storybook:nx
```

## GitHub Actions

The workflows in `.github/workflows/` are **thin callers**. The implementation lives in
[`gbtunney/snailicid3-actions`](https://github.com/gbtunney/snailicid3-actions) and is consumed
through the moving `@v1` tag.

| Workflow                        | Trigger        | Purpose                                              |
| ------------------------------- | -------------- | ---------------------------------------------------- |
| `pr-checks.yml`                 | Pull request   | Release-state detection plus the validation pipeline |
| `push-main.yml`                 | Push to `main` | Required validation pipeline                         |
| `push-release.yml`              | Push to `main` | Release plan (dry run by default)                    |
| `dispatch-pipeline.yml`         | Manual         | Run the pipeline with explicit routine modes         |
| `dispatch-nx-targets.yml`       | Manual         | Run arbitrary Nx targets across all/affected         |
| `dispatch-release-plan.yml`     | Manual         | Version and publish                                  |
| `dispatch-release-state.yml`    | Manual         | Read-only release-state report                       |
| `dispatch-smoke-matrix.yml`     | Manual         | Pipeline across the supported Node versions          |
| `dispatch-workspace-update.yml` | Manual         | Apply fixes, docs, or API reports and commit         |

These files are **generated**. Do not edit them here — change the template in `snailicid3-actions`
under `templates/workflows/` and re-run its `bin/sync-callers.sh`:

```sh
# from a snailicid3-actions checkout, with this repo cloned alongside
bin/sync-callers.sh ../snailicid3-consumer-monorepo
bin/sync-callers.sh --check ../snailicid3-consumer-monorepo # verify, write nothing
```

## Using this repository as a template

[`TODO.md`](./TODO.md) holds the copy manifest — the files and folders to lift into a new repository
— along with the outstanding template checklist. `notes/Scaffold Procedure.md` records the scaffold
steps.

## Repository layout

```text
.github/    Thin caller workflows, issue templates, and instructions
notes/      Scaffold procedure, knowledge base, and scratch notes
packages/   Private example packages
```
